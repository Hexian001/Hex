export type Side = "long" | "short";

export type Candle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Signal = {
  side: Side;
  reason: string;
  mfi: number;
  price: number;
  at: number;
};

export type Position = {
  side: Side;
  entryPrice: number;
  qty: number;
  openedAt: number;
  strategyId: string;
};

export type PaperState = {
  cash: number;
  position: Position | null;
  realizedPnl: number;
  trades: number;
};
