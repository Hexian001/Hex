"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LockGate } from "@/components/LockGate";
import { useHex } from "@/lib/store";
import { PROTOCOL, STAKE, programsUnlocked } from "@/lib/protocol";
import { hexAmount, money, pct } from "@/lib/format";

export default function StakingPage() {
  const hex = useHex();
  const [amount, setAmount] = useState<number>(PROTOCOL.minStakeHex);
  const unlocked = programsUnlocked(hex.sold);
  const staked = hex.stakes.reduce((sum, s) => sum + s.amount, 0);
  const pending = hex.stakes.reduce((sum, s) => sum + s.harvested, 0);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Staking</p>
        <h1 className="display text-4xl">Lock HEX in the grid.</h1>
        <p className="mt-3 max-w-2xl text-muted">
          After 60% of genesis nodes are sold, liquid HEX can be staked for a protocol yield of{" "}
          {pct(STAKE.dailyRate, 2)} per day. Unstake returns principal plus unharvested yield.
        </p>
      </div>
      <LockGate unlocked={unlocked} sold={hex.sold} title="Staking is sealed">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="panel rounded-3xl p-6">
            <p className="text-sm text-muted">Available HEX {hexAmount(hex.hex)}</p>
            <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted">
              Stake amount
            </label>
            <input
              type="number"
              min={PROTOCOL.minStakeHex}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-line bg-black/40 px-3 py-3"
            />
            <p className="mt-2 text-sm text-muted">
              Est. {hexAmount(amount * STAKE.dailyRate)} HEX / day
            </p>
            <button
              type="button"
              onClick={() => hex.stakeHex(amount)}
              className="gold-btn mt-4 w-full rounded-xl py-3"
            >
              Stake HEX
            </button>
            <button
              type="button"
              onClick={hex.harvestStake}
              className="mt-2 w-full rounded-xl border border-line py-3 text-sm"
            >
              Harvest all yield ({hexAmount(pending)} HEX)
            </button>
          </article>
          <article className="panel rounded-3xl p-6">
            <div className="flex justify-between">
              <h2 className="display text-2xl">Positions</h2>
              <p className="text-sm text-muted">{money(staked)} HEX staked</p>
            </div>
            <ul className="mt-4 space-y-3">
              {hex.stakes.length === 0 && (
                <li className="text-sm text-muted">No stake yet. Open a position after unlock.</li>
              )}
              {hex.stakes.map((pos) => (
                <li key={pos.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between">
                    <p className="display text-xl">{money(pos.amount)} HEX</p>
                    <button
                      type="button"
                      onClick={() => hex.unstake(pos.id)}
                      className="text-sm text-gold"
                    >
                      Unstake
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Accrued {hexAmount(pos.harvested)} HEX · {pct(STAKE.dailyRate, 2)} daily
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </LockGate>
    </AppShell>
  );
}
