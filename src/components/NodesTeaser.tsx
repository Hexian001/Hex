export function NodesTeaser() {
  return (
    <section
      id="nodes"
      className="relative overflow-hidden border-t border-[var(--line)] py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(158,207,154,0.07),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-nectar">
              Next chamber · Nodes
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-honey sm:text-4xl">
              Sell capacity into the hive — coming after AI.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-mist">
              A second surface will let operators list compute and expand the
              swarm. This draft ships the AI chamber first; the node marketplace
              stays on the roadmap so credits stay honest usage — not theater.
            </p>
          </div>

          <div className="relative border border-dashed border-nectar/30 bg-ink-elevated/40 p-8">
            <div className="flex gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className="hex-clip h-8 w-7 bg-nectar/20"
                  style={{ opacity: 0.25 + i * 0.1 }}
                />
              ))}
            </div>
            <p className="mt-6 font-display text-lg text-honey">
              Node listings · compute marketplace · operator rewards
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
              Locked until AI draft lands
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
