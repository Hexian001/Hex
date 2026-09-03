import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { SaleMeter } from "@/components/SaleMeter";
import { UNLOCK_AT, soldTotal, type PackageId } from "@/lib/protocol";

export function LockGate({
  unlocked,
  sold,
  title,
  children,
}: {
  unlocked: boolean;
  sold: Record<PackageId, number>;
  title: string;
  children: ReactNode;
}) {
  if (unlocked) return <>{children}</>;
  const left = UNLOCK_AT - soldTotal(sold);
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-[2px]">{children}</div>
      <div className="absolute inset-0 grid place-items-center rounded-3xl bg-black/55 p-6">
        <div className="panel max-w-lg rounded-3xl p-6 text-center">
          <Lock className="mx-auto mb-3 text-gold" />
          <h3 className="display text-2xl">{title}</h3>
          <p className="mt-2 text-sm text-muted">
            This program opens when {UNLOCK_AT.toLocaleString()} genesis nodes are sold.
            {left > 0 ? ` ${left.toLocaleString()} nodes remain to threshold.` : ""}
          </p>
          <div className="mt-5 text-left">
            <SaleMeter sold={sold} />
          </div>
          <Link
            href="/nodes"
            className="gold-btn mt-5 inline-flex rounded-full px-5 py-2 text-sm"
          >
            Buy nodes to advance the sale
          </Link>
        </div>
      </div>
    </div>
  );
}
