"use client";

import { useHex } from "@/lib/store";

export function Toast() {
  const { toast, clearToast } = useHex();
  if (!toast) return null;
  return (
    <button
      type="button"
      onClick={clearToast}
      className="toast-in fixed bottom-20 left-1/2 z-[80] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-gold/30 bg-panel px-4 py-3 text-left text-sm text-ink shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:bottom-6"
    >
      {toast}
    </button>
  );
}
