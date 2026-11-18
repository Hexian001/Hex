const PLANS = [
  {
    name: "Scout",
    price: "Free",
    detail: "Economy engines · hard daily cap",
    perks: [
      "Light swarm workers only",
      "Hard daily credit ceiling",
      "Wallet connect ready",
      "Playground + basic history",
    ],
    cta: "Start scouting",
    featured: false,
  },
  {
    name: "Forager",
    price: "15 USDT",
    detail: "≈ 400 credits / month",
    perks: [
      "Full multi-engine routing",
      "Priority pollination queue",
      "Credit packs for overage",
      "Exportable session logs",
    ],
    cta: "Upgrade capacity",
    featured: true,
  },
];

export function Capacity() {
  return (
    <section id="capacity" className="relative border-t border-[var(--line)] py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber">
            Capacity
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-honey sm:text-4xl">
            Credits are compute — not a yield story.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist">
            Buy what you burn. Free keeps you on lighter workers with a hard
            cap. Forager opens the full comb. Ultra arrives later for heavy
            research loads.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden border p-7 sm:p-8 ${
                plan.featured
                  ? "border-amber/50 bg-[linear-gradient(160deg,rgba(232,160,26,0.12),rgba(17,21,19,0.9)_45%)]"
                  : "border-[var(--line)] bg-ink-elevated/50"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-bright">
                  Recommended
                </span>
              ) : null}
              <h3 className="font-display text-2xl font-bold text-honey">
                {plan.name}
              </h3>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-tight text-amber-bright">
                {plan.price}
                {plan.price !== "Free" ? (
                  <span className="ml-2 font-sans text-sm font-normal text-mist">
                    / mo
                  </span>
                ) : null}
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-mist">
                {plan.detail}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 text-sm text-mist"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`mt-9 w-full rounded-sm px-4 py-3 font-display text-sm font-bold transition ${
                  plan.featured
                    ? "bg-amber text-ink hover:bg-amber-bright"
                    : "border border-[var(--line)] text-honey hover:border-amber/40"
                }`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
