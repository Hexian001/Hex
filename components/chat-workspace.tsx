"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { MODELS, type ModelId } from "@/lib/models";

type Availability = Record<ModelId, boolean>;

type Bubble = {
  id: string;
  role: "user" | "assistant";
  text: string;
  mode?: "demo" | "live";
  label?: string;
};

const EMPTY_STATUS = "Replies are labeled local demo unless a provider key is configured for the family you pick.";

export function ChatWorkspace() {
  const [model, setModel] = useState<ModelId>("claude");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Bubble[]>([]);
  const [availability, setAvailability] = useState<Availability | "error" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = MODELS.find((entry) => entry.id === model) ?? MODELS[0];
  const known = availability && availability !== "error" ? availability : null;
  const live = known ? known[model] : null;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/chat", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("status");
        const payload = (await response.json()) as { availability?: Availability };
        if (!payload.availability) throw new Error("shape");
        setAvailability(payload.availability);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setAvailability("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, pending, error]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || pending) return;
    if (prompt.length > 4000) {
      setError("Each message is limited to 4,000 characters.");
      return;
    }

    const history = messages
      .filter((bubble) => bubble.role === "user" || bubble.mode === "live" || bubble.mode === "demo")
      .map((bubble) => ({ role: bubble.role, content: bubble.text }));
    const nextUser: Bubble = { id: crypto.randomUUID(), role: "user", text: prompt };
    setMessages((current) => [...current, nextUser]);
    setDraft("");
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [...history, { role: "user", content: prompt }],
        }),
      });
      const payload = (await response.json()) as {
        mode?: string;
        text?: string;
        label?: string;
        message?: string;
      };
      if (!response.ok || payload.mode === "error" || !payload.text) {
        setError(payload.message || "The reply did not come back.");
        return;
      }
      if (payload.mode !== "demo" && payload.mode !== "live") {
        setError("The chat service returned an unknown reply type.");
        return;
      }
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: payload.text ?? "",
          mode: payload.mode as "demo" | "live",
          label: payload.label ?? selected.label,
        },
      ]);
    } catch {
      setError("The browser could not reach the chat service.");
    } finally {
      setPending(false);
    }
  }

  const status = describeStatus(availability);
  const pendingLabel =
    live === false ? "Writing a local demo reply…" : live ? `Contacting ${selected.label}…` : "Sending…";

  return (
    <section className="flex min-h-[36rem] w-full max-w-full flex-col border-y border-line bg-panel lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)] lg:sticky lg:top-16 lg:border-y-0 lg:border-l" aria-label="Chat workspace">
      <div className="border-b border-line px-4 py-3">
        <p className="font-mono text-xs leading-relaxed text-lime" role="status">
          {status}
        </p>
      </div>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:flex-row">
        <div
          role="radiogroup"
          aria-labelledby={listId + "-models"}
          className="w-full min-w-0 max-w-full overflow-hidden border-b border-line px-3 py-3 lg:w-60 lg:shrink-0 lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          <p id={listId + "-models"} className="px-1 font-mono text-[0.68rem] tracking-[0.16em] text-faint">
            MODEL
          </p>
          <div className="mt-2 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {MODELS.map((entry) => {
              const keyState = known ? known[entry.id] : null;
              return (
                <label
                  key={entry.id}
                  className={`relative min-w-40 cursor-pointer border px-3 py-2 lg:min-w-0 ${
                    model === entry.id ? "border-amber bg-panel-2" : "border-line hover:border-brass"
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={entry.id}
                    className="sr-only"
                    checked={model === entry.id}
                    onChange={() => setModel(entry.id)}
                  />
                  <span className="block text-sm text-ink">{entry.label}</span>
                  <span className="mt-0.5 block font-mono text-[0.68rem] text-faint">
                    {entry.maker}
                    {" · "}
                    {availability === "error"
                      ? "Key status unknown"
                      : keyState === null
                        ? "Checking key"
                        : keyState
                          ? "Key configured"
                          : "Local demo"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">
          <div ref={scroller} id={listId} className="min-h-48 flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <p className="prose-measure text-sm leading-relaxed text-muted">
                The thread is empty. Pick a model family, write a prompt, and send it. If that family has no API key, the reply is a local demo and says so in the first line.
              </p>
            ) : null}
            {messages.map((bubble) => (
              <article key={bubble.id} className={bubble.role === "user" ? "ml-auto max-w-[40rem]" : "max-w-[46rem] border-l border-amber pl-3"}>
                <p className="font-mono text-[0.68rem] tracking-wide text-faint">
                  {bubble.role === "user"
                    ? "You"
                    : bubble.mode === "demo"
                      ? `Local demo · not ${bubble.label}`
                      : `Provider reply · ${bubble.label}`}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-[0.98rem] leading-relaxed text-ink">{bubble.text}</p>
              </article>
            ))}
            {pending ? <p className="font-mono text-xs text-brass">{pendingLabel}</p> : null}
            {error ? (
              <p className="border border-clay/50 bg-panel-2 px-3 py-2 text-sm text-clay" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <form onSubmit={onSubmit} className="border-t border-line p-3">
            <label htmlFor="composer" className="sr-only">
              Message
            </label>
            <textarea
              id="composer"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={3}
              placeholder={`Message ${selected.label}`}
              className="w-full resize-y border border-line bg-bg px-3 py-2 text-ink outline-none placeholder:text-faint"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[0.68rem] text-faint">
                Selected: {selected.label}
                {live === false ? " · local demo, no API key" : ""}
                {live ? " · provider key configured" : ""}
                {" · Enter to send"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-ghost min-h-10 px-3"
                  onClick={() => {
                    setMessages([]);
                    setError(null);
                  }}
                >
                  Clear thread
                </button>
                <button type="submit" className="btn btn-primary min-h-10" disabled={pending || draft.trim().length === 0}>
                  {pending ? "Sending" : "Send"}
                </button>
              </div>
            </div>
            {draft.trim().length > 4000 ? (
              <p className="mt-2 text-sm text-clay">Each message is limited to 4,000 characters.</p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

function describeStatus(availability: Availability | "error" | null) {
  if (availability === "error") {
    return "Could not read which keys are configured. Send a prompt anyway. The reply will say if it is a local demo.";
  }
  if (!availability) return EMPTY_STATUS;
  const live = MODELS.filter((model) => availability[model.id]).map((model) => model.label);
  const demo = MODELS.filter((model) => !availability[model.id]).map((model) => model.label);
  if (live.length === 0) {
    return "Local demo. No model API key is configured. Replies are written on this site and are not from Claude, ChatGPT, Llama, or DeepSeek.";
  }
  if (demo.length === 0) {
    return "All four families are using a configured API key. Those replies come from the providers.";
  }
  return `${live.join(", ")} ${live.length === 1 ? "is" : "are"} using a configured API key. ${demo.join(", ")} ${demo.length === 1 ? "has" : "have"} no key, so those replies stay local demos.`;
}
