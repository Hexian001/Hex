"use client";

import { useState } from "react";
import { Dialog } from "@/components/dialog";
import { PRO_PLAN } from "@/lib/plans";

export function ProPlanButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={() => setOpen(true)}>
        Hivera Pro · $20/mo
      </button>
      <Dialog open={open} title="Hivera Pro" onClose={() => setOpen(false)}>
        <p className="font-mono text-sm text-amber">{PRO_PLAN.priceSentence}</p>
        <p className="prose-measure mt-4 text-base leading-relaxed text-muted">{PRO_PLAN.summary}</p>
        <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs text-faint">Allowance</dt>
            <dd className="mt-1 text-ink">{PRO_PLAN.allowance}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-faint">Models</dt>
            <dd className="mt-1 text-ink">Claude, ChatGPT, Llama, DeepSeek</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-faint">
          Closing this panel leaves you on the free workspace. Nothing is billed.
        </p>
      </Dialog>
    </>
  );
}

export function StartQueryButton() {
  return (
    <a
      className="btn btn-primary"
      href="#composer"
      onClick={(event) => {
        const field = document.getElementById("composer");
        if (!(field instanceof HTMLTextAreaElement)) return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        field.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
        field.focus();
      }}
    >
      Start Querying Free
    </a>
  );
}
