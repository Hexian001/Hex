import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { HexProvider } from "@/lib/store";
import { Toast } from "@/components/Toast";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEX — Nodes, Airdrop, Gold Vault",
  description:
    "Hexian Protocol: buy utility nodes, mine a daily HEX airdrop, then unlock staking and gold investment after 60% of genesis nodes are sold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${syne.variable} antialiased`}>
        <HexProvider>
          {children}
          <Toast />
        </HexProvider>
      </body>
    </html>
  );
}
