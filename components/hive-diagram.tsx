function hexPoints(cx: number, cy: number, radius: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

const CENTER = { x: 508, y: 214 };
const RADIUS = 36;
const RING = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
] as const;

export function HiveDiagram() {
  const dx = RADIUS * Math.sqrt(3);
  const dy = RADIUS * 1.5;

  return (
    <figure className="ticks border border-line bg-panel/90 p-4">
      <svg viewBox="0 0 680 430" role="img" aria-labelledby="hive-title hive-desc" className="h-auto w-full">
        <title id="hive-title">Chat connected to a cluster of virtual workers</title>
        <desc id="hive-desc">
          A single chat workspace feeds one hive, drawn as a center cell with six surrounding worker cells.
        </desc>
        <rect x="28" y="78" width="214" height="272" fill="#10120d" stroke="#34382d" />
        <text x="48" y="114" fill="#e0a045" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="2">
          CHAT
        </text>
        <text x="48" y="148" fill="#f4f0e6" fontFamily="Georgia, serif" fontSize="26">
          One workspace
        </text>
        {["Claude", "ChatGPT", "Llama", "DeepSeek"].map((name, index) => (
          <g key={name}>
            <rect x="48" y={176 + index * 36} width="8" height="8" fill="#e0a045" />
            <text
              x="66"
              y={184 + index * 36}
              fill="#c8c2b6"
              fontFamily="ui-monospace, monospace"
              fontSize="14"
            >
              {name}
            </text>
          </g>
        ))}
        <path d="M242 214 H430" fill="none" stroke="#e0a045" strokeWidth="1.4" />
        <polygon points="424,208 438,214 424,220" fill="#e0a045" />
        {RING.map(([q, r]) => {
          const x = CENTER.x + dx * (q + r / 2);
          const y = CENTER.y + dy * r;
          return (
            <polygon
              key={`${q}:${r}`}
              points={hexPoints(x, y, RADIUS - 1)}
              fill="#23281c"
              stroke="#e0a045"
              strokeWidth="1.4"
            />
          );
        })}
        <polygon points={hexPoints(CENTER.x, CENTER.y, RADIUS)} fill="#e0a045" />
        <text
          x={CENTER.x}
          y={CENTER.y + 4}
          textAnchor="middle"
          fill="#1a1408"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          letterSpacing="1.5"
        >
          HIVE
        </text>
        <text x="392" y="392" fill="#9c968a" fontFamily="ui-monospace, monospace" fontSize="12">
          Virtual workers
        </text>
      </svg>
      <figcaption className="px-2 pb-2 font-mono text-xs leading-relaxed text-faint">
        Queries enter through one workspace. Licensed capacity sits on the worker cells.
      </figcaption>
    </figure>
  );
}
