"use client";

import { useState } from "react";
import { Dialog } from "@/components/dialog";
import {
  LICENSES,
  buyerGets,
  capacityLine,
  formatUsdt,
  walletWouldDo,
  type WorkerLicense,
} from "@/lib/licenses";

const PREVIEW_ADDRESS = "0xPREVIEW0000000000000000000000HIVE";

export function LicenseDesk() {
  const [selectedId, setSelectedId] = useState<WorkerLicense["id"] | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const selected = LICENSES.find((license) => license.id === selectedId) ?? null;

  function choose(id: WorkerLicense["id"]) {
    setSelectedId(id);
    setShowPreview(false);
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
            <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => setWalletOpen(true)}>
              Connect wallet
            </button>
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
          Connect wallet opens a preview. It names the USDT transfer a live wallet would request. No transaction is sent.
        </p>
      </aside>

      <Dialog
        open={walletOpen && selected !== null}
        title="Wallet connect preview"
        onClose={() => {
          setWalletOpen(false);
          setShowPreview(false);
        }}
      >
        {selected ? (
          <div className="space-y-4 text-sm leading-relaxed text-muted">
            <p className="font-mono text-base text-brass">
              {selected.name} · {formatUsdt(selected.priceUsdt)}
            </p>
            <p>{buyerGets(selected)}</p>
            <p>{walletWouldDo(selected)}</p>
            {showPreview ? (
              <div className="border border-line bg-bg px-3 py-3">
                <p className="font-mono text-[0.68rem] tracking-[0.14em] text-amber">PREVIEW ADDRESS</p>
                <p className="mt-2 break-all font-mono text-sm text-ink">{PREVIEW_ADDRESS}</p>
                <p className="mt-2 text-xs text-faint">
                  Generated in the browser for this layout. Not a wallet, not a key, and not an account on a chain.
                </p>
              </div>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={() => setShowPreview(true)}>
                Show a preview address
              </button>
            )}
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
