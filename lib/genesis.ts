/** Public genesis admin address. Private key is never in this repo. */
export const GENESIS_ADDRESS =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GENESIS_ADDRESS?.trim()) ||
  "0x6928a6a87c88482f27ef59255496AA273f68c37a";

export function isGenesisAdmin(address: string | undefined | null): boolean {
  if (!address) return false;
  return address.toLowerCase() === GENESIS_ADDRESS.toLowerCase();
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
