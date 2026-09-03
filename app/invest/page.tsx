"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LockGate } from "@/components/LockGate";
import { useHex } from "@/lib/store";
import { INVEST_PROGRAMS, PROTOCOL, programsUnlocked } from "@/lib/protocol";
import { hexAmount, money, pct } from "@/lib/format";

export default function InvestPage() {
  const hex = useHex();
  const unlocked = programsUnlocked(hex.sold);
  const [amounts, setAmounts] = useState<Record<string, number>>({
    gold80: 500,
    gamefi90: 500,
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Investment</p>
        <h1 className="display text-4xl">Gold Vault and Arena bonds.</h1>
        <p className="mt-3 max-w-2xl text-muted">
          These books open only after 60% of nodes are sold. Gold Vault 80/20 is the reserve
          program. Arena Bond 90/10 funds GameFi prize liquidity. Yield is paid in HEX to maxout.
        </p>
      </div>
      <LockGate unlocked={unlocked} sold={hex.sold} title="Vaults are still sealed">
        <div className="grid gap-4 lg:grid-cols-2">
          {INVEST_PROGRAMS.map((program) => (
            <article key={program.id} className="panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-jade">{program.vein}</p>
              <h2 className="display mt-2 text-3xl">{program.name}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{program.blurb}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-muted">Daily</dt>
                  <dd>{pct(program.dailyRate, 2)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Maxout</dt>
                  <dd>{program.maxoutMultiple}x deposit</dd>
                </div>
                <div>
                  <dt className="text-muted">Principal booked</dt>
                  <dd>{pct(program.splitPrincipal, 0)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Burn / prize</dt>
                  <dd>{pct(program.burnPct, 0)}</dd>
                </div>
              </dl>
              <input
                type="number"
                min={PROTOCOL.minInvestUsdt}
                value={amounts[program.id]}
                onChange={(e) =>
                  setAmounts((prev) => ({ ...prev, [program.id]: Number(e.target.value) }))
                }
                className="mt-5 w-full rounded-xl border border-line bg-black/40 px-3 py-3"
              />
              <button
                type="button"
                onClick={() => hex.openInvest(program.id, amounts[program.id] ?? 0)}
                className="gold-btn mt-3 w-full rounded-xl py-3"
              >
                Open with {money(amounts[program.id] ?? 0, 0)} USDT
              </button>
            </article>
          ))}
        </div>
        <article className="panel mt-6 rounded-3xl p-6">
          <h2 className="display text-2xl">Open books</h2>
          <ul className="mt-4 space-y-3">
            {hex.investments.length === 0 && (
              <li className="text-sm text-muted">No positions yet.</li>
            )}
            {hex.investments.map((pos) => {
              const program = INVEST_PROGRAMS.find((item) => item.id === pos.programId)!;
              return (
                <li key={pos.id} className="rounded-2xl border border-line p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="display text-xl">{program.name}</p>
                      <p className="text-sm text-muted">
                        Deposit {money(pos.depositUsdt)} · booked {money(pos.principal)} · maxout{" "}
                        {money(pos.maxout)} HEX
                      </p>
                      <p className="text-sm">Accrued {hexAmount(pos.harvested)} HEX</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => hex.harvestInvest(pos.id)}
                      className="gold-btn rounded-full px-4 py-2 text-sm"
                    >
                      Harvest
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      </LockGate>
    </AppShell>
  );
}
