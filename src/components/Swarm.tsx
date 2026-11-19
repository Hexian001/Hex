const STEPS = [
  {
    code: "01",
    title: "Fund the comb",
    body: "Connect a wallet and top up with USDT. Balances convert into compute credits — usage units, not investment shares.",
  },
  {
    code: "02",
    title: "Release a prompt",
    body: "Ask anything. Hivera treats each prompt like pollen: a packet that travels the hive until an engine can nourish it.",
  },
  {
    code: "03",
    title: "Swarm routing",
    body: "One branded surface. Many underlying engines. The hive picks the right worker for speed, depth, or economy — you stay in one chat.",
  },
];

export function Swarm() {
  return (
    <section id="swarm" className="relative border-t border-[var(--line)] py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(232,160,26,0.06),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber">
            How the hive works
          </p>
          <h2 className="mt-3 font-display text-3xl font-700 tracking-tight text-honey sm:text-4xl">
            From wallet to answer — one continuous pollination path.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist">
            Built for people who already live on-chain: settle in stablecoins,
            spend transparent credits, keep the model stack behind a single
            Hivera interface.
          </p>
        </div>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((step) => (
            <li key={step.code} className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="hex-clip grid h-11 w-10 place-items-center bg-wax font-mono text-xs text-amber">
                  {step.code}
                </span>
                <span className="h-px flex-1 bg-[var(--line)]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-honey">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
