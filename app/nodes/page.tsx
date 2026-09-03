"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SaleMeter } from "@/components/SaleMeter";
import { useHex } from "@/lib/store";
import { PACKAGES, remainingOf, dailyHexForNode } from "@/lib/protocol";
import { money, pct } from "@/lib/format";

export default function NodesPage() {
  const hex = useHex();
  const [qty, setQty] = useState<Record<string, number>>({ ember: 1, aurea: 1, sovereign: 1 });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Node program</p>
        <h1 className="display text-4xl">Buy a node. Start the daily airdrop.</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Each node is a mining cell. You pay USDT, the cell comes online immediately, and HEX
          airdrops accrue every second from the published monthly rate.
        </p>
      </div>
      <div className="panel mb-6 rounded-3xl p-5">
        <SaleMeter sold={hex.sold} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {PACKAGES.map((pkg) => {
          const left = remainingOf(pkg.id, hex.sold);
          const owned = hex.nodes.filter((n) => n.packageId === pkg.id).length;
          const n = qty[pkg.id] ?? 1;
          const daily = dailyHexForNode(pkg.priceUsdt, pkg.monthlyRate) * n;
          return (
            <article key={pkg.id} className="panel flex flex-col rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-jade">{pkg.vein}</p>
              <h2 className="display mt-2 text-3xl">{pkg.name}</h2>
              <p className="mt-1 text-sm text-muted">{pkg.tagline}</p>
              <p className="mt-5 display text-4xl text-gold">
                {money(pkg.priceUsdt, 0)}
                <span className="ml-2 text-base font-sans text-muted">USDT</span>
              </p>
              <p className="mt-2 text-sm">
                {pct(pkg.monthlyRate)} / month · {pct(pkg.monthlyRate / 30, 2)} / day
              </p>
              <p className="mt-1 text-xs text-muted">
                {left} remaining · you own {owned}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {pkg.perks.map((perk) => (
                  <li key={perk}>▸ {perk}</li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <label className="text-xs uppercase tracking-[0.16em] text-muted">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, left)}
                  value={n}
                  onChange={(e) =>
                    setQty((prev) => ({ ...prev, [pkg.id]: Number(e.target.value) }))
                  }
                  className="mt-1 w-full rounded-xl border border-line bg-black/40 px-3 py-2"
                />
                <p className="mt-2 text-sm text-muted">
                  Cost {money(pkg.priceUsdt * n)} · ~{daily.toFixed(2)} HEX / day
                </p>
                <button
                  type="button"
                  disabled={left <= 0}
                  onClick={() => hex.buyNode(pkg.id, n)}
                  className="gold-btn mt-3 w-full rounded-xl py-3 disabled:opacity-40"
                >
                  {left <= 0 ? "Sold out" : "Confirm purchase"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
