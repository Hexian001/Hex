import type { Metadata } from "next";
import { LicenseDesk } from "@/components/license-desk";

export const metadata: Metadata = {
  title: "Nodes",
  description:
    "License virtual compute on the Hivera network at 1,000, 2,000, or 4,000 USDT. The page states price and capacity.",
};

export default function NodesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="font-mono text-xs tracking-[0.18em] text-amber">OPERATOR PORTAL</p>
      <h1 className="mt-4 max-w-[16ch] font-serif text-[clamp(2.8rem,5.4vw,4.8rem)] leading-[0.95] text-ink">
        Power the Global AI Hive. Earn From Every Query.
      </h1>
      <p className="prose-measure mt-5 text-lg leading-relaxed text-muted">
        A worker-node license is virtual compute. You pay a stated price in USDT and license a stated amount of capacity the network can schedule for inference. The tiers below list that price and that capacity.
      </p>
      <div className="mt-12">
        <LicenseDesk />
      </div>
    </div>
  );
}
