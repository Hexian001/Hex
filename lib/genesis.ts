/** Public genesis admin address. Private key is never in this repo. */
export const GENESIS_ADDRESS =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GENESIS_ADDRESS?.trim()) ||
  "0x95093FA66De3af568c662f91A844267F2c9Ceff7";

export function isGenesisAdmin(address: string | undefined | null): boolean {
  if (!address) return false;
  return address.toLowerCase() === GENESIS_ADDRESS.toLowerCase();
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
