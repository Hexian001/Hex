import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 md:px-8">
      <p className="font-mono text-xs tracking-[0.18em] text-amber">404</p>
      <h1 className="mt-4 font-serif text-5xl text-ink">That path is not on hivera.net.</h1>
      <p className="mt-4 text-muted">The public site is the overview, the chat, the operator portal, and these docs.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn btn-primary" href="/">
          Overview
        </Link>
        <Link className="btn btn-ghost" href="/chat">
          Chat
        </Link>
        <Link className="btn btn-ghost" href="/nodes">
          Nodes
        </Link>
        <Link className="btn btn-ghost" href="/docs">
          Docs
        </Link>
      </div>
    </div>
  );
}
