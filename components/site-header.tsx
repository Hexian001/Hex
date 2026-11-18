"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HexMark } from "@/components/hex-mark";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/chat", label: "Chat" },
  { href: "/nodes", label: "Nodes" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-amber" aria-label="Hivera home">
          <HexMark />
          <span className="font-mono text-[0.78rem] tracking-[0.22em] text-ink">HIVERA</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-6 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`text-sm ${
                isActive(pathname, link.href) ? "text-brass" : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="font-mono text-xs tracking-wide text-faint">hivera.net</span>
        </nav>
        <button
          type="button"
          className="nav-toggle btn btn-ghost ml-auto min-h-10 px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line px-5 py-4 md:hidden" aria-label="Primary">
          <ul className="grid gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className="block py-3 font-serif text-3xl text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-xs text-faint">hivera.net</p>
        </nav>
      ) : null}
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
