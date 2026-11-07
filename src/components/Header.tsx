"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { shortAddress } from "@/lib/format";

export function Header() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0];

  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden />
        <div>
          <p className="brand-name">HexSwap</p>
          <p className="brand-sub">Powered by PancakeSwap</p>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Primary">
        <span className="nav-tab active">Swap</span>
        <a
          className="nav-tab"
          href="https://pancakeswap.finance/liquidity"
          target="_blank"
          rel="noreferrer"
        >
          Liquidity
        </a>
        <a
          className="nav-tab"
          href="https://pancakeswap.finance/info"
          target="_blank"
          rel="noreferrer"
        >
          Info
        </a>
      </nav>

      <div className="header-actions">
        {isConnected && chainId !== bsc.id && (
          <button
            type="button"
            className="btn ghost"
            onClick={() => switchChain({ chainId: bsc.id })}
          >
            Switch to BNB Chain
          </button>
        )}
        {isConnected && address ? (
          <button
            type="button"
            className="btn wallet"
            onClick={() => disconnect()}
            title="Disconnect"
          >
            {shortAddress(address)}
          </button>
        ) : (
          <button
            type="button"
            className="btn primary"
            disabled={isPending || !injected}
            onClick={() => injected && connect({ connector: injected, chainId: bsc.id })}
          >
            {isPending ? "Connecting…" : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
