import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:px-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl leading-snug text-ink md:text-3xl">
            Hivera.net — The Global Decentralized Compute Network
          </p>
          <div className="mt-4 space-y-1 font-mono text-sm text-muted">
            <p>@HiveraNet</p>
            <p>t.me/HiveraNet</p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap content-end gap-x-5 gap-y-2 text-sm text-muted md:justify-end">
          <Link href="/" className="hover:text-ink">Overview</Link>
          <Link href="/chat" className="hover:text-ink">Chat</Link>
          <Link href="/nodes" className="hover:text-ink">Nodes</Link>
          <Link href="/docs" className="hover:text-ink">Docs</Link>
        </nav>
      </div>
    </footer>
  );
}
