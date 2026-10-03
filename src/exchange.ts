import ccxt, { type Exchange } from "ccxt";
import type { AppConfig } from "./config.js";
import type { Candle } from "./types.js";

export function createExchange(cfg: AppConfig): Exchange {
  const ExchangeClass = (ccxt as unknown as Record<string, new (opts: object) => Exchange>)[
    cfg.exchangeId
  ];
  if (!ExchangeClass) {
    throw new Error(`Unsupported exchange: ${cfg.exchangeId}`);
  }

  const exchange = new ExchangeClass({
    apiKey: cfg.apiKey || undefined,
    secret: cfg.apiSecret || undefined,
    enableRateLimit: true,
  });

  if (cfg.sandbox && typeof exchange.setSandboxMode === "function") {
    exchange.setSandboxMode(true);
  }

  return exchange;
}

export async function fetchCandles(
  exchange: Exchange,
  symbol: string,
  timeframe: string,
  limit = 120,
): Promise<Candle[]> {
  const rows = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  return rows.map((row) => ({
    timestamp: Number(row[0]),
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  }));
}
