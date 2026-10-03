import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatStatusLine, loadConfig } from "../src/config.js";
import { moneyFlowIndex } from "../src/mfi.js";
import { evaluateMfiStrategy } from "../src/strategy.js";
import type { Candle } from "../src/types.js";

function candle(i: number, close: number, volume: number): Candle {
  return {
    timestamp: i * 300_000,
    open: close,
    high: close + 1,
    low: close - 1,
    close,
    volume,
  };
}

describe("moneyFlowIndex", () => {
  it("returns null until warm", () => {
    const candles = Array.from({ length: 10 }, (_, i) => candle(i, 100 + i, 10));
    assert.equal(moneyFlowIndex(candles, 14), null);
  });

  it("trends high when price and volume rise", () => {
    const candles = Array.from({ length: 30 }, (_, i) => candle(i, 100 + i * 2, 50 + i));
    const mfi = moneyFlowIndex(candles, 14);
    assert.ok(mfi !== null);
    assert.ok(mfi! > 70);
  });

  it("trends low when price falls on volume", () => {
    const candles = Array.from({ length: 30 }, (_, i) => candle(i, 200 - i * 2, 50 + i));
    const mfi = moneyFlowIndex(candles, 14);
    assert.ok(mfi !== null);
    assert.ok(mfi! < 30);
  });
});

describe("evaluateMfiStrategy", () => {
  const baseCfg = loadConfig();

  it("enters long in oversold", () => {
    const candles = Array.from({ length: 30 }, (_, i) => candle(i, 200 - i * 3, 40 + i));
    const decision = evaluateMfiStrategy(baseCfg, candles, null);
    assert.equal(decision.action, "enter");
    if (decision.action === "enter") assert.equal(decision.signal.side, "long");
  });

  it("holds when flat and mid-range", () => {
    const candles = Array.from({ length: 40 }, (_, i) =>
      candle(i, 100 + Math.sin(i / 3) * 0.2, 10),
    );
    const decision = evaluateMfiStrategy(
      { ...baseCfg, oversold: 10, overbought: 90 },
      candles,
      null,
    );
    assert.equal(decision.action, "hold");
  });
});

describe("formatStatusLine", () => {
  it("matches Osaka heartbeat shape", () => {
    const cfg = loadConfig();
    const line = formatStatusLine(cfg, true);
    assert.match(
      line,
      /^\[hexbot-Osaka-MFI\] Telegram OK — HexVi3 temporary hexvi2-mfi-5m-nostop-1 \(5m MFI, Acc1\)\.$/,
    );
  });
});
