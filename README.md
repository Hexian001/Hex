# HexVi3 — Osaka MFI bot

Telegram-notified **5m MFI** trading bot for the HexVi stack.

Default temporary profile:

`[hexbot-Osaka-MFI] Telegram OK — HexVi3 temporary hexvi2-mfi-5m-nostop-1 (5m MFI, Acc1).`

## What it does

- Loads strategy config `configs/hexvi2-mfi-5m-nostop-1.json`
- Polls OHLCV (default Binance `BTC/USDT` 5m) via ccxt
- Computes Money Flow Index and enters on oversold/overbought extremes
- **nostop**: no hard price stop; exits on the opposite MFI extreme
- Paper mode by default (state in `.paper-state.json`)
- Sends Telegram boot / trade / heartbeat lines in the Osaka format

Live order placement is intentionally not wired yet — live mode only alerts signals until you confirm exchange + sizing rules.

## Setup

```bash
npm install
cp .env.example .env
```

Fill Telegram:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Run

```bash
# Print / send one status line
npm run status

# Paper loop
npm run dev

# Tests
npm test
```

Production-style:

```bash
npm run build
HEXVI_INSTANCE=hexbot-Osaka-MFI npm start
```

## Key env

| Variable | Default | Meaning |
| --- | --- | --- |
| `HEXVI_INSTANCE` | `hexbot-Osaka-MFI` | Prefix in Telegram status |
| `HEXVI_STRATEGY` | `hexvi2-mfi-5m-nostop-1` | Strategy JSON under `configs/` |
| `HEXVI_ACCOUNT` | `Acc1` | Account label |
| `HEXVI_MODE` | `paper` | `paper` or `live` (signals only for now) |
| `HEXVI_SYMBOL` | from strategy | Market symbol |
| `HEXVI_NOSTOP` | `true` | Exit via MFI only |
| `TELEGRAM_*` | empty | Bot token + chat id |

## Osaka deploy sketch

```bash
cd /opt/hexvi
git pull
npm ci
npm run build
# systemd or pm2:
pm2 start dist/index.js --name hexbot-Osaka-MFI
```
