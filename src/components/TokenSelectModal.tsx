"use client";

import { useMemo, useState } from "react";
import { BSC_TOKENS, type Token } from "@/lib/tokens";

type Props = {
  open: boolean;
  exclude?: Token;
  onClose: () => void;
  onSelect: (token: Token) => void;
};

export function TokenSelectModal({ open, exclude, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const tokens = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BSC_TOKENS.filter((t) => {
      if (exclude && t.address.toLowerCase() === exclude.address.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return (
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
      );
    });
  }, [exclude, query]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Select a token"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>Select a token</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <input
          className="search-input"
          placeholder="Search name or paste address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="token-list">
          {tokens.map((token) => (
            <li key={token.address}>
              <button
                type="button"
                className="token-row"
                onClick={() => {
                  onSelect(token);
                  onClose();
                  setQuery("");
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={token.logo} alt="" width={36} height={36} />
                <span>
                  <strong>{token.symbol}</strong>
                  <small>{token.name}</small>
                </span>
              </button>
            </li>
          ))}
          {tokens.length === 0 && <li className="empty">No tokens found</li>}
        </ul>
      </div>
    </div>
  );
}
