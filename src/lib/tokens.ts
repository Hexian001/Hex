export type Token = {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  logo: string;
  isNative?: boolean;
};

/** Native BNB uses the zero address in the PancakeSwap Unified Swap API. */
export const NATIVE_ADDRESS =
  "0x0000000000000000000000000000000000000000" as const;

export const WBNB_ADDRESS =
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" as const;

export const BSC_TOKENS: Token[] = [
  {
    symbol: "BNB",
    name: "BNB",
    address: NATIVE_ADDRESS,
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/symbol/bnb.png",
    isNative: true,
  },
  {
    symbol: "CAKE",
    name: "PancakeSwap Token",
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/0x55d398326f99059fF775485246999027B3197955.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png",
  },
  {
    symbol: "ETH",
    name: "Ethereum Token",
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png",
  },
  {
    symbol: "BTCB",
    name: "BTCB Token",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png",
  },
  {
    symbol: "WBNB",
    name: "Wrapped BNB",
    address: WBNB_ADDRESS,
    decimals: 18,
    logo: "https://tokens.pancakeswap.finance/images/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png",
  },
];

export function findToken(address: string): Token | undefined {
  return BSC_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase(),
  );
}
