import { soldTotal, PROTOCOL, UNLOCK_AT, programsUnlocked, type PackageId } from "@/lib/protocol";
import { pct } from "@/lib/format";

export function SaleMeter({ sold }: { sold: Record<PackageId, number> }) {
  const total = soldTotal(sold);
  const progress = total / PROTOCOL.totalNodes;
  const unlocked = programsUnlocked(sold);
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3 text-sm">
        <p className="text-muted">
          Genesis sold <span className="text-ink">{total.toLocaleString()}</span> / {PROTOCOL.totalNodes.toLocaleString()}
        </p>
        <p className={unlocked ? "text-jade" : "text-gold"}>
          {pct(progress)} · unlock at {UNLOCK_AT.toLocaleString()} nodes
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-2 via-gold to-jade"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
      <div className="relative h-3">
        <span
          className="absolute top-0 h-3 w-px bg-gold"
          style={{ left: `${PROTOCOL.unlockRatio * 100}%` }}
        />
      </div>
    </div>
  );
}
