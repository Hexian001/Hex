import { config as loadEnv } from "dotenv";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

loadEnv();

const StrategyFileSchema = z.object({
  id: z.string(),
  label: z.string().default("temporary"),
  product: z.string().default("HexVi3"),
  timeframe: z.string().default("5m"),
  indicator: z.string().default("MFI"),
  account: z.string().default("Acc1"),
  nostop: z.boolean().default(true),
  mfiPeriod: z.number().int().positive().default(14),
  oversold: z.number().default(20),
  overbought: z.number().default(80),
  symbol: z.string().default("BTC/USDT"),
  notes: z.string().optional(),
});

const EnvSchema = z.object({
  HEXVI_INSTANCE: z.string().default("hexbot-Osaka-MFI"),
  HEXVI_PRODUCT: z.string().default("HexVi3"),
  HEXVI_STRATEGY: z.string().default("hexvi2-mfi-5m-nostop-1"),
  HEXVI_ACCOUNT: z.string().default("Acc1"),
  HEXVI_MODE: z.enum(["paper", "live"]).default("paper"),
  HEXVI_EXCHANGE: z.string().default("binance"),
  HEXVI_SYMBOL: z.string().optional(),
  HEXVI_TIMEFRAME: z.string().optional(),
  HEXVI_MFI_PERIOD: z.coerce.number().int().positive().optional(),
  HEXVI_MFI_OVERSOLD: z.coerce.number().optional(),
  HEXVI_MFI_OVERBOUGHT: z.coerce.number().optional(),
  HEXVI_NOSTOP: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v !== "false" && v !== "0")),
  HEXVI_POLL_MS: z.coerce.number().int().positive().default(15_000),
  HEXVI_STATUS_EVERY_MS: z.coerce.number().int().positive().default(300_000),
  HEXVI_API_KEY: z.string().optional().default(""),
  HEXVI_API_SECRET: z.string().optional().default(""),
  HEXVI_SANDBOX: z
    .string()
    .optional()
    .transform((v) => v !== "false" && v !== "0")
    .default("true"),
  TELEGRAM_BOT_TOKEN: z.string().optional().default(""),
  TELEGRAM_CHAT_ID: z.string().optional().default(""),
  TELEGRAM_ENABLED: z
    .string()
    .optional()
    .transform((v) => v !== "false" && v !== "0")
    .default("true"),
  HEXVI_PAPER_CASH: z.coerce.number().positive().default(10_000),
  HEXVI_PAPER_QTY: z.coerce.number().positive().default(0.01),
});

export type AppConfig = {
  instance: string;
  product: string;
  strategyId: string;
  strategyLabel: string;
  account: string;
  mode: "paper" | "live";
  exchangeId: string;
  symbol: string;
  timeframe: string;
  indicator: string;
  mfiPeriod: number;
  oversold: number;
  overbought: number;
  nostop: boolean;
  pollMs: number;
  statusEveryMs: number;
  apiKey: string;
  apiSecret: string;
  sandbox: boolean;
  telegramToken: string;
  telegramChatId: string;
  telegramEnabled: boolean;
  paperCash: number;
  paperQty: number;
  notes?: string;
};

function loadStrategyFile(strategyId: string) {
  const path = resolve(process.cwd(), "configs", `${strategyId}.json`);
  try {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    return StrategyFileSchema.parse(raw);
  } catch {
    return StrategyFileSchema.parse({ id: strategyId });
  }
}

export function loadConfig(): AppConfig {
  const env = EnvSchema.parse(process.env);
  const file = loadStrategyFile(env.HEXVI_STRATEGY);

  return {
    instance: env.HEXVI_INSTANCE,
    product: env.HEXVI_PRODUCT || file.product,
    strategyId: file.id,
    strategyLabel: file.label,
    account: env.HEXVI_ACCOUNT || file.account,
    mode: env.HEXVI_MODE,
    exchangeId: env.HEXVI_EXCHANGE,
    symbol: env.HEXVI_SYMBOL || file.symbol,
    timeframe: env.HEXVI_TIMEFRAME || file.timeframe,
    indicator: file.indicator,
    mfiPeriod: env.HEXVI_MFI_PERIOD ?? file.mfiPeriod,
    oversold: env.HEXVI_MFI_OVERSOLD ?? file.oversold,
    overbought: env.HEXVI_MFI_OVERBOUGHT ?? file.overbought,
    nostop: env.HEXVI_NOSTOP ?? file.nostop,
    pollMs: env.HEXVI_POLL_MS,
    statusEveryMs: env.HEXVI_STATUS_EVERY_MS,
    apiKey: env.HEXVI_API_KEY ?? "",
    apiSecret: env.HEXVI_API_SECRET ?? "",
    sandbox: Boolean(env.HEXVI_SANDBOX),
    telegramToken: env.TELEGRAM_BOT_TOKEN ?? "",
    telegramChatId: env.TELEGRAM_CHAT_ID ?? "",
    telegramEnabled: Boolean(env.TELEGRAM_ENABLED),
    paperCash: env.HEXVI_PAPER_CASH,
    paperQty: env.HEXVI_PAPER_QTY,
    notes: file.notes,
  };
}

/** Matches: [hexbot-Osaka-MFI] Telegram OK — HexVi3 temporary hexvi2-mfi-5m-nostop-1 (5m MFI, Acc1). */
export function formatStatusLine(cfg: AppConfig, telegramOk: boolean): string {
  const tg = telegramOk ? "Telegram OK" : "Telegram OFF";
  return `[${cfg.instance}] ${tg} — ${cfg.product} ${cfg.strategyLabel} ${cfg.strategyId} (${cfg.timeframe} ${cfg.indicator}, ${cfg.account}).`;
}
