"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/connect-wallet";
import { GENESIS_ADDRESS, isGenesisAdmin, shortAddress } from "@/lib/genesis";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const allowed = isGenesisAdmin(address);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <p className="font-mono text-xs tracking-[0.18em] text-amber">GENESIS ADMIN</p>
      <h1 className="mt-4 font-serif text-[clamp(2.4rem,4.5vw,3.6rem)] leading-[0.95] text-ink">
        Network admin
      </h1>
      <p className="prose-measure mt-5 text-lg leading-relaxed text-muted">
        This page is visible in the header only when the connected wallet matches the genesis
        admin address. It does not change on-chain roles by itself.
      </p>

      <div className="mt-10 border border-line bg-panel p-6">
        <p className="font-mono text-[0.68rem] tracking-[0.16em] text-faint">WALLET</p>
        {!isConnected ? (
          <>
            <p className="mt-3 text-sm text-muted">Connect the genesis wallet to open admin tools.</p>
            <div className="mt-5">
              <ConnectWallet variant="primary" />
            </div>
          </>
        ) : allowed ? (
          <>
            <p className="mt-3 font-mono text-sm text-lime">
              Connected as genesis · {address ? shortAddress(address) : ""}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
              <li>Review node license desk pricing on <Link href="/nodes" className="text-brass hover:text-amber">Nodes</Link>.</li>
              <li>Confirm chat availability on <Link href="/chat" className="text-brass hover:text-amber">Chat</Link>.</li>
              <li>
                Genesis public address:{" "}
                <span className="break-all font-mono text-ink">{GENESIS_ADDRESS}</span>
              </li>
            </ul>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-clay" role="alert">
              Connected wallet is not the genesis admin.
            </p>
            <p className="mt-2 break-all font-mono text-xs text-faint">
              Connected: {address}
            </p>
            <p className="mt-1 break-all font-mono text-xs text-faint">
              Expected: {GENESIS_ADDRESS}
            </p>
            <div className="mt-5">
              <ConnectWallet variant="primary" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
