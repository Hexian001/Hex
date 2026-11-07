import { Header } from "@/components/Header";
import { SwapCard } from "@/components/SwapCard";

export default function Home() {
  return (
    <div className="page-shell">
      <Header />
      <main className="main">
        <div className="hero-copy">
          <h2>Swap with Pancake liquidity</h2>
          <p>
            HexSwap is a lightweight exchange UI. Quotes, routes, and calldata
            come from PancakeSwap&apos;s Unified Swap API on BNB Chain.
          </p>
        </div>
        <SwapCard />
        <p className="foot-note">
          Main features: live quotes, token select, slippage controls, ERC-20
          approve, and on-chain swap through PancakeSwap&apos;s aggregator
          router. Not affiliated with PancakeSwap.
        </p>
      </main>
    </div>
  );
}
