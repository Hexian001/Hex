export type LicenseId = "single" | "pair" | "quad";

export type WorkerLicense = {
  id: LicenseId;
  name: string;
  priceUsdt: number;
  workers: number;
  slots: number;
  tokensPerMonth: string;
};

export const LICENSES: readonly WorkerLicense[] = [
  {
    id: "single",
    name: "Single worker",
    priceUsdt: 1000,
    workers: 1,
    slots: 8,
    tokensPerMonth: "2 million",
  },
  {
    id: "pair",
    name: "Pair",
    priceUsdt: 2000,
    workers: 2,
    slots: 16,
    tokensPerMonth: "5 million",
  },
  {
    id: "quad",
    name: "Quad",
    priceUsdt: 4000,
    workers: 4,
    slots: 32,
    tokensPerMonth: "12 million",
  },
];

export function formatUsdt(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(amount)} USDT`;
}

export function workerPhrase(count: number): string {
  return count === 1 ? "1 virtual worker" : `${count} virtual workers`;
}

export function capacityLine(license: WorkerLicense): string {
  return `${workerPhrase(license.workers)} · ${license.slots} concurrent slots · ${license.tokensPerMonth} tokens / month`;
}

export function buyerGets(license: WorkerLicense): string {
  return `You are licensing ${workerPhrase(license.workers)}: ${license.slots} concurrent inference slots and a scheduling quota of ${license.tokensPerMonth} tokens per month. That capacity is what the license covers, and it can be offered to the Hivera chat front end. The price is ${formatUsdt(license.priceUsdt)}.`;
}

export function walletWouldDo(license: WorkerLicense): string {
  return `A live wallet connect would open a wallet you already control, confirm the address, and ask you to approve a USDT transfer of ${formatUsdt(license.priceUsdt)} for the ${license.name} license. That license is ${workerPhrase(license.workers)}. The license would be recorded against the address that approved the transfer. This control does not open a wallet, request a signature, or broadcast a transfer.`;
}
