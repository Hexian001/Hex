import type { Metadata } from "next";
import { ChatWorkspace } from "@/components/chat-workspace";
import { ProPlanButton, StartQueryButton } from "@/components/pro-plan";
import { FREE_PLAN, PRO_PLAN } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Every Frontier AI Model. One Single Intelligence. Claude, ChatGPT, Llama, and DeepSeek in one Hivera workspace.",
};

export default function ChatPage() {
  return (
    <div className="min-w-0 lg:grid lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)]">
      <section className="px-5 py-12 md:px-8 lg:py-16 lg:pr-10">
        <p className="font-mono text-xs tracking-[0.18em] text-amber">CONSUMER AI</p>
        <h1 className="mt-4 max-w-[14ch] font-serif text-[clamp(2.8rem,5vw,4.6rem)] leading-[0.95] text-ink">
          Every Frontier AI Model. One Single Intelligence.
        </h1>
        <p className="prose-measure mt-5 text-lg leading-relaxed text-muted">
          Access Claude, ChatGPT, Llama, and DeepSeek in one workspace, powered by an open compute swarm.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <StartQueryButton />
          <ProPlanButton />
        </div>
        <dl className="mt-10 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs text-faint">{FREE_PLAN.name}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">
              {FREE_PLAN.priceLabel}. {FREE_PLAN.allowance}. {FREE_PLAN.summary}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-faint">{PRO_PLAN.name}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted">
              {PRO_PLAN.priceLabel}. {PRO_PLAN.allowance}. Priority scheduling when the network is busy.
            </dd>
          </div>
        </dl>
      </section>
      <ChatWorkspace />
    </div>
  );
}
