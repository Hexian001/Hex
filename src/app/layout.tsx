import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "HexSwap — PancakeSwap powered DEX",
  description:
    "Swap tokens on BNB Chain with HexSwap. Quotes and routing via the PancakeSwap Unified Swap API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${syne.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
