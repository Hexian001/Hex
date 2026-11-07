"use client";

import { http, createConfig } from "wagmi";
import { bsc } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
  },
  ssr: true,
});
