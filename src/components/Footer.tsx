export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="hex-clip h-6 w-5 bg-amber" />
          <span className="font-display text-sm font-bold text-honey">
            Hivera
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
            AI draft
          </span>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-mist">
          Working brand name while Pollinex is evaluated. Credits meter
          compute. Third-party model providers power responses under the Hivera
          surface.
        </p>
      </div>
    </footer>
  );
}
