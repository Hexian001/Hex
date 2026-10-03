import type { AppConfig } from "./config.js";
import { moneyFlowIndex } from "./mfi.js";
import type { Candle, Position, Signal } from "./types.js";

export type StrategyDecision =
  | { action: "hold"; mfi: number | null; reason: string }
  | { action: "enter"; signal: Signal }
  | { action: "exit"; reason: string; mfi: number; price: number };

export function evaluateMfiStrategy(
  cfg: AppConfig,
  candles: Candle[],
  position: Position | null,
): StrategyDecision {
  const mfi = moneyFlowIndex(candles, cfg.mfiPeriod);
  const last = candles[candles.length - 1];
  if (mfi === null || !last) {
    return { action: "hold", mfi, reason: "warming up MFI" };
  }

  const price = last.close;
  const at = last.timestamp;

  if (!position) {
    if (mfi <= cfg.oversold) {
      return {
        action: "enter",
        signal: {
          side: "long",
          reason: `MFI ${mfi.toFixed(2)} ≤ ${cfg.oversold}`,
          mfi,
          price,
          at,
        },
      };
    }
    if (mfi >= cfg.overbought) {
      return {
        action: "enter",
        signal: {
          side: "short",
          reason: `MFI ${mfi.toFixed(2)} ≥ ${cfg.overbought}`,
          mfi,
          price,
          at,
        },
      };
    }
    return { action: "hold", mfi, reason: "no extreme" };
  }

  // nostop: no hard price stop — exit only on opposite MFI extreme
  if (position.side === "long" && mfi >= cfg.overbought) {
    return {
      action: "exit",
      reason: `long exit MFI ${mfi.toFixed(2)} ≥ ${cfg.overbought}`,
      mfi,
      price,
    };
  }
  if (position.side === "short" && mfi <= cfg.oversold) {
    return {
      action: "exit",
      reason: `short exit MFI ${mfi.toFixed(2)} ≤ ${cfg.oversold}`,
      mfi,
      price,
    };
  }

  if (!cfg.nostop) {
    // Reserved hook for future hard stops; current profile is nostop.
  }

  return { action: "hold", mfi, reason: `in ${position.side}` };
}
