"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/Logo";
import { AppShell } from "@/components/AppShell";
import { useHex } from "@/lib/store";

const CHAPTERS = [
  {
    title: "Utilities — the grid that must be fed",
    body: "Every Hexian node is a utility cell. It does not sit idle: it routes settlement, indexes yield, and is paid a daily mining airdrop for remaining online. HEX is the gas of that grid — spent for access, priority, and fee discounts after TGE. Ember nodes are the base layer of this vein.",
  },
  {
    title: "GameFi — demand that plays",
    body: "HEX Arena is the second vein. Matches require HEX entry. Prize pools are capitalized by Arena Bond 90/10 once the 60% gate opens. Skill creates sinks; sinks support the token. Aurea nodes carry a loot bias so miners who underwrite the Arena share in its drops.",
  },
  {
    title: "Gold — the vault that waits",
    body: "The Gold Vault is deliberately late. Until 60% of genesis nodes are sold, there is no staking book and no gold investment window. That delay is the story: a reserve should not open on an empty network. Sovereign nodes hold priority when the vault unseals. Gold Vault 80/20 books principal and burns surplus, tying digital HEX to a reserve narrative rather than pure inflation.",
  },
];

export default function EcosystemPage() {
  const { address } = useHex();
  const Frame = address ? AppShell : ({ children }: { children: ReactNode }) => (
    <div className="hex-grid min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <Link href="/">
          <BrandMark />
        </Link>
        <Link href="/login" className="gold-btn rounded-full px-4 py-2 text-sm">
          Enter HEX
        </Link>
      </header>
      <div className="mx-auto max-w-3xl px-5 pb-16">{children}</div>
    </div>
  );

  return (
    <Frame>
      <p className="text-xs uppercase tracking-[0.22em] text-gold">Hexian lore</p>
      <h1 className="display mt-2 text-5xl">Three veins. One reserve.</h1>
      <p className="mt-4 text-lg text-muted">
        HEX is written as a single economy with three stories that interlock. Nodes fund the grid.
        The Arena spends HEX. Gold only opens when the sale has proven the network.
      </p>
      <div className="mt-10 space-y-6">
        {CHAPTERS.map((chapter) => (
          <article key={chapter.title} className="panel rounded-3xl p-6">
            <h2 className="display text-2xl">{chapter.title}</h2>
            <p className="mt-3 leading-7 text-muted">{chapter.body}</p>
          </article>
        ))}
      </div>
      <article className="panel mt-6 rounded-3xl p-6">
        <h2 className="display text-2xl">Sequence</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li>1. Genesis node sale — 2,000 cells, 90-day window, daily HEX airdrop.</li>
          <li>2. 60% sold — staking, Gold Vault 80/20, and Arena Bond 90/10 unlock.</li>
          <li>3. Sale close — unsold nodes burned. Token unlocks begin on a delay.</li>
          <li>4. Utility TGE — grid fees, Arena live, gold attestation.</li>
        </ol>
      </article>
    </Frame>
  );
}
