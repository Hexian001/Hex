# Hivera

Public website for Hivera, a consumer AI workspace and a decentralized compute network. Master domain: [hivera.net](https://hivera.net).

Tagline: The World's AI, Powered by the Hive.

## Run

Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Route | Page |
| --- | --- |
| `/` | Hub: both products, tagline, handles |
| `/chat` | Consumer workspace |
| `/nodes` | Virtual compute licenses |
| `/docs` | Chat plans and node licenses |

Other scripts:

```bash
npm run lint
npm run build
npm run start
```

## Chat keys

With no keys, Chat still accepts a prompt and returns a **local demo** reply. That reply says it was written by this site. It is not presented as Claude, ChatGPT, Llama, or DeepSeek.

Set any of these in `.env.local` and restart the dev server to call that provider instead:

| Family | Variable | Optional model override |
| --- | --- | --- |
| Claude | `ANTHROPIC_API_KEY` | `ANTHROPIC_MODEL` |
| ChatGPT | `OPENAI_API_KEY` | `OPENAI_MODEL` |
| Llama | `GROQ_API_KEY` | `GROQ_LLAMA_MODEL` |
| DeepSeek | `DEEPSEEK_API_KEY` | `DEEPSEEK_MODEL` |

If a key is set and the provider call fails, the workspace shows the error. It does not substitute a demo reply.

## Nodes

The operator portal lists three virtual compute licenses at 1,000, 2,000, and 4,000 USDT. Connect wallet uses an injected browser wallet (wagmi + viem) on BNB Smart Chain. Purchase broadcast is not enabled yet; the desk still states the USDT transfer a live buy would request.

## Wallet and genesis admin

Copy `.env.example` to `.env.local` if you want to override the public genesis address:

```bash
NEXT_PUBLIC_GENESIS_ADDRESS=0x95093FA66De3af568c662f91A844267F2c9Ceff7
```

When the connected address equals that value (case-insensitive), the header shows an **Admin** link to `/admin`. Only the public address is committed; the genesis private key is never stored in git.
