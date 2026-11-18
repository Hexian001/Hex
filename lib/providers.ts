import { localDemoReply } from "@/lib/demo-reply";
import { isModelId, modelById, type ModelId } from "@/lib/models";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type Availability = Record<ModelId, boolean>;

const LIVE_SYSTEM =
  "You are answering inside Hivera, a workspace that can route to several model families. Reply to the user directly.";

export function readAvailability(): Availability {
  return {
    claude: hasKey("ANTHROPIC_API_KEY"),
    chatgpt: hasKey("OPENAI_API_KEY"),
    llama: hasKey("GROQ_API_KEY"),
    deepseek: hasKey("DEEPSEEK_API_KEY"),
  };
}

export async function completeChat(
  modelId: ModelId,
  messages: ChatTurn[],
): Promise<{ mode: "demo" | "live"; text: string; label: string }> {
  const model = modelById(modelId);
  const history = normalizeTurns(messages);
  const lastUser = [...history].reverse().find((turn) => turn.role === "user");
  if (!lastUser) {
    throw new ProviderError("Send a prompt before asking for a reply.", 400);
  }

  if (!readAvailability()[modelId]) {
    return {
      mode: "demo",
      label: model.label,
      text: localDemoReply(model.label, lastUser.content),
    };
  }

  const text = await callLive(modelId, history);
  return { mode: "live", label: model.label, text };
}

export function parseChatRequest(body: unknown): {
  model: ModelId;
  messages: ChatTurn[];
} {
  if (!body || typeof body !== "object") {
    throw new ProviderError("The request body must be a JSON object.", 400);
  }

  const record = body as { model?: unknown; messages?: unknown };
  if (typeof record.model !== "string" || !isModelId(record.model)) {
    throw new ProviderError(
      "Choose Claude, ChatGPT, Llama, or DeepSeek.",
      400,
    );
  }
  if (!Array.isArray(record.messages) || record.messages.length === 0) {
    throw new ProviderError("Include at least one message.", 400);
  }
  if (record.messages.length > 24) {
    throw new ProviderError("This thread is too long to send.", 400);
  }

  const messages = record.messages.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new ProviderError("Each message needs a role and text.", 400);
    }
    const turn = entry as { role?: unknown; content?: unknown };
    if (typeof turn.content !== "string") {
      throw new ProviderError("Message text must be a string.", 400);
    }
    if (turn.content.length > 4000) {
      throw new ProviderError("Each message is limited to 4,000 characters.", 400);
    }
    const message: ChatTurn = { role: asRole(turn.role), content: turn.content };
    return message;
  });

  return { model: record.model, messages };
}

export class ProviderError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

function asRole(value: unknown): ChatTurn["role"] {
  if (value === "user" || value === "assistant") return value;
  throw new ProviderError("Message roles must be user or assistant.", 400);
}

function hasKey(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function normalizeTurns(messages: ChatTurn[]): ChatTurn[] {
  const cleaned = messages
    .map((turn) => ({ ...turn, content: turn.content.trim() }))
    .filter((turn) => turn.content.length > 0);

  while (cleaned[0]?.role === "assistant") {
    cleaned.shift();
  }

  const merged: ChatTurn[] = [];
  for (const turn of cleaned) {
    const previous = merged[merged.length - 1];
    if (previous && previous.role === turn.role) {
      previous.content = `${previous.content}\n\n${turn.content}`;
    } else {
      merged.push({ ...turn });
    }
  }

  return merged.slice(-12);
}

async function callLive(modelId: ModelId, messages: ChatTurn[]): Promise<string> {
  switch (modelId) {
    case "claude":
      return callAnthropic(messages);
    case "chatgpt":
      return callOpenAICompatible({
        url: "https://api.openai.com/v1/chat/completions",
        apiKey: requiredKey("OPENAI_API_KEY"),
        model: process.env.OPENAI_MODEL?.trim() || "gpt-4o",
        messages,
      });
    case "llama":
      return callOpenAICompatible({
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: requiredKey("GROQ_API_KEY"),
        model: process.env.GROQ_LLAMA_MODEL?.trim() || "llama-3.3-70b-versatile",
        messages,
      });
    case "deepseek":
      return callOpenAICompatible({
        url: "https://api.deepseek.com/chat/completions",
        apiKey: requiredKey("DEEPSEEK_API_KEY"),
        model: process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat",
        messages,
      });
  }
}

async function callAnthropic(messages: ChatTurn[]): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal: AbortSignal.timeout(25_000),
    headers: {
      "content-type": "application/json",
      "x-api-key": requiredKey("ANTHROPIC_API_KEY"),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-5",
      max_tokens: 700,
      system: LIVE_SYSTEM,
      messages,
    }),
  });

  const payload = await readPayload(response);
  if (!response.ok) {
    throw new ProviderError(
      `Claude’s API returned ${response.status}. ${excerpt(payload)}`,
      502,
    );
  }

  const content = asRecord(payload).content;
  if (!Array.isArray(content)) {
    throw new ProviderError("Claude’s API returned no text.", 502);
  }
  const text = content
    .map((part) => {
      const record = asRecord(part);
      return record.type === "text" && typeof record.text === "string"
        ? record.text
        : "";
    })
    .join("")
    .trim();
  if (!text) {
    throw new ProviderError("Claude’s API returned an empty reply.", 502);
  }
  return text;
}

async function callOpenAICompatible({
  url,
  apiKey,
  model,
  messages,
}: {
  url: string;
  apiKey: string;
  model: string;
  messages: ChatTurn[];
}): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    signal: AbortSignal.timeout(25_000),
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      messages: [{ role: "system", content: LIVE_SYSTEM }, ...messages],
    }),
  });

  const payload = await readPayload(response);
  if (!response.ok) {
    throw new ProviderError(
      `The provider returned ${response.status}. ${excerpt(payload)}`,
      502,
    );
  }

  const choices = asRecord(payload).choices;
  const first = Array.isArray(choices) ? asRecord(choices[0]) : {};
  const message = asRecord(first.message);
  const content = message.content;
  const text = (typeof content === "string" ? content : partsToText(content)).trim();
  if (!text) {
    throw new ProviderError("The provider returned an empty reply.", 502);
  }
  return text;
}

function partsToText(content: unknown): string {
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      const record = asRecord(part);
      return typeof record.text === "string" ? record.text : "";
    })
    .join("");
}

async function readPayload(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return { error: raw };
  }
}

function excerpt(payload: unknown): string {
  const record = asRecord(payload);
  const error = asRecord(record.error);
  const message =
    (typeof error.message === "string" && error.message) ||
    (typeof record.message === "string" && record.message) ||
    "";
  const redacted = redact(message).replace(/\s+/g, " ").trim();
  return redacted.slice(0, 280);
}

function redact(value: string): string {
  let output = value;
  for (const name of [
    "ANTHROPIC_API_KEY",
    "OPENAI_API_KEY",
    "GROQ_API_KEY",
    "DEEPSEEK_API_KEY",
  ]) {
    const secret = process.env[name];
    if (secret) output = output.split(secret).join("[redacted]");
  }
  return output.replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, "[redacted]");
}

function requiredKey(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new ProviderError(`Missing ${name}.`, 500);
  }
  return value;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}
