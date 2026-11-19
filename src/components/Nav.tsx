"use client";

import { useState } from "react";

const LINKS = [
  { href: "#ai", label: "AI", active: true },
  { href: "#swarm", label: "Swarm" },
  { href: "#playground", label: "Playground" },
  { href: "#capacity", label: "Capacity" },
  { href: "#nodes", label: "Nodes", soon: true },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="hex-clip relative grid h-8 w-7 place-items-center bg-amber">
            <span className="h-2 w-2 rounded-full bg-ink" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-honey sm:text-xl">
            Hivera
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-sans text-sm tracking-wide transition ${
                link.active
                  ? "text-amber-bright"
                  : "text-mist hover:text-honey"
              }`}
            >
              {link.label}
              {link.soon ? (
                <span className="ml-1.5 font-mono text-[10px] uppercase text-amber-dim">
                  soon
                </span>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
              className="hidden rounded-sm border border-amber/40 bg-amber/10 px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-honey transition hover:border-amber hover:bg-amber/20 sm:inline-flex"
            >
              Connect wallet
            </button>
          <button
            type="button"
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center border border-[var(--line)] text-honey md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex w-4 flex-col gap-1">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--line)] bg-ink-elevated px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-mist"
                onClick={() => setOpen(false)}
              >
                {link.label}
                {link.soon ? " · soon" : ""}
              </a>
            ))}
            <button
              type="button"
              className="mt-2 rounded-sm border border-amber/40 bg-amber/10 px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-honey"
            >
              Connect wallet
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
