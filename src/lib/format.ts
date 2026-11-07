import { formatUnits, parseUnits } from "viem";

export function parseTokenAmount(value: string, decimals: number): bigint {
  const cleaned = value.trim();
  if (!cleaned || cleaned === ".") return BigInt(0);
  return parseUnits(cleaned, decimals);
}

export function formatTokenAmount(
  amount: bigint | string | undefined,
  decimals: number,
  maxFrac = 6,
): string {
  if (amount === undefined) return "0";
  const raw = typeof amount === "string" ? BigInt(amount) : amount;
  const full = formatUnits(raw, decimals);
  const [intPart, frac = ""] = full.split(".");
  if (!frac) return intPart;
  const trimmed = frac.slice(0, maxFrac).replace(/0+$/, "");
  return trimmed ? `${intPart}.${trimmed}` : intPart;
}

export function formatUsdish(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value < 0.01) return "<$0.01";
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function bpsToPercent(bps: number | undefined): string {
  if (bps === undefined) return "—";
  return `${(bps / 100).toFixed(bps < 10 ? 2 : 1)}%`;
}
