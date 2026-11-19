"use client";

import type { CSSProperties } from "react";

const CELLS = Array.from({ length: 48 }, (_, i) => i);
const POLLEN = [
  { left: "12%", top: "28%", dx: "40vw", dy: "-18vh", delay: "0s", size: 4 },
  { left: "28%", top: "62%", dx: "32vw", dy: "-28vh", delay: "1.4s", size: 3 },
  { left: "48%", top: "22%", dx: "26vw", dy: "16vh", delay: "2.2s", size: 5 },
  { left: "64%", top: "55%", dx: "-18vw", dy: "-22vh", delay: "0.8s", size: 3 },
  { left: "78%", top: "34%", dx: "-30vw", dy: "12vh", delay: "3.1s", size: 4 },
  { left: "18%", top: "78%", dx: "22vw", dy: "-40vh", delay: "1.9s", size: 3 },
];

export function HexField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-hive-radial" />
      <div className="absolute -right-[10%] top-[-8%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(232,160,26,0.16),transparent_68%)] blur-2xl" />
      <div className="absolute left-[-12%] bottom-[-10%] h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(158,207,154,0.08),transparent_70%)] blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hex-grid"
            width="56"
            height="98"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.15)"
          >
            <path
              d="M28 2 L52 16 L52 44 L28 58 L4 44 L4 16 Z"
              fill="none"
              stroke="rgba(246,217,138,0.16)"
              strokeWidth="1"
            />
            <path
              d="M28 51 L52 65 L52 93 L28 107 L4 93 L4 65 Z"
              fill="none"
              stroke="rgba(246,217,138,0.1)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="signal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8a01a" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffc44d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9ecf9a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
        <path
          className="animate-draw-line"
          d="M80 420 C220 360, 280 280, 420 240 S680 160, 920 210"
          fill="none"
          stroke="url(#signal)"
          strokeWidth="1.5"
          strokeDasharray="120"
          strokeLinecap="round"
        />
        <path
          className="animate-draw-line"
          style={{ animationDelay: "0.35s" }}
          d="M120 180 C260 220, 340 300, 480 340 S760 420, 980 360"
          fill="none"
          stroke="url(#signal)"
          strokeWidth="1.2"
          strokeDasharray="120"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-3 p-[8%] opacity-40">
        {CELLS.map((i) => (
          <span
            key={i}
            className="hex-clip h-10 w-9 bg-amber/20 animate-pulse-cell sm:h-12 sm:w-11"
            style={{
              animationDelay: `${(i % 9) * 0.35}s`,
              opacity: i % 5 === 0 ? 0.55 : 0.2,
            }}
          />
        ))}
      </div>

      {POLLEN.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-honey shadow-[0_0_12px_rgba(255,196,77,0.55)] animate-drift-pollen"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              "--dx": p.dx,
              "--dy": p.dy,
            } as CSSProperties
          }
        />
      ))}

      <div className="absolute inset-0 bg-hive-veil" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
