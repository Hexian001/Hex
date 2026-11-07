"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { bsc } from "wagmi/chains";
import { maxUint256 } from "viem";
import { erc20Abi } from "@/lib/abi/erc20";
import {
  bpsToPercent,
  formatTokenAmount,
  parseTokenAmount,
} from "@/lib/format";
import {
  fetchPcsCalldata,
  fetchPcsQuote,
  routeLabel,
  type QuoteCandidate,
} from "@/lib/pcs";
import { BSC_TOKENS, NATIVE_ADDRESS, type Token } from "@/lib/tokens";
import { TokenSelectModal } from "./TokenSelectModal";

type SelectSide = "from" | "to" | null;

export function SwapCard() {
  const { address, isConnected, chainId } = useAccount();
  const [fromToken, setFromToken] = useState<Token>(BSC_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(BSC_TOKENS[2]);
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [selectSide, setSelectSide] = useState<SelectSide>(null);
  const [quote, setQuote] = useState<QuoteCandidate | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const amountInWei = useMemo(() => {
    try {
      return parseTokenAmount(amountIn, fromToken.decimals);
    } catch {
      return BigInt(0);
    }
  }, [amountIn, fromToken.decimals]);

  const { data: nativeBalance } = useBalance({
    address,
    chainId: bsc.id,
    query: { enabled: Boolean(address) && fromToken.isNative },
  });

  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: fromToken.isNative ? undefined : fromToken.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: bsc.id,
    query: { enabled: Boolean(address) && !fromToken.isNative },
  });

  const spender = (quote?.calldata?.to ||
    quote?.agg?.aggregatorAddress) as `0x${string}` | undefined;

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: fromToken.isNative ? undefined : fromToken.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && spender ? [address, spender] : undefined,
    chainId: bsc.id,
    query: {
      enabled: Boolean(address && spender && !fromToken.isNative && amountInWei > BigInt(0)),
    },
  });

  const {
    writeContractAsync,
    data: approveHash,
    isPending: approving,
    reset: resetApprove,
  } = useWriteContract();
  const { isLoading: waitingApprove, isSuccess: approveDone } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const {
    sendTransactionAsync,
    data: swapHash,
    isPending: swapping,
    reset: resetSwap,
  } = useSendTransaction();
  const { isLoading: waitingSwap, isSuccess: swapDone } =
    useWaitForTransactionReceipt({ hash: swapHash });

  const balance = fromToken.isNative
    ? nativeBalance?.value
    : (tokenBalance as bigint | undefined);

  const needsApproval =
    !fromToken.isNative &&
    amountInWei > BigInt(0) &&
    spender &&
    (allowance === undefined || (allowance as bigint) < amountInWei);

  const loadQuote = useCallback(async () => {
    if (amountInWei <= BigInt(0) || fromToken.address === toToken.address) {
      setQuote(null);
      setQuoteError(null);
      return;
    }

    setQuoting(true);
    setQuoteError(null);
    try {
      const data = await fetchPcsQuote({
        tokenIn: fromToken.address,
        tokenOut: toToken.address,
        amount: amountInWei.toString(),
        slippageTolerance: slippage / 100,
        recipient: address,
        includeCalldata: Boolean(address),
      });
      setQuote(data.best);
    } catch (err) {
      setQuote(null);
      setQuoteError(err instanceof Error ? err.message : "Quote failed");
    } finally {
      setQuoting(false);
    }
  }, [amountInWei, fromToken.address, toToken.address, slippage, address]);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadQuote();
    }, 400);
    return () => clearTimeout(t);
  }, [loadQuote]);

  useEffect(() => {
    if (approveDone) {
      setStatus("Approved. Confirm the swap.");
      void refetchAllowance();
    }
  }, [approveDone, refetchAllowance]);

  useEffect(() => {
    if (swapDone) {
      setStatus("Swap confirmed on BNB Chain.");
      setAmountIn("");
      setQuote(null);
      void refetchTokenBalance();
      void refetchAllowance();
    }
  }, [swapDone, refetchTokenBalance, refetchAllowance]);

  function flipTokens() {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmountIn(
      quote
        ? formatTokenAmount(quote.outputAmount, toToken.decimals)
        : "",
    );
    setQuote(null);
  }

  async function onApprove() {
    if (!spender || fromToken.isNative) return;
    setTxError(null);
    setStatus(null);
    resetApprove();
    try {
      await writeContractAsync({
        address: fromToken.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, maxUint256],
        chainId: bsc.id,
      });
    } catch (err) {
      setTxError(err instanceof Error ? err.message : "Approve failed");
    }
  }

  async function onSwap() {
    if (!address || !quote?.agg) return;
    setTxError(null);
    setStatus(null);
    resetSwap();

    try {
      let tx = quote.calldata;
      if (!tx) {
        tx = await fetchPcsCalldata(quote, address, slippage / 100);
      }

      await sendTransactionAsync({
        to: tx.to,
        data: tx.calldata as `0x${string}`,
        value: BigInt(tx.value || "0x0"),
        chainId: bsc.id,
      });
      setStatus("Swap submitted…");
    } catch (err) {
      setTxError(err instanceof Error ? err.message : "Swap failed");
    }
  }

  const amountOut = quote
    ? formatTokenAmount(quote.outputAmount, toToken.decimals)
    : "";

  const rate =
    quote && amountInWei > BigInt(0)
      ? (
          Number(formatTokenAmount(quote.outputAmount, toToken.decimals, 8)) /
          Number(amountIn || "1")
        ).toPrecision(6)
      : null;

  const busy = quoting || approving || waitingApprove || swapping || waitingSwap;
  const wrongNetwork = isConnected && chainId !== bsc.id;

  let ctaLabel = "Connect Wallet";
  if (isConnected) {
    if (wrongNetwork) ctaLabel = "Switch to BNB Chain";
    else if (!amountIn || amountInWei <= BigInt(0)) ctaLabel = "Enter an amount";
    else if (quoting) ctaLabel = "Fetching quote…";
    else if (quoteError) ctaLabel = "Quote unavailable";
    else if (needsApproval) ctaLabel = approving || waitingApprove ? "Approving…" : `Approve ${fromToken.symbol}`;
    else if (swapping || waitingSwap) ctaLabel = "Swapping…";
    else ctaLabel = "Swap";
  }

  const ctaDisabled =
    busy ||
    (isConnected &&
      (wrongNetwork ||
        !amountIn ||
        amountInWei <= BigInt(0) ||
        Boolean(quoteError) ||
        (!needsApproval && !quote?.agg)));

  async function onCta() {
    if (!isConnected) return;
    if (needsApproval) {
      await onApprove();
      return;
    }
    await onSwap();
  }

  return (
    <>
      <section className="swap-card">
        <div className="swap-card-head">
          <div>
            <h1>Swap</h1>
            <p>Trade tokens on BNB Chain via PancakeSwap liquidity</p>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Settings"
            onClick={() => setShowSettings((v) => !v)}
          >
            ⚙
          </button>
        </div>

        {showSettings && (
          <div className="settings-panel">
            <label>
              Slippage tolerance
              <div className="slip-row">
                {[0.1, 0.5, 1].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={slippage === v ? "chip active" : "chip"}
                    onClick={() => setSlippage(v)}
                  >
                    {v}%
                  </button>
                ))}
                <input
                  type="number"
                  min={0.01}
                  max={49}
                  step={0.1}
                  value={slippage}
                  onChange={(e) => setSlippage(Number(e.target.value) || 0.5)}
                  className="slip-input"
                />
                <span>%</span>
              </div>
            </label>
          </div>
        )}

        <div className="token-panel">
          <div className="panel-meta">
            <span>From</span>
            {balance !== undefined && (
              <button
                type="button"
                className="max-btn"
                onClick={() =>
                  setAmountIn(formatTokenAmount(balance, fromToken.decimals))
                }
              >
                Balance: {formatTokenAmount(balance, fromToken.decimals, 4)}
              </button>
            )}
          </div>
          <div className="panel-row">
            <input
              className="amount-input"
              inputMode="decimal"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, "");
                if ((v.match(/\./g) || []).length > 1) return;
                setAmountIn(v);
              }}
            />
            <button
              type="button"
              className="token-btn"
              onClick={() => setSelectSide("from")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fromToken.logo} alt="" width={28} height={28} />
              {fromToken.symbol}
              <span aria-hidden>▾</span>
            </button>
          </div>
        </div>

        <button type="button" className="flip-btn" onClick={flipTokens} aria-label="Flip tokens">
          ↕
        </button>

        <div className="token-panel">
          <div className="panel-meta">
            <span>To</span>
            {quoting && <span className="muted">Quoting…</span>}
          </div>
          <div className="panel-row">
            <input
              className="amount-input"
              readOnly
              placeholder="0.0"
              value={amountOut}
            />
            <button
              type="button"
              className="token-btn"
              onClick={() => setSelectSide("to")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={toToken.logo} alt="" width={28} height={28} />
              {toToken.symbol}
              <span aria-hidden>▾</span>
            </button>
          </div>
        </div>

        {quote && (
          <div className="quote-details">
            {rate && (
              <div>
                <span>Rate</span>
                <strong>
                  1 {fromToken.symbol} ≈ {rate} {toToken.symbol}
                </strong>
              </div>
            )}
            <div>
              <span>Price impact</span>
              <strong>{bpsToPercent(quote.priceImpactBps)}</strong>
            </div>
            <div>
              <span>Route</span>
              <strong>{routeLabel(quote)}</strong>
            </div>
            <div>
              <span>Min received</span>
              <strong>
                {formatTokenAmount(
                  (BigInt(quote.outputAmount) *
                    BigInt(Math.round((100 - slippage) * 100))) /
                    BigInt(10000),
                  toToken.decimals,
                )}{" "}
                {toToken.symbol}
              </strong>
            </div>
            <div>
              <span>Source</span>
              <strong>PancakeSwap Aggregator</strong>
            </div>
          </div>
        )}

        {quoteError && <p className="alert error">{quoteError}</p>}
        {txError && <p className="alert error">{txError}</p>}
        {status && <p className="alert ok">{status}</p>}
        {swapHash && (
          <a
            className="tx-link"
            href={`https://bscscan.com/tx/${swapHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on BscScan →
          </a>
        )}

        {isConnected ? (
          <button
            type="button"
            className="btn primary swap-cta"
            disabled={ctaDisabled}
            onClick={() => void onCta()}
          >
            {ctaLabel}
          </button>
        ) : (
          <p className="connect-hint">Connect a wallet above to swap on BNB Chain.</p>
        )}
      </section>

      <TokenSelectModal
        open={selectSide !== null}
        exclude={selectSide === "from" ? toToken : fromToken}
        onClose={() => setSelectSide(null)}
        onSelect={(token) => {
          if (selectSide === "from") setFromToken(token);
          if (selectSide === "to") setToToken(token);
        }}
      />
    </>
  );
}
