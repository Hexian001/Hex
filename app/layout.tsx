import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hivera.net"),
  title: {
    default: "Hivera",
    template: "%s · Hivera",
  },
  description:
    "The World's AI, Powered by the Hive. One consumer AI front end and a decentralized compute network.",
  applicationName: "Hivera",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${instrument.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
