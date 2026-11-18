export function HexMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <polygon
        points="16,2 28.5,9.2 28.5,22.8 16,30 3.5,22.8 3.5,9.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <polygon points="16,9.5 22.4,13.2 22.4,20.4 16,24.1 9.6,20.4 9.6,13.2" fill="currentColor" />
    </svg>
  );
}
