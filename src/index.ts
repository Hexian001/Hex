import { formatStatusLine, loadConfig, type AppConfig } from "./config.js";
import { createExchange, fetchCandles } from "./exchange.js";
import { closePaper, describePosition, loadPaperState, openPaper } from "./paper.js";
import { evaluateMfiStrategy } from "./strategy.js";
import { createTelegram } from "./telegram.js";
import type { PaperState } from "./types.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendStatus(cfg: AppConfig, tg: ReturnType<typeof createTelegram>, extra?: string) {
  const line = formatStatusLine(cfg, tg.enabled ? tg.ok || (await tg.probe()) : false);
  const msg = extra ? `${line}\n${extra}` : line;
  console.log(msg);
  if (tg.enabled) await tg.send(msg);
  return line;
}

async function runOnceStatus() {
  const cfg = loadConfig();
  const tg = createTelegram(cfg);
  if (tg.enabled) await tg.probe();
  const line = formatStatusLine(cfg, tg.enabled ? tg.ok : false);
  console.log(line);
  if (tg.enabled) await tg.send(line);
}

async function tick(
  cfg: AppConfig,
  tg: ReturnType<typeof createTelegram>,
  state: PaperState,
): Promise<PaperState> {
  const exchange = createExchange(cfg);
  const candles = await fetchCandles(exchange, cfg.symbol, cfg.timeframe, Math.max(cfg.mfiPeriod + 5, 80));
  const decision = evaluateMfiStrategy(cfg, candles, state.position);

  if (decision.action === "enter") {
    if (cfg.mode === "paper") {
      state = openPaper(
        state,
        decision.signal.side,
        decision.signal.price,
        cfg.paperQty,
        cfg.strategyId,
      );
      await sendStatus(
        cfg,
        tg,
        `ENTER ${decision.signal.side.toUpperCase()} ${cfg.symbol} @ ${decision.signal.price} | MFI ${decision.signal.mfi.toFixed(2)} | ${decision.signal.reason} | mode=${cfg.mode}`,
      );
    } else {
      await sendStatus(
        cfg,
        tg,
        `LIVE signal ${decision.signal.side.toUpperCase()} ${cfg.symbol} @ ${decision.signal.price} | MFI ${decision.signal.mfi.toFixed(2)} — wire exchange order path before enabling live fills`,
      );
    }
  } else if (decision.action === "exit") {
    if (cfg.mode === "paper" && state.position) {
      const side = state.position.side;
      state = closePaper(state, decision.price);
      await sendStatus(
        cfg,
        tg,
        `EXIT ${side.toUpperCase()} ${cfg.symbol} @ ${decision.price} | MFI ${decision.mfi.toFixed(2)} | ${decision.reason} | pnl=${state.realizedPnl.toFixed(4)}`,
      );
    } else {
      await sendStatus(cfg, tg, `EXIT signal ${cfg.symbol} @ ${decision.price} | ${decision.reason}`);
    }
  } else {
    const mfiText = decision.mfi === null ? "n/a" : decision.mfi.toFixed(2);
    console.log(
      `[tick] hold mfi=${mfiText} pos=${describePosition(state.position)} reason=${decision.reason}`,
    );
  }

  return state;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--status-once")) {
    await runOnceStatus();
    return;
  }

  const cfg = loadConfig();
  const tg = createTelegram(cfg);
  let state = loadPaperState(cfg.paperCash);

  console.log(
    `HexVi starting instance=${cfg.instance} strategy=${cfg.strategyId} symbol=${cfg.symbol} tf=${cfg.timeframe} mode=${cfg.mode} nostop=${cfg.nostop}`,
  );

  if (tg.enabled) {
    const probed = await tg.probe();
    console.log(`Telegram probe: ${probed ? "OK" : "FAIL"}`);
  } else {
    console.log("Telegram disabled or missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID");
  }

  await sendStatus(
    cfg,
    tg,
    `boot mode=${cfg.mode} symbol=${cfg.symbol} nostop=${cfg.nostop} pos=${describePosition(state.position)}`,
  );

  let lastStatus = Date.now();

  for (;;) {
    try {
      state = await tick(cfg, tg, state);
    } catch (err) {
      console.error("[tick] error", err);
      await sendStatus(cfg, tg, `tick error: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (Date.now() - lastStatus >= cfg.statusEveryMs) {
      await sendStatus(
        cfg,
        tg,
        `heartbeat pos=${describePosition(state.position)} realized=${state.realizedPnl.toFixed(4)} trades=${state.trades}`,
      );
      lastStatus = Date.now();
    }

    await sleep(cfg.pollMs);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
