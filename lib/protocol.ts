export const PROTOCOL = {
  name: "HEX",
  fullName: "Hexian Protocol",
  token: "HEX",
  chain: "BNB Smart Chain",
  payment: "USDT (BEP-20)",
  totalNodes: 2000,
  unlockRatio: 0.6,
  saleDays: 90,
  hexUsd: 1,
  demoUsdt: 30_000,
  minInvestUsdt: 100,
  minStakeHex: 100,
  withdrawFee: 0.05,
} as const;

export const UNLOCK_AT = Math.floor(PROTOCOL.totalNodes * PROTOCOL.unlockRatio);

export const PACKAGES = [
  {
    id: "ember",
    name: "Ember Node",
    tagline: "Keeps the utility grid routing.",
    priceUsdt: 1000,
    monthlyRate: 0.08,
    bonusPct: 0,
    vein: "Utilities" as const,
    allocation: 1100,
    perks: [
      "Daily HEX mining airdrop",
      "Utility fee-share after TGE",
      "Grid operator badge",
    ],
  },
  {
    id: "aurea",
    name: "Aurea Node",
    tagline: "Arena multiplier for GameFi drops.",
    priceUsdt: 5000,
    monthlyRate: 0.09,
    bonusPct: 0.05,
    vein: "GameFi" as const,
    allocation: 650,
    perks: [
      "9% monthly mining rate",
      "5% HEX bonus on purchase",
      "Arena loot bias when GameFi opens",
    ],
  },
  {
    id: "sovereign",
    name: "Sovereign Node",
    tagline: "Priority seat in the Gold Vault.",
    priceUsdt: 10_000,
    monthlyRate: 0.1,
    bonusPct: 0.1,
    vein: "Gold" as const,
    allocation: 250,
    perks: [
      "10% monthly mining rate",
      "10% HEX bonus on purchase",
      "Gold Vault priority when 60% is sold",
    ],
  },
] as const;

export type PackageId = (typeof PACKAGES)[number]["id"];
export type Vein = (typeof PACKAGES)[number]["vein"];

export const INVEST_PROGRAMS = [
  {
    id: "gold80",
    name: "Gold Vault 80/20",
    vein: "Gold" as const,
    blurb:
      "Eighty percent is booked as vault principal. Twenty percent is burned as protocol surplus, tightening HEX supply.",
    splitPrincipal: 0.8,
    burnPct: 0.2,
    dailyRate: 0.0045,
    maxoutMultiple: 2,
  },
  {
    id: "gamefi90",
    name: "Arena Bond 90/10",
    vein: "GameFi" as const,
    blurb:
      "Ninety percent is working capital. Ten percent seeds the HEX Arena prize pool so play-and-earn has a real treasury.",
    splitPrincipal: 0.9,
    burnPct: 0.1,
    dailyRate: 0.0032,
    maxoutMultiple: 1.8,
  },
] as const;

export type InvestId = (typeof INVEST_PROGRAMS)[number]["id"];

export const STAKE = {
  dailyRate: 0.0025,
  lockHint: "Unstake anytime. Yield stops when you exit.",
} as const;

export const INITIAL_SOLD: Record<PackageId, number> = {
  ember: 520,
  aurea: 210,
  sovereign: 50,
};

export function packageById(id: PackageId) {
  const found = PACKAGES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown package ${id}`);
  return found;
}

export function investById(id: InvestId) {
  const found = INVEST_PROGRAMS.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown program ${id}`);
  return found;
}

export function dailyHexForNode(priceUsdt: number, monthlyRate: number) {
  return (priceUsdt * monthlyRate) / 30;
}

export function soldTotal(sold: Record<PackageId, number>) {
  return PACKAGES.reduce((sum, item) => sum + sold[item.id], 0);
}

export function saleProgress(sold: Record<PackageId, number>) {
  return soldTotal(sold) / PROTOCOL.totalNodes;
}

export function programsUnlocked(sold: Record<PackageId, number>) {
  return soldTotal(sold) >= UNLOCK_AT;
}

export function remainingOf(id: PackageId, sold: Record<PackageId, number>) {
  return Math.max(0, packageById(id).allocation - sold[id]);
}
