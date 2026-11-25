"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { isGenesisAdmin, shortAddress } from "@/lib/genesis";

type ConnectWalletProps = {
  className?: string;
  /** Full-width primary style for the nodes desk */
  variant?: "header" | "primary";
  disabled?: boolean;
};

export function ConnectWallet({
  className = "",
  variant = "header",
  disabled = false,
}: ConnectWalletProps) {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, status } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={buttonClass(variant, className)}
        disabled
        aria-hidden
      >
        Connect wallet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span
          className="font-mono text-xs tracking-wide text-brass"
          title={address}
          data-genesis={isGenesisAdmin(address) ? "true" : "false"}
        >
          {shortAddress(address)}
          {isGenesisAdmin(address) ? " · admin" : ""}
        </span>
        <button
          type="button"
          className={variant === "primary" ? "btn btn-ghost min-h-10 px-3" : "btn btn-ghost min-h-9 px-3 text-sm"}
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <div className={className}>
      <button
        type="button"
        className={buttonClass(variant)}
        disabled={disabled || isPending || status === "connecting" || !connector}
        onClick={() => {
          if (!connector) return;
          connect({ connector });
        }}
      >
        {isPending || status === "connecting" ? "Connecting…" : "Connect wallet"}
      </button>
      {error ? (
        <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-clay" role="alert">
          {friendlyConnectError(error.message)}
        </p>
      ) : null}
    </div>
  );
}

function buttonClass(variant: "header" | "primary", extra = "") {
  if (variant === "primary") {
    return `btn btn-primary w-full ${extra}`.trim();
  }
  return `btn btn-ghost min-h-9 px-3 text-sm ${extra}`.trim();
}

function friendlyConnectError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("rejected") || lower.includes("denied")) {
    return "Connection rejected in the wallet.";
  }
  if (lower.includes("provider") || lower.includes("connector")) {
    return "No browser wallet found. Install MetaMask or another injected wallet, then try again.";
  }
  return message;
}
