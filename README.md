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

The operator portal lists three virtual compute licenses at 1,000, 2,000, and 4,000 USDT. Connect wallet is a preview: it describes the USDT transfer a live wallet would request and does not broadcast a transaction. The page states the price and the capacity the buyer is licensing.
