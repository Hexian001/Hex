"use client";

import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/connect-wallet";
import {
  LICENSES,
  buyerGets,
  capacityLine,
  formatUsdt,
  walletWouldDo,
  type WorkerLicense,
} from "@/lib/licenses";
import { useState } from "react";

export function LicenseDesk() {
  const [selectedId, setSelectedId] = useState<WorkerLicense["id"] | null>(null);
  const { address, isConnected } = useAccount();
  const selected = LICENSES.find((license) => license.id === selectedId) ?? null;

  function choose(id: WorkerLicense["id"]) {
    setSelectedId(id);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
      <fieldset>
        <legend className="font-mono text-xs tracking-[0.16em] text-faint">CHOOSE A LICENSE</legend>
        <div className="mt-4 grid gap-3" role="presentation">
          {LICENSES.map((license) => {
            const active = license.id === selectedId;
            return (
              <label
                key={license.id}
                className={`relative block cursor-pointer border p-5 ${
                  active ? "border-amber bg-panel" : "border-line bg-panel/40 hover:border-brass"
                }`}
              >
                <input
                  type="radio"
                  name="license"
                  value={license.id}
                  className="sr-only"
                  checked={active}
                  onChange={() => choose(license.id)}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.68rem] tracking-[0.14em] text-amber">
                      VIRTUAL COMPUTE LICENSE{active ? " · SELECTED" : ""}
                    </p>
                    <h3 className="mt-1 font-serif text-3xl text-ink">{license.name}</h3>
                  </div>
                  <p className="font-mono text-lg tabular-nums text-brass">{formatUsdt(license.priceUsdt)}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{capacityLine(license)}</p>
              </label>
            );
          })}
        </div>
      </fieldset>

      <aside className="ticks border border-line bg-panel p-6 lg:sticky lg:top-24" aria-live="polite">
        <p className="font-mono text-[0.68rem] tracking-[0.16em] text-faint">WHAT THE BUYER GETS</p>
        {selected ? (
          <>
            <h2 className="mt-3 font-serif text-4xl text-ink">{selected.name}</h2>
            <p className="mt-3 font-mono text-2xl tabular-nums text-brass">{formatUsdt(selected.priceUsdt)}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{buyerGets(selected)}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              <li>{selected.workers === 1 ? "1 virtual worker" : `${selected.workers} virtual workers`}</li>
              <li>{selected.slots} concurrent inference slots</li>
              <li>{selected.tokensPerMonth} tokens scheduled per month</li>
            </ul>
            <div className="mt-6">
              <ConnectWallet variant="primary" />
            </div>
            {isConnected && address ? (
              <div className="mt-4 border border-line bg-bg px-3 py-3">
                <p className="font-mono text-[0.68rem] tracking-[0.14em] text-amber">CONNECTED</p>
                <p className="mt-2 break-all font-mono text-sm text-ink">{address}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">{walletWouldDo(selected)}</p>
                <p className="mt-2 text-xs leading-relaxed text-faint">
                  Purchase broadcast is not enabled yet. The connected wallet is ready for when transfers go live.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <h2 className="mt-3 font-serif text-4xl text-ink">No license selected</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Select a license to see its price and the virtual capacity it covers.
            </p>
            <button type="button" className="btn btn-primary mt-6 w-full" disabled>
              Connect wallet
            </button>
          </>
        )}
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Connect wallet uses your browser wallet (injected provider such as MetaMask) on BNB Smart Chain. No USDT
          transfer is broadcast from this page yet.
        </p>
      </aside>
    </div>
  );
}
