"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SaleMeter } from "@/components/SaleMeter";
import { useHex } from "@/lib/store";
import {
  PACKAGES,
  PROTOCOL,
  UNLOCK_AT,
  dailyHexForNode,
  packageById,
  programsUnlocked,
  soldTotal,
} from "@/lib/protocol";
import { hexAmount, money, pct } from "@/lib/format";

export default function DashboardPage() {
  const hex = useHex();
  const unlocked = programsUnlocked(hex.sold);
  const daily = hex.nodes.reduce((sum, node) => {
    const pkg = packageById(node.packageId);
    return sum + dailyHexForNode(pkg.priceUsdt, pkg.monthlyRate);
  }, 0);
  const deployed = hex.nodes.reduce((sum, node) => sum + packageById(node.packageId).priceUsdt, 0);

  return (
    <AppShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Command</p>
          <h1 className="display text-4xl">Your Hexian cell</h1>
        </div>
        <Link href="/nodes" className="gold-btn rounded-full px-4 py-2 text-sm">
          Buy a node
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["USDT", money(hex.usdt), "Spendable"],
          ["HEX", hexAmount(hex.hex), "Liquid"],
          ["Pending airdrop", hexAmount(hex.pendingAirdrop), "Claim on Airdrop"],
          ["Daily mining", `${hexAmount(daily)} HEX`, `${hex.nodes.length} nodes`],
        ].map(([label, value, hint]) => (
          <article key={label} className="panel rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="display mt-2 text-3xl">{value}</p>
            <p className="mt-1 text-sm text-muted">{hint}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="panel rounded-3xl p-6">
          <h2 className="display text-2xl">Genesis gate</h2>
          <p className="mt-2 text-sm text-muted">
            Staking and gold / GameFi investment stay closed until {UNLOCK_AT.toLocaleString()} of{" "}
            {PROTOCOL.totalNodes.toLocaleString()} nodes are sold. Current fill {soldTotal(hex.sold)}{" "}
            ({pct(soldTotal(hex.sold) / PROTOCOL.totalNodes)}).
          </p>
          <div className="mt-5">
            <SaleMeter sold={hex.sold} />
          </div>
          <p className={`mt-4 text-sm ${unlocked ? "text-jade" : "text-gold"}`}>
            {unlocked
              ? "Threshold reached. Staking and vault programs are open."
              : "Programs locked. Mining airdrop is live for every node you own."}
          </p>
        </article>
        <article className="panel rounded-3xl p-6">
          <h2 className="display text-2xl">Fleet</h2>
          <p className="mt-2 text-sm text-muted">
            {hex.nodes.length} node{hex.nodes.length === 1 ? "" : "s"} · {money(deployed)} USDT deployed
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {PACKAGES.map((pkg) => {
              const count = hex.nodes.filter((n) => n.packageId === pkg.id).length;
              return (
                <li key={pkg.id} className="flex justify-between border-b border-line/70 py-2">
                  <span>
                    {pkg.name} <span className="text-muted">· {pkg.vein}</span>
                  </span>
                  <span>{count}</span>
                </li>
              );
            })}
          </ul>
        </article>
      </div>

      <article className="panel mt-6 rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Sandbox</p>
        <h2 className="display mt-1 text-2xl">Protocol simulator</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          This environment is a local ledger so the product can be reviewed without mainnet keys.
          Advance the sale to 60% to inspect staking and investment. Reset wipes the browser store.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={hex.simulateUnlock} className="gold-btn rounded-full px-4 py-2 text-sm">
            Simulate 60% sold
          </button>
          <button
            type="button"
            onClick={hex.faucet}
            className="rounded-full border border-line px-4 py-2 text-sm"
          >
            +5,000 USDT
          </button>
          <button
            type="button"
            onClick={hex.faucetHex}
            className="rounded-full border border-line px-4 py-2 text-sm"
          >
            +500 HEX
          </button>
          <button
            type="button"
            onClick={hex.reset}
            className="rounded-full border border-line px-4 py-2 text-sm text-muted"
          >
            Reset demo
          </button>
        </div>
      </article>
    </AppShell>
  );
}
