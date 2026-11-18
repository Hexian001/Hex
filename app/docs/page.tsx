import type { Metadata } from "next";
import Link from "next/link";
import { LICENSES, buyerGets, formatUsdt } from "@/lib/licenses";
import { MODELS } from "@/lib/models";
import { FREE_PLAN, PRO_PLAN } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Plain-language notes on Hivera chat plans and worker-node licenses.",
};

const TOC = [
  { href: "#what-hivera-is", label: "What Hivera is" },
  { href: "#chat-plans", label: "Chat plans" },
  { href: "#local-demo", label: "Local demo replies" },
  { href: "#node-licenses", label: "Node licenses" },
  { href: "#wallet", label: "Wallet connect" },
  { href: "#this-site", label: "This website" },
];

export default function DocsPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-16">
      <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-[0.68rem] tracking-[0.16em] text-faint">ON THIS PAGE</p>
        <ol className="mt-3 space-y-2 text-sm">
          {TOC.map((item) => (
            <li key={item.href}>
              <a className="text-muted hover:text-brass" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <article className="max-w-3xl">
        <p className="font-mono text-xs tracking-[0.18em] text-amber">DOCS</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-ink md:text-6xl">
          Chat plans and node licenses
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Plain language for the two Hivera products: the consumer chat, and the virtual compute an operator can license.
        </p>

        <section id="what-hivera-is" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink">What Hivera is</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Hivera is one consumer AI front end plus a decentralized compute network. The chat is where a person picks a model family and sends a prompt. The nodes are virtual workers an operator licenses so that capacity can be scheduled for inference. Both live at hivera.net.
          </p>
        </section>

        <section id="chat-plans" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink">Chat plans</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The workspace holds four families: {MODELS.map((model) => model.label).join(", ")}. You pick one per message. The thread stays in the browser until you clear it or leave the page.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PlanCard
              name={FREE_PLAN.name}
              price={FREE_PLAN.priceLabel}
              allowance={FREE_PLAN.allowance}
              body={FREE_PLAN.summary}
            />
            <PlanCard
              name={PRO_PLAN.name}
              price={PRO_PLAN.priceLabel}
              allowance={PRO_PLAN.allowance}
              body={PRO_PLAN.summary}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-faint">
            The Pro button on the chat page opens this description. It does not start a subscription.
          </p>
        </section>

        <section id="local-demo" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink">Local demo replies</h2>
          <p className="mt-3 leading-relaxed text-muted">
            If the server has no API key for the family you selected, the reply is written by this website. The first line says it is a local demo, and the message is labeled “Local demo · not [that model].” It is not Claude, ChatGPT, Llama, or DeepSeek answering. When a key is configured for a family, that family’s replies are requested from the provider and labeled “Provider reply.” A failed provider call shows an error instead of a stand-in answer.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            <li>Claude uses <code className="text-brass">ANTHROPIC_API_KEY</code>.</li>
            <li>ChatGPT uses <code className="text-brass">OPENAI_API_KEY</code>.</li>
            <li>Llama uses <code className="text-brass">GROQ_API_KEY</code>.</li>
            <li>DeepSeek uses <code className="text-brass">DEEPSEEK_API_KEY</code>.</li>
          </ul>
        </section>

        <section id="node-licenses" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink">Node licenses</h2>
          <p className="mt-3 leading-relaxed text-muted">
            A worker-node license is a purchase of virtual capacity at a fixed USDT price. The buyer is licensing workers, concurrent inference slots, and a monthly scheduling quota. The site states that price and that capacity.
          </p>
          <div className="mt-6 space-y-4">
            {LICENSES.map((license) => (
              <section key={license.id} className="border border-line bg-panel/70 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-2xl text-ink">{license.name}</h3>
                  <p className="font-mono tabular-nums text-brass">{formatUsdt(license.priceUsdt)}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{buyerGets(license)}</p>
              </section>
            ))}
          </div>
        </section>

        <section id="wallet" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink">Wallet connect</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The Connect wallet control on the nodes page is a preview. A finished connect would open a wallet the buyer already uses, confirm the address, and ask for approval of a USDT transfer at the selected license price. The license would then be recorded against that address. The control on this site does not open an extension, sign a message, or broadcast a transaction. The preview address it can show is a layout sample, not an account.
          </p>
        </section>

        <section id="this-site" className="mt-12 scroll-mt-24">
          <h2 className="font-serif text-3xl text-ink">This website</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The public site has four routes. <Link className="text-brass underline underline-offset-4" href="/">Overview</Link> introduces both products. <Link className="text-brass underline underline-offset-4" href="/chat">Chat</Link> is the workspace. <Link className="text-brass underline underline-offset-4" href="/nodes">Nodes</Link> is the operator portal. This page is the written explanation. Handles are shown as text: @HiveraNet and t.me/HiveraNet.
          </p>
        </section>
      </article>
    </div>
  );
}

function PlanCard({
  name,
  price,
  allowance,
  body,
}: {
  name: string;
  price: string;
  allowance: string;
  body: string;
}) {
  return (
    <section className="border border-line bg-panel/70 p-5">
      <h3 className="font-serif text-2xl text-ink">{name}</h3>
      <p className="mt-1 font-mono text-sm text-brass">{price}</p>
      <p className="mt-3 text-sm text-ink">{allowance}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </section>
  );
}
