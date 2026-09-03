export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hexGold" x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4d889" />
          <stop offset="1" stopColor="#b07a22" />
        </linearGradient>
      </defs>
      <path
        d="M32 4l24 14v28L32 60 8 46V18z"
        fill="#14110c"
        stroke="url(#hexGold)"
        strokeWidth="2.5"
      />
      <path
        d="M24 22v8.5h16V22h4.5v20H40V34.2H24V42h-4.5V22H24z"
        fill="url(#hexGold)"
      />
    </svg>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <Logo className={compact ? "h-8 w-8" : "h-9 w-9"} />
      <span className="display text-xl tracking-tight">
        HEX
        {!compact && (
          <span className="ml-2 text-xs font-sans font-medium uppercase tracking-[0.22em] text-muted">
            Protocol
          </span>
        )}
      </span>
    </span>
  );
}
