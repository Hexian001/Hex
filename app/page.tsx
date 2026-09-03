"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/Logo";
import { SaleMeter } from "@/components/SaleMeter";
import { useHex } from "@/lib/store";
import { PACKAGES, PROTOCOL, UNLOCK_AT } from "@/lib/protocol";
import { pct } from "@/lib/format";

const VEINS = [
  {
    id: "utilities",
    kicker: "Vein I",
    title: "Utilities",
    body: "HEX nodes are not trophies. They route settlement, index yield, and pay operators a daily mining airdrop for keeping the grid alive. Utility demand is why HEX is spent, not just held.",
  },
  {
    id: "gamefi",
    kicker: "Vein II",
    title: "GameFi",
    body: "HEX Arena turns skill into sink. Matches burn HEX for entry. Prize pools are funded by protocol surplus. Aurea node holders carry a loot bias when the Arena opens after the 60% gate.",
  },
  {
    id: "gold",
    kicker: "Vein III",
    title: "Gold Vault",
    body: "When 60% of genesis nodes are claimed, the Gold Vault opens. Structured yield and staking go live only then — the network has to be real before the reserve is.",
  },
];

export default function LandingPage() {
  const { sold, address } = useHex();
  return (
    <div className="hex-grid min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Link href="/ecosystem" className="hidden text-sm text-muted hover:text-ink sm:inline">
            The story
          </Link>
          <Link
            href={address ? "/dashboard" : "/login"}
            className="gold-btn rounded-full px-4 py-2 text-sm"
          >
            {address ? "Open command" : "Enter HEX"}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Genesis node sale · live</p>
          <h1 className="display mt-4 text-5xl leading-[0.95] sm:text-7xl">
            Hold the grid.
            <span className="block text-gold">Mine HEX.</span>
            Vault the gold.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Hexian Protocol is a three-vein economy: utility nodes, GameFi sinks, and a gold-reserve
            program that unlocks after 60% of genesis nodes are sold. Buy a node. Collect the daily
            airdrop. The vault waits for the threshold.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="gold-btn inline-flex items-center gap-2 rounded-full px-5 py-3">
              Connect wallet <ArrowRight size={16} />
            </Link>
            <Link href="/nodes" className="rounded-full border border-gold/30 px-5 py-3 text-sm">
              View node tiers
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
            <span className="rounded-full border border-line px-3 py-1">{PROTOCOL.chain}</span>
            <span className="rounded-full border border-line px-3 py-1">{PROTOCOL.payment}</span>
            <span className="rounded-full border border-line px-3 py-1">
              {PROTOCOL.totalNodes.toLocaleString()} genesis nodes
            </span>
          </div>
        </div>
        <div className="panel rounded-3xl p-6">
          <p className="text-sm text-muted">Sale progress</p>
          <h2 className="display mt-1 text-3xl">Toward the Gold Vault</h2>
          <div className="mt-5">
            <SaleMeter sold={sold} />
          </div>
          <p className="mt-4 text-sm text-muted">
            Staking and investment stay sealed until {UNLOCK_AT.toLocaleString()} nodes are allocated.
            Unsold nodes are burned when the window closes.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 md:grid-cols-3">
        {VEINS.map((vein) => (
          <article key={vein.id} className="panel rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{vein.kicker}</p>
            <h3 className="display mt-2 text-3xl">{vein.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{vein.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gold">Node program</p>
            <h2 className="display text-4xl">Buy a cell. Get the daily airdrop.</h2>
          </div>
          <Link href="/login" className="hidden text-sm text-gold md:inline">
            Start mining →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <article key={pkg.id} className="panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-jade">{pkg.vein}</p>
              <h3 className="display mt-2 text-2xl">{pkg.name}</h3>
              <p className="mt-1 text-sm text-muted">{pkg.tagline}</p>
              <p className="mt-5 display text-4xl text-gold">
                {pkg.priceUsdt.toLocaleString()}
                <span className="ml-2 text-base font-sans text-muted">USDT</span>
              </p>
              <p className="mt-2 text-sm">
                {pct(pkg.monthlyRate)} monthly mining · {pct(pkg.monthlyRate / 30, 2)} daily airdrop
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {pkg.perks.map((perk) => (
                  <li key={perk}>▸ {perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-5 py-8 text-center text-xs text-muted">
        HEX is an original protocol demo. Functions follow a node-sale + daily airdrop + 60% unlock
        model. Visual identity is not copied from third-party apps. Sandbox balances are not real
        mainnet funds.
      </footer>
    </div>
  );
}
