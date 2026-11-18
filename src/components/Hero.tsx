import { HexField } from "./HexField";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-24 sm:pt-24"
    >
      <HexField />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-amber">
            Computational hive · AI layer
          </p>
          <h1 className="font-display text-[clamp(3.1rem,9vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-honey">
            Hivera
          </h1>
          <p className="mt-3 font-display text-[clamp(1.35rem,3.4vw,2.1rem)] font-semibold leading-tight text-amber-bright/90">
            Wallet-native intelligence.
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mist sm:text-lg">
            Pay once in USDT. Spend metered compute credits. One hive routes
            your prompts across a swarm of model engines.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#playground"
              className="inline-flex items-center gap-2 rounded-sm bg-amber px-5 py-3 font-display text-sm font-bold tracking-wide text-ink transition hover:bg-amber-bright"
            >
              Enter the hive
              <span aria-hidden>→</span>
            </a>
            <a
              href="#capacity"
              className="inline-flex items-center gap-2 rounded-sm border border-[var(--line)] bg-ink-elevated/60 px-5 py-3 font-sans text-sm text-honey transition hover:border-amber/50"
            >
              Get credits
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--line)] pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mist/80 animate-fade-up [animation-delay:200ms]">
          <span>USDT settle</span>
          <span>Multi-engine routing</span>
          <span>Metered compute</span>
        </div>
      </div>
    </section>
  );
}
