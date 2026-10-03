import type { Candle } from "./types.js";

/**
 * Money Flow Index (volume-weighted RSI-style oscillator), 0–100.
 * Needs period + 1 typical-price samples (period money-flow ratios).
 */
export function moneyFlowIndex(candles: Candle[], period = 14): number | null {
  if (period < 1) return null;
  if (candles.length < period + 1) return null;

  const window = candles.slice(-(period + 1));
  let positive = 0;
  let negative = 0;

  for (let i = 1; i < window.length; i++) {
    const prev = window[i - 1]!;
    const cur = window[i]!;
    const prevTp = (prev.high + prev.low + prev.close) / 3;
    const tp = (cur.high + cur.low + cur.close) / 3;
    const rawMoneyFlow = tp * cur.volume;

    if (tp > prevTp) positive += rawMoneyFlow;
    else if (tp < prevTp) negative += rawMoneyFlow;
  }

  if (negative === 0) return 100;
  const moneyRatio = positive / negative;
  return 100 - 100 / (1 + moneyRatio);
}

export function mfiSeries(candles: Candle[], period = 14): Array<number | null> {
  const out: Array<number | null> = [];
  for (let i = 0; i < candles.length; i++) {
    out.push(moneyFlowIndex(candles.slice(0, i + 1), period));
  }
  return out;
}
