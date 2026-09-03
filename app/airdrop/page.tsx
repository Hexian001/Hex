"use client";

import { AppShell } from "@/components/AppShell";
import { useHex } from "@/lib/store";
import { dailyHexForNode, packageById } from "@/lib/protocol";
import { hexAmount, money } from "@/lib/format";

export default function AirdropPage() {
  const hex = useHex();
  const daily = hex.nodes.reduce((sum, node) => {
    const pkg = packageById(node.packageId);
    return sum + dailyHexForNode(pkg.priceUsdt, pkg.monthlyRate);
  }, 0);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Daily airdrop</p>
        <h1 className="display text-4xl">Claim what the grid mined.</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Mining credit accrues continuously from every node you own. Claim moves pending HEX into
          your liquid wallet. No claim is required for mining to continue.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="panel rounded-3xl p-6 md:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Claimable now</p>
          <p className="display mt-3 text-6xl text-gold">{hexAmount(hex.pendingAirdrop)}</p>
          <p className="mt-2 text-muted">HEX · streaming from {hex.nodes.length} nodes</p>
          <button
            type="button"
            onClick={hex.claimAirdrop}
            disabled={hex.nodes.length === 0}
            className="gold-btn mt-6 rounded-full px-6 py-3 disabled:opacity-40"
          >
            Claim airdrop
          </button>
        </article>
        <article className="panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Daily rate</p>
          <p className="display mt-3 text-4xl">{hexAmount(daily)}</p>
          <p className="mt-2 text-sm text-muted">HEX per 24h at current fleet</p>
          <p className="mt-6 text-sm text-muted">Liquid HEX {money(hex.hex)}</p>
        </article>
      </div>

      <div className="panel mt-6 overflow-hidden rounded-3xl">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-5 py-3">Node</th>
              <th className="px-5 py-3">Vein</th>
              <th className="px-5 py-3">Daily HEX</th>
              <th className="px-5 py-3">Since</th>
            </tr>
          </thead>
          <tbody>
            {hex.nodes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-muted">
                  No miners yet. Buy a node to start the airdrop.
                </td>
              </tr>
            )}
            {hex.nodes.map((node) => {
              const pkg = packageById(node.packageId);
              return (
                <tr key={node.id} className="border-t border-line">
                  <td className="px-5 py-3">{pkg.name}</td>
                  <td className="px-5 py-3 text-muted">{pkg.vein}</td>
                  <td className="px-5 py-3">
                    {dailyHexForNode(pkg.priceUsdt, pkg.monthlyRate).toFixed(4)}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(node.purchasedAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
