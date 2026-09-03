"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  Boxes,
  Coins,
  Compass,
  Landmark,
  LayoutDashboard,
  Lock,
  Sparkles,
  Wallet,
} from "lucide-react";
import { BrandMark } from "@/components/Logo";
import { useHex } from "@/lib/store";
import { programsUnlocked } from "@/lib/protocol";
import { money, shortAddress } from "@/lib/format";

const NAV = [
  { href: "/dashboard", label: "Command", icon: LayoutDashboard },
  { href: "/nodes", label: "Nodes", icon: Boxes },
  { href: "/airdrop", label: "Airdrop", icon: Sparkles },
  { href: "/staking", label: "Staking", icon: Landmark, gated: true },
  { href: "/invest", label: "Gold & Arena", icon: Coins, gated: true },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/ecosystem", label: "Story", icon: Compass },
];

export function AppShell({ children }: { children: ReactNode }) {
  const hex = useHex();
  const pathname = usePathname();
  const router = useRouter();
  const unlocked = programsUnlocked(hex.sold);

  useEffect(() => {
    if (!hex.hydrated) return;
    if (!hex.address) router.replace("/login");
  }, [hex.hydrated, hex.address, router]);

  if (!hex.hydrated || !hex.address) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        Opening the grid…
      </div>
    );
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-black/30 p-5 md:flex">
        <Link href="/" className="mb-8">
          <BrandMark />
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const locked = Boolean(item.gated && !unlocked);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-gold/15 text-gold" : "text-muted hover:bg-white/5 hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} />
                  {item.label}
                </span>
                {locked && <Lock size={13} />}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => {
            hex.disconnect();
            router.push("/login");
          }}
          className="mt-4 rounded-xl border border-line px-3 py-2 text-left text-xs text-muted hover:text-ink"
        >
          Disconnect {shortAddress(hex.address)}
        </button>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-[#090805]/80 px-4 py-3 backdrop-blur md:px-8">
          <Link href="/" className="md:hidden">
            <BrandMark compact />
          </Link>
          <p className="hidden text-sm text-muted md:block">
            BNB · USDT BEP-20 · sandbox ledger
          </p>
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="rounded-full border border-line px-3 py-1 text-muted">
              {shortAddress(hex.address)}
            </span>
            <span className="rounded-full bg-gold/15 px-3 py-1 text-gold">
              {money(hex.usdt)} USDT
            </span>
            <span className="rounded-full bg-jade/10 px-3 py-1 text-jade">
              {money(hex.hex)} HEX
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-[#090805]/95 px-1 py-2 md:hidden">
        {NAV.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                active ? "text-gold" : "text-muted"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
