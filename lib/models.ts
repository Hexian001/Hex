export const MODEL_IDS = ["claude", "chatgpt", "llama", "deepseek"] as const;

export type ModelId = (typeof MODEL_IDS)[number];

export type ModelFamily = {
  id: ModelId;
  label: string;
  maker: string;
  summary: string;
};

export const MODELS: readonly ModelFamily[] = [
  {
    id: "claude",
    label: "Claude",
    maker: "Anthropic",
    summary: "Anthropic’s Claude family.",
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    maker: "OpenAI",
    summary: "OpenAI’s ChatGPT family.",
  },
  {
    id: "llama",
    label: "Llama",
    maker: "Meta",
    summary: "Meta’s Llama family, called through Groq when a key is set.",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    maker: "DeepSeek",
    summary: "DeepSeek’s chat models.",
  },
];

export function isModelId(value: string): value is ModelId {
  return (MODEL_IDS as readonly string[]).includes(value);
}

export function modelById(id: ModelId): ModelFamily {
  const model = MODELS.find((entry) => entry.id === id);
  if (!model) {
    throw new Error(`Unknown model: ${id}`);
  }
  return model;
}
