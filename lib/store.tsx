"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  INITIAL_SOLD,
  PACKAGES,
  PROTOCOL,
  STAKE,
  dailyHexForNode,
  investById,
  packageById,
  programsUnlocked,
  remainingOf,
  soldTotal,
  type InvestId,
  type PackageId,
} from "@/lib/protocol";
import { makeAddress, uid } from "@/lib/format";

export type TxKind =
  | "connect"
  | "buy-node"
  | "airdrop"
  | "stake"
  | "unstake"
  | "invest"
  | "harvest"
  | "withdraw"
  | "faucet"
  | "simulate";

export type Tx = {
  id: string;
  kind: TxKind;
  label: string;
  amount: number;
  asset: "USDT" | "HEX";
  at: number;
};

export type OwnedNode = {
  id: string;
  packageId: PackageId;
  purchasedAt: number;
  lastSettledAt: number;
};

export type StakePosition = {
  id: string;
  amount: number;
  startedAt: number;
  lastSettledAt: number;
  harvested: number;
};

export type InvestPosition = {
  id: string;
  programId: InvestId;
  depositUsdt: number;
  principal: number;
  startedAt: number;
  lastSettledAt: number;
  harvested: number;
  maxout: number;
};

export type HexState = {
  hydrated: boolean;
  address: string | null;
  usdt: number;
  hex: number;
  pendingAirdrop: number;
  nodes: OwnedNode[];
  stakes: StakePosition[];
  investments: InvestPosition[];
  sold: Record<PackageId, number>;
  txs: Tx[];
  toast: string | null;
  saleStartedAt: number;
  lastClaimAt: number | null;
};

const STORAGE_KEY = "hex-protocol-v1";

function initialState(): HexState {
  return {
    hydrated: false,
    address: null,
    usdt: PROTOCOL.demoUsdt,
    hex: 0,
    pendingAirdrop: 0,
    nodes: [],
    stakes: [],
    investments: [],
    sold: { ...INITIAL_SOLD },
    txs: [],
    toast: null,
    saleStartedAt: Date.UTC(2026, 7, 18),
    lastClaimAt: null,
  };
}

function pushTx(state: HexState, tx: Omit<Tx, "id" | "at">): Tx[] {
  return [{ id: uid("tx"), at: Date.now(), ...tx }, ...state.txs].slice(0, 40);
}

function settle(state: HexState, now = Date.now()): HexState {
  let pending = state.pendingAirdrop;
  const nodes = state.nodes.map((node) => {
    const pkg = packageById(node.packageId);
    const elapsed = Math.max(0, now - node.lastSettledAt);
    pending += dailyHexForNode(pkg.priceUsdt, pkg.monthlyRate) * (elapsed / 86_400_000);
    return { ...node, lastSettledAt: now };
  });

  const stakes = state.stakes.map((stake) => {
    const elapsed = Math.max(0, now - stake.lastSettledAt);
    const earned = stake.amount * STAKE.dailyRate * (elapsed / 86_400_000);
    return {
      ...stake,
      lastSettledAt: now,
      harvested: stake.harvested + earned,
    };
  });

  const investments = state.investments.map((pos) => {
    const program = investById(pos.programId);
    const remaining = Math.max(0, pos.maxout - pos.harvested);
    if (remaining <= 0) {
      return { ...pos, lastSettledAt: now };
    }
    const elapsed = Math.max(0, now - pos.lastSettledAt);
    const earned = Math.min(
      remaining,
      pos.depositUsdt * program.dailyRate * (elapsed / 86_400_000),
    );
    return {
      ...pos,
      lastSettledAt: now,
      harvested: pos.harvested + earned,
    };
  });

  return { ...state, pendingAirdrop: pending, nodes, stakes, investments };
}

type Action =
  | { type: "hydrate"; state: HexState }
  | { type: "tick" }
  | { type: "toast"; message: string | null }
  | { type: "connect" }
  | { type: "disconnect" }
  | { type: "buy"; packageId: PackageId; qty: number }
  | { type: "claim" }
  | { type: "stake"; amount: number }
  | { type: "unstake"; id: string }
  | { type: "harvest-stake" }
  | { type: "invest"; programId: InvestId; amount: number }
  | { type: "harvest-invest"; id: string }
  | { type: "withdraw"; amount: number }
  | { type: "faucet" }
  | { type: "simulateUnlock" }
  | { type: "reset" };

function reducer(state: HexState, action: Action): HexState {
  switch (action.type) {
    case "hydrate":
      return { ...action.state, hydrated: true, toast: null };
    case "tick":
      return settle(state);
    case "toast":
      return { ...state, toast: action.message };
    case "connect": {
      if (state.address) return state;
      const address = makeAddress();
      return {
        ...state,
        address,
        txs: pushTx(state, {
          kind: "connect",
          label: "Wallet connected (sandbox)",
          amount: state.usdt,
          asset: "USDT",
        }),
        toast: "Wallet connected. 30,000 demo USDT credited.",
      };
    }
    case "disconnect":
      return { ...state, address: null, toast: "Wallet disconnected." };
    case "buy": {
      if (!state.address) return { ...state, toast: "Connect a wallet first." };
      const pkg = packageById(action.packageId);
      const qty = Math.max(1, Math.floor(action.qty));
      const left = remainingOf(action.packageId, state.sold);
      if (qty > left) return { ...state, toast: "Not enough nodes left in this tier." };
      const cost = pkg.priceUsdt * qty;
      if (state.usdt < cost) return { ...state, toast: "Insufficient USDT balance." };
      const now = Date.now();
      const settled = settle(state, now);
      const nodes = [...settled.nodes];
      for (let i = 0; i < qty; i += 1) {
        nodes.push({
          id: uid("node"),
          packageId: action.packageId,
          purchasedAt: now,
          lastSettledAt: now,
        });
      }
      const bonus = pkg.priceUsdt * pkg.bonusPct * qty;
      return {
        ...settled,
        usdt: settled.usdt - cost,
        hex: settled.hex + bonus,
        nodes,
        sold: {
          ...settled.sold,
          [action.packageId]: settled.sold[action.packageId] + qty,
        },
        txs: pushTx(settled, {
          kind: "buy-node",
          label: `Bought ${qty} ${pkg.name}${qty > 1 ? "s" : ""}`,
          amount: cost,
          asset: "USDT",
        }),
        toast: bonus
          ? `${pkg.name} online. ${bonus.toFixed(0)} HEX bonus minted.`
          : `${pkg.name} is mining. Daily airdrop started.`,
      };
    }
    case "claim": {
      const settled = settle(state);
      if (settled.pendingAirdrop <= 0) {
        return { ...settled, toast: "Nothing to claim yet. Mining is accruing." };
      }
      const amount = settled.pendingAirdrop;
      return {
        ...settled,
        hex: settled.hex + amount,
        pendingAirdrop: 0,
        lastClaimAt: Date.now(),
        txs: pushTx(settled, {
          kind: "airdrop",
          label: "Claimed daily node airdrop",
          amount,
          asset: "HEX",
        }),
        toast: `Claimed ${amount.toFixed(4)} HEX from node mining.`,
      };
    }
    case "stake": {
      const settled = settle(state);
      if (!programsUnlocked(settled.sold)) {
        return { ...settled, toast: "Staking unlocks after 60% of nodes are sold." };
      }
      if (action.amount < PROTOCOL.minStakeHex) {
        return { ...settled, toast: `Minimum stake is ${PROTOCOL.minStakeHex} HEX.` };
      }
      if (settled.hex < action.amount) {
        return { ...settled, toast: "Not enough liquid HEX." };
      }
      const now = Date.now();
      return {
        ...settled,
        hex: settled.hex - action.amount,
        stakes: [
          {
            id: uid("stk"),
            amount: action.amount,
            startedAt: now,
            lastSettledAt: now,
            harvested: 0,
          },
          ...settled.stakes,
        ],
        txs: pushTx(settled, {
          kind: "stake",
          label: "Staked HEX in the grid",
          amount: action.amount,
          asset: "HEX",
        }),
        toast: "Stake live. Daily yield is accruing.",
      };
    }
    case "unstake": {
      const settled = settle(state);
      const pos = settled.stakes.find((item) => item.id === action.id);
      if (!pos) return settled;
      return {
        ...settled,
        hex: settled.hex + pos.amount + pos.harvested,
        stakes: settled.stakes.filter((item) => item.id !== action.id),
        txs: pushTx(settled, {
          kind: "unstake",
          label: "Unstaked HEX + yield",
          amount: pos.amount + pos.harvested,
          asset: "HEX",
        }),
        toast: "Position closed. Principal and yield returned to wallet.",
      };
    }
    case "harvest-stake": {
      const settled = settle(state);
      const yieldAmt = settled.stakes.reduce((sum, item) => sum + item.harvested, 0);
      if (yieldAmt <= 0) return { ...settled, toast: "No staking yield to harvest." };
      return {
        ...settled,
        hex: settled.hex + yieldAmt,
        stakes: settled.stakes.map((item) => ({ ...item, harvested: 0, lastSettledAt: Date.now() })),
        txs: pushTx(settled, {
          kind: "harvest",
          label: "Harvested staking yield",
          amount: yieldAmt,
          asset: "HEX",
        }),
        toast: `Harvested ${yieldAmt.toFixed(4)} HEX.`,
      };
    }
    case "invest": {
      const settled = settle(state);
      if (!programsUnlocked(settled.sold)) {
        return { ...settled, toast: "Investment opens after 60% of nodes are sold." };
      }
      const program = investById(action.programId);
      if (action.amount < PROTOCOL.minInvestUsdt) {
        return { ...settled, toast: `Minimum is ${PROTOCOL.minInvestUsdt} USDT.` };
      }
      if (settled.usdt < action.amount) {
        return { ...settled, toast: "Insufficient USDT balance." };
      }
      const now = Date.now();
      const principal = action.amount * program.splitPrincipal;
      return {
        ...settled,
        usdt: settled.usdt - action.amount,
        investments: [
          {
            id: uid("inv"),
            programId: action.programId,
            depositUsdt: action.amount,
            principal,
            startedAt: now,
            lastSettledAt: now,
            harvested: 0,
            maxout: action.amount * program.maxoutMultiple,
          },
          ...settled.investments,
        ],
        txs: pushTx(settled, {
          kind: "invest",
          label: `Opened ${program.name}`,
          amount: action.amount,
          asset: "USDT",
        }),
        toast: `${program.name} is live. Daily yield accruing to maxout.`,
      };
    }
    case "harvest-invest": {
      const settled = settle(state);
      const pos = settled.investments.find((item) => item.id === action.id);
      if (!pos || pos.harvested <= 0) {
        return { ...settled, toast: "No vault yield ready on this position." };
      }
      return {
        ...settled,
        hex: settled.hex + pos.harvested,
        investments: settled.investments.map((item) =>
          item.id === action.id ? { ...item, harvested: 0, lastSettledAt: Date.now() } : item,
        ),
        txs: pushTx(settled, {
          kind: "harvest",
          label: `Harvested ${investById(pos.programId).name}`,
          amount: pos.harvested,
          asset: "HEX",
        }),
        toast: `Harvested ${pos.harvested.toFixed(4)} HEX into wallet.`,
      };
    }
    case "withdraw": {
      const settled = settle(state);
      if (action.amount <= 0 || settled.hex < action.amount) {
        return { ...settled, toast: "Not enough HEX to swap." };
      }
      const fee = action.amount * PROTOCOL.withdrawFee;
      const usdtOut = (action.amount - fee) * PROTOCOL.hexUsd;
      return {
        ...settled,
        hex: settled.hex - action.amount,
        usdt: settled.usdt + usdtOut,
        txs: pushTx(settled, {
          kind: "withdraw",
          label: "Swapped HEX → USDT (5% burn fee)",
          amount: usdtOut,
          asset: "USDT",
        }),
        toast: `Received ${usdtOut.toFixed(2)} USDT. ${fee.toFixed(4)} HEX burned.`,
      };
    }
    case "faucet": {
      if (!state.address) return state;
      return {
        ...state,
        usdt: state.usdt + 5_000,
        txs: pushTx(state, {
          kind: "faucet",
          label: "Sandbox USDT top-up",
          amount: 5_000,
          asset: "USDT",
        }),
        toast: "5,000 demo USDT added.",
      };
    }
    case "simulateUnlock": {
      const settled = settle(state);
      const need = Math.max(0, Math.ceil(PROTOCOL.totalNodes * PROTOCOL.unlockRatio) - soldTotal(settled.sold));
      if (need <= 0) return { ...settled, toast: "Programs are already unlocked." };
      let remaining = need;
      const sold = { ...settled.sold };
      for (const pkg of PACKAGES) {
        const left = remainingOf(pkg.id, sold);
        const take = Math.min(left, remaining);
        sold[pkg.id] += take;
        remaining -= take;
        if (remaining <= 0) break;
      }
      return {
        ...settled,
        sold,
        txs: pushTx(settled, {
          kind: "simulate",
          label: "Sandbox: node sale advanced to 60%",
          amount: need,
          asset: "HEX",
        }),
        toast: "60% threshold reached. Staking and investment are live.",
      };
    }
    case "reset":
      return { ...initialState(), hydrated: true, toast: "Sandbox reset." };
    default:
      return state;
  }
}

type HexContextValue = HexState & {
  connect: () => void;
  disconnect: () => void;
  buyNode: (packageId: PackageId, qty?: number) => void;
  claimAirdrop: () => void;
  stakeHex: (amount: number) => void;
  unstake: (id: string) => void;
  harvestStake: () => void;
  openInvest: (programId: InvestId, amount: number) => void;
  harvestInvest: (id: string) => void;
  withdrawHex: (amount: number) => void;
  faucet: () => void;
  simulateUnlock: () => void;
  reset: () => void;
  clearToast: () => void;
};

const HexContext = createContext<HexContextValue | null>(null);

export function HexProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const persist = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HexState;
        dispatch({
          type: "hydrate",
          state: {
            ...initialState(),
            ...parsed,
            hydrated: true,
            toast: null,
          },
        });
      } else {
        dispatch({ type: "hydrate", state: { ...initialState(), hydrated: true } });
      }
    } catch {
      dispatch({ type: "hydrate", state: { ...initialState(), hydrated: true } });
    }
    persist.current = true;
  }, []);

  useEffect(() => {
    if (!persist.current || !state.hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, toast: null }));
  }, [state]);

  useEffect(() => {
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!state.toast) return;
    const timer = window.setTimeout(() => dispatch({ type: "toast", message: null }), 4200);
    return () => window.clearTimeout(timer);
  }, [state.toast]);

  const value = useMemo<HexContextValue>(
    () => ({
      ...state,
      connect: () => dispatch({ type: "connect" }),
      disconnect: () => dispatch({ type: "disconnect" }),
      buyNode: (packageId, qty = 1) => dispatch({ type: "buy", packageId, qty }),
      claimAirdrop: () => dispatch({ type: "claim" }),
      stakeHex: (amount) => dispatch({ type: "stake", amount }),
      unstake: (id) => dispatch({ type: "unstake", id }),
      harvestStake: () => dispatch({ type: "harvest-stake" }),
      openInvest: (programId, amount) => dispatch({ type: "invest", programId, amount }),
      harvestInvest: (id) => dispatch({ type: "harvest-invest", id }),
      withdrawHex: (amount) => dispatch({ type: "withdraw", amount }),
      faucet: () => dispatch({ type: "faucet" }),
      simulateUnlock: () => dispatch({ type: "simulateUnlock" }),
      reset: () => dispatch({ type: "reset" }),
      clearToast: () => dispatch({ type: "toast", message: null }),
    }),
    [state],
  );

  return <HexContext.Provider value={value}>{children}</HexContext.Provider>;
}

export function useHex() {
  const ctx = useContext(HexContext);
  if (!ctx) throw new Error("useHex must be used inside HexProvider");
  return ctx;
}
