# HEX — Hexian Protocol

Original Web3 product demo: **genesis node sale**, **daily mining airdrop**, and **staking / gold-GameFi investment that unlock only after 60% of nodes are sold**.

This is not a visual clone of any third-party app. Layout, copy, and brand are Hexian. The *functions* follow the node-sale model: buy a cell in USDT (BEP-20), accrue a daily HEX airdrop, then open staking and structured investment once the sale crosses the 60% gate.

## Story

HEX is three veins, one reserve:

1. **Utilities** — nodes keep the grid routing and are paid a daily airdrop.
2. **GameFi** — HEX Arena is a sink; Arena Bond 90/10 funds prize liquidity after unlock.
3. **Gold** — Gold Vault 80/20 opens only after 60% of genesis nodes are allocated.

Read the full narrative at `/ecosystem`.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect any sandbox wallet on `/login`. Command lives at `/dashboard`.

## Demo controls

On the dashboard:

- **Simulate 60% sold** — unlocks staking and investment so those flows can be reviewed.
- **+5,000 USDT** / **+500 HEX** — sandbox top-ups so staking can be reviewed immediately.
- **Reset demo** — clears `localStorage`.

Balances and the sale counter persist in the browser. Nothing here is a live mainnet contract.

## Node tiers

| Node | USDT | Monthly mining | Bonus | Vein |
| --- | --- | --- | --- | --- |
| Ember | 1,000 | 8% | — | Utilities |
| Aurea | 5,000 | 9% | 5% HEX | GameFi |
| Sovereign | 10,000 | 10% | 10% HEX | Gold |

2,000 genesis nodes. Unlock at 1,200 sold. Unsold cells are written as burned when the window ends.

## Later (not in this slice)

- BEP-20 HEX + USDT NodeManager / Airdrop / Staking / GoldVault contracts
- Real wallet signatures (EIP-712) and on-chain indexing
- Referral tree after the 60% networking gate
