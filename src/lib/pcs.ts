export const PCS_SWAP_API = "https://swap.pancakeswap.com";
export const BSC_CHAIN_ID = 56;

export type QuoteCandidate = {
  chainId: number;
  quoteId: string;
  expiresAt: number;
  inputAmount: string;
  outputAmount: string;
  recipient?: string;
  slippageTolerance: number;
  gasUseEstimate?: string;
  gasUseEstimateUsd?: string;
  priceImpactBps?: number;
  agg?: {
    srcToken: string;
    dstToken: string;
    chainId: number;
    tradeType: string;
    inputAmount: string;
    outputAmount: string;
    gasUseEstimate: string;
    aggregatorAddress: string;
    routes: Array<{
      percent: number;
      path: Array<{ address: string; decimals: number; symbol: string }>;
      pools: Array<{ type: string; fee?: number; address: string }>;
    }>;
  };
  calldata?: {
    value: string;
    calldata: string;
    to: `0x${string}`;
  };
};

export type QuoteResponse = {
  candidates: QuoteCandidate[];
  best: QuoteCandidate;
  error?: { message?: string; statusCode?: string };
};

export type CalldataResponse = {
  value: string;
  calldata: `0x${string}`;
  to: `0x${string}`;
};

export type QuoteParams = {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  slippageTolerance: number;
  recipient?: string;
  includeCalldata?: boolean;
};

export async function fetchPcsQuote(
  params: QuoteParams,
): Promise<QuoteResponse> {
  const search = new URLSearchParams({
    chainId: String(BSC_CHAIN_ID),
    tokenIn: params.tokenIn,
    tokenOut: params.tokenOut,
    amount: params.amount,
    slippageTolerance: String(params.slippageTolerance),
    sources: "agg",
    tradeType: "exactIn",
  });

  if (params.recipient) search.set("recipient", params.recipient);
  if (params.includeCalldata) search.set("includeCalldata", "true");

  const res = await fetch(`/api/pcs/quote?${search.toString()}`);
  const data = (await res.json()) as QuoteResponse & { message?: string };
  if (!res.ok) {
    throw new Error(data.message || data.error?.message || "Quote failed");
  }
  if (!data.best?.agg) {
    throw new Error(data.error?.message || "No aggregator route found");
  }
  return data;
}

export async function fetchPcsCalldata(
  best: QuoteCandidate,
  recipient: string,
  slippageTolerance: number,
): Promise<CalldataResponse> {
  const res = await fetch("/api/pcs/calldata", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...best,
      recipient,
      slippageTolerance,
    }),
  });
  const data = (await res.json()) as CalldataResponse & {
    message?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || data.error || "Calldata failed");
  }
  return data;
}

export function routeLabel(best: QuoteCandidate | null): string {
  const route = best?.agg?.routes?.[0];
  if (!route?.path?.length) return "PancakeSwap";
  return route.path.map((p) => p.symbol).join(" → ");
}
