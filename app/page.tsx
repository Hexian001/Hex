import type { Metadata } from "next";
import Link from "next/link";
import { HiveDiagram } from "@/components/hive-diagram";

export const metadata: Metadata = {
  title: {
    absolute: "Hivera — The World's AI, Powered by the Hive.",
  },
  description:
    "Hivera is one consumer AI front end and a decentralized compute network. Chat with four model families, or license virtual worker capacity.",
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-12 px-5 py-14 md:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.9fr)] lg:py-16">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-amber">
            ONE FRONT END · ONE COMPUTE NETWORK
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[clamp(3.4rem,7vw,6.5rem)] leading-[0.9] text-ink">
            The World&apos;s AI,{" "}
            <span className="italic text-brass">Powered by the Hive.</span>
          </h1>
          <p className="prose-measure mt-6 text-lg leading-relaxed text-muted">
            Hivera is a consumer workspace for frontier models and the decentralized compute network underneath it. People ask in one place. Operators license the virtual capacity that can serve those queries.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/chat">
              Open chat
            </Link>
            <Link className="btn btn-ghost" href="/nodes">
              Operator portal
            </Link>
          </div>
        </div>
        <HiveDiagram />
      </section>

      <section className="border-t border-line" aria-label="Products">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <article className="border-b border-line px-5 py-12 md:px-8 lg:border-b-0 lg:border-r">
            <p className="index-num font-serif text-6xl">01</p>
            <p className="mt-4 font-mono text-xs tracking-[0.16em] text-amber">CHAT</p>
            <h2 className="mt-3 max-w-[16ch] font-serif text-4xl leading-tight text-ink md:text-5xl">
              Every Frontier AI Model. One Single Intelligence.
            </h2>
            <p className="prose-measure mt-4 leading-relaxed text-muted">
              Claude, ChatGPT, Llama, and DeepSeek share one workspace. Query on the free plan, or read what Hivera Pro includes at $20 a month.
            </p>
            <Link className="btn btn-ghost mt-6" href="/chat">
              Enter the workspace
            </Link>
          </article>
          <article className="px-5 py-12 md:px-8">
            <p className="index-num font-serif text-6xl">02</p>
            <p className="mt-4 font-mono text-xs tracking-[0.16em] text-amber">NODES</p>
            <h2 className="mt-3 max-w-[16ch] font-serif text-4xl leading-tight text-ink md:text-5xl">
              Power the Global AI Hive.
            </h2>
            <p className="prose-measure mt-4 leading-relaxed text-muted">
              Three virtual compute licenses, priced at 1,000, 2,000, and 4,000 USDT. Each one states the worker capacity you are buying.
            </p>
            <Link className="btn btn-ghost mt-6" href="/nodes">
              View licenses
            </Link>
          </article>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3 md:px-8">
          <Fact index="I" title="One front end" body="A single workspace for Claude, ChatGPT, Llama, and DeepSeek." />
          <Fact index="II" title="One network" body="Virtual workers licensed in USDT and offered as inference capacity." />
          <Fact index="III" title="One domain" body="hivera.net is the front door for both products." />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <p className="max-w-[18ch] font-serif text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05] text-ink">
            Hivera.net — The Global Decentralized Compute Network
          </p>
          <div className="mt-8 space-y-1 font-mono text-base text-brass">
            <p>@HiveraNet</p>
            <p>t.me/HiveraNet</p>
          </div>
          <Link className="btn btn-ghost mt-8" href="/docs">
            Read the product docs
          </Link>
        </div>
      </section>
    </>
  );
}

function Fact({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-xs text-amber">{index}</p>
      <h2 className="mt-2 font-serif text-2xl text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
