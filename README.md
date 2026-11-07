# HexSwap

A PancakeSwap-style swap UI for **BNB Chain** that uses the
[PancakeSwap Unified Swap API](https://developer.pancakeswap.finance/contracts/unified-swap-api/overview)
for quotes and transaction calldata — not a custom AMM.

## Features

- Connect wallet (injected / MetaMask) on BNB Chain
- Token select (BNB, CAKE, USDT, USDC, ETH, BTCB, WBNB)
- Live quotes via `GET https://swap.pancakeswap.com/v1/quote` (`sources=agg`)
- Slippage settings and price impact / route display
- ERC-20 approve + swap using `POST /v1/calldata`
- Next.js API proxies under `/api/pcs/*` (avoids browser CORS)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional higher rate limits:

```bash
# .env.local
PCS_API_KEY=your_key_from_pancakeswap
```

## Flow

```
Wallet amount → /api/pcs/quote → PancakeSwap Unified API
                              ↓
                    best aggregator route
                              ↓
              approve router (if ERC-20) → /api/pcs/calldata → send tx
```

## Stack

- Next.js App Router + TypeScript
- wagmi / viem
- PancakeSwap Unified Swap API (chainId `56`)
