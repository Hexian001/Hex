"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/Logo";
import { useHex } from "@/lib/store";

export default function LoginPage() {
  const hex = useHex();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hex.hydrated && hex.address) router.replace("/dashboard");
  }, [hex.hydrated, hex.address, router]);

  return (
    <div className="hex-grid relative min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-16">
        <BrandMark />
        <p className="mt-10 text-xs uppercase tracking-[0.28em] text-gold">
          Genesis node sale — live now
        </p>
        <h1 className="display mt-4 text-5xl leading-[0.95]">
          Own a node.
          <span className="block text-gold">Mine HEX daily.</span>
        </h1>
        <p className="mt-5 text-muted">
          Connect a BNB wallet to buy genesis nodes in USDT (BEP-20), collect the daily mining
          airdrop, and wait for the 60% gate that opens staking and the Gold Vault.
        </p>
        <div className="mt-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-muted">
          <span className="rounded-full border border-line px-3 py-1">BNB Chain</span>
          <span className="rounded-full border border-line px-3 py-1">USDT BEP-20</span>
          <span className="rounded-full border border-line px-3 py-1">Sandbox EIP-712</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="gold-btn mt-8 w-full rounded-2xl py-4 text-base"
        >
          Connect wallet
        </button>
        <p className="mt-4 text-center text-xs text-muted">
          This build uses a local sandbox wallet so you can exercise every function without a live
          contract. Mainnet wiring is the next phase.
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="panel w-full max-w-md rounded-3xl p-6">
            <h2 className="display text-2xl">Choose a wallet</h2>
            <p className="mt-2 text-sm text-muted">
              Demo connectors. Each option issues a local HEX address and 30,000 test USDT.
            </p>
            <div className="mt-5 space-y-2">
              {["MetaMask", "WalletConnect", "Binance Wallet"].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    hex.connect();
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-line px-4 py-3 text-left hover:border-gold/40"
                >
                  <span>{name}</span>
                  <span className="text-xs text-muted">sandbox</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-sm text-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
