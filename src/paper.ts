import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PaperState, Position, Side } from "./types.js";

const STATE_PATH = resolve(process.cwd(), ".paper-state.json");

export function loadPaperState(defaultCash: number): PaperState {
  if (!existsSync(STATE_PATH)) {
    return { cash: defaultCash, position: null, realizedPnl: 0, trades: 0 };
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf8")) as PaperState;
}

export function savePaperState(state: PaperState): void {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

export function openPaper(
  state: PaperState,
  side: Side,
  price: number,
  qty: number,
  strategyId: string,
): PaperState {
  if (state.position) return state;
  const next: PaperState = {
    ...state,
    position: {
      side,
      entryPrice: price,
      qty,
      openedAt: Date.now(),
      strategyId,
    },
  };
  savePaperState(next);
  return next;
}

export function closePaper(state: PaperState, price: number): PaperState {
  if (!state.position) return state;
  const { side, entryPrice, qty } = state.position;
  const pnl =
    side === "long" ? (price - entryPrice) * qty : (entryPrice - price) * qty;
  const next: PaperState = {
    cash: state.cash + pnl,
    position: null,
    realizedPnl: state.realizedPnl + pnl,
    trades: state.trades + 1,
  };
  savePaperState(next);
  return next;
}

export function describePosition(pos: Position | null): string {
  if (!pos) return "flat";
  return `${pos.side} @ ${pos.entryPrice} x ${pos.qty}`;
}
