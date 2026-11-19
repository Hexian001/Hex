"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "hivera"; text: string };

const SEED: Msg[] = [
  {
    role: "user",
    text: "Summarize why wallet-pay AI beats card billing for crypto-native teams.",
  },
  {
    role: "hivera",
    text: "Stablecoin settlement skips chargebacks and geographic card friction. Credits meter compute cleanly across engines, so spend maps to usage — not a monthly surprise. One hive, many workers, one balance.",
  },
];

const REPLIES = [
  "Routing through the economy comb… Here’s a tighter take: treat credits as nectar units — each prompt drains what it costs, nothing more.",
  "Swarm pick: depth engine. Your ask benefits from longer context. Estimated burn: 3 credits.",
  "Hive note: Free tier stays on lighter workers. Pro unlocks the full comb when you need denser reasoning.",
];

export function Playground() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);

    window.setTimeout(() => {
      const reply = REPLIES[replyIndex % REPLIES.length];
      setReplyIndex((i) => i + 1);
      setMessages((m) => [...m, { role: "hivera", text: reply }]);
      setBusy(false);
    }, 900);
  }

  return (
    <section
      id="playground"
      className="relative border-t border-[var(--line)] bg-ink-elevated/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber">
              Live comb · draft
            </p>
            <h2 className="mt-3 font-display text-3xl font-700 tracking-tight text-honey sm:text-4xl">
              Talk to the hive before you fund it.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
              This playground is a UI draft — responses are simulated. Production
              Hivera will route real prompts through your credit balance and the
              model swarm.
            </p>
            <dl className="mt-8 grid gap-4 font-mono text-xs uppercase tracking-[0.16em] text-mist">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <dt>Session credits</dt>
                <dd className="text-nectar">demo · uncapped</dd>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <dt>Active worker</dt>
                <dd className="text-amber-bright">swarm · auto</dd>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <dt>Settlement</dt>
                <dd className="text-honey">USDT · soon</dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-sm border border-[var(--line)] bg-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="hex-clip h-5 w-4 bg-amber" />
                <span className="font-display text-sm font-semibold text-honey">
                  Hivera chat
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-nectar">
                ● hive online
              </span>
            </div>

            <div className="flex h-[360px] flex-col gap-4 overflow-y-auto px-4 py-5 sm:h-[400px]">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={`max-w-[92%] animate-fade-up text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "ml-auto rounded-sm bg-wax px-3.5 py-2.5 text-honey"
                      : "mr-auto border border-[var(--line)] bg-ink-soft px-3.5 py-2.5 text-mist"
                  }`}
                >
                  {msg.role === "hivera" ? (
                    <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
                      Hivera
                    </span>
                  ) : null}
                  {msg.text}
                </div>
              ))}
              {busy ? (
                <div className="mr-auto border border-[var(--line)] bg-ink-soft px-3.5 py-2.5 font-mono text-xs text-amber">
                  Pollinating
                  <span className="animate-blink">_</span>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={onSubmit}
              className="flex items-end gap-2 border-t border-[var(--line)] p-3"
            >
              <label className="sr-only" htmlFor="hivera-prompt">
                Prompt
              </label>
              <textarea
                id="hivera-prompt"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the hive…"
                className="min-h-[52px] flex-1 resize-none rounded-sm border border-[var(--line)] bg-ink-elevated px-3 py-2.5 text-sm text-honey outline-none placeholder:text-mist/50 focus:border-amber/50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-sm bg-amber px-4 py-3 font-display text-sm font-bold text-ink transition enabled:hover:bg-amber-bright disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
