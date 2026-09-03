"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useHex } from "@/lib/store";
import { PROTOCOL } from "@/lib/protocol";
import { hexAmount, money, pct } from "@/lib/format";

export default function WalletPage() {
  const hex = useHex();
  const [amount, setAmount] = useState(100);
  const fee = amount * PROTOCOL.withdrawFee;
  const usdtOut = (amount - fee) * PROTOCOL.hexUsd;

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Wallet</p>
        <h1 className="display text-4xl">USDT in. HEX out. Burn on exit.</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">USDT</p>
          <p className="display mt-2 text-4xl">{money(hex.usdt)}</p>
        </article>
        <article className="panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Liquid HEX</p>
          <p className="display mt-2 text-4xl">{money(hex.hex)}</p>
        </article>
        <article className="panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Pending airdrop</p>
          <p className="display mt-2 text-4xl">{hexAmount(hex.pendingAirdrop)}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="panel rounded-3xl p-6">
          <h2 className="display text-2xl">Swap HEX → USDT</h2>
          <p className="mt-2 text-sm text-muted">
            Demo exit path. {pct(PROTOCOL.withdrawFee, 0)} of HEX is burned. Remainder credits USDT
            at {PROTOCOL.hexUsd} USD.
          </p>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-4 w-full rounded-xl border border-line bg-black/40 px-3 py-3"
          />
          <p className="mt-2 text-sm text-muted">
            Burn {hexAmount(fee)} HEX · receive {money(usdtOut)} USDT
          </p>
          <button
            type="button"
            onClick={() => hex.withdrawHex(amount)}
            className="gold-btn mt-4 rounded-xl px-5 py-3"
          >
            Confirm swap
          </button>
        </article>
        <article className="panel rounded-3xl p-6">
          <h2 className="display text-2xl">Ledger</h2>
          <ul className="mt-4 max-h-[360px] space-y-2 overflow-auto text-sm">
            {hex.txs.length === 0 && <li className="text-muted">No movements yet.</li>}
            {hex.txs.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between border-b border-line/60 py-2">
                <span>
                  <span className="block">{tx.label}</span>
                  <span className="text-xs text-muted">
                    {new Date(tx.at).toLocaleString()}
                  </span>
                </span>
                <span className="text-gold">
                  {tx.amount.toFixed(2)} {tx.asset}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </AppShell>
  );
}
