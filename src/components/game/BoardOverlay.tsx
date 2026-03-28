import { StarNode, Edge } from "@/types/level";
import { hasEdge } from "@/lib/edge-utils";
import { useState } from "react";

interface BoardOverlayProps {
  width: number;
  height: number;
  stars: StarNode[];
  edges: Edge[];
  onEdgeAdd: (from: string, to: string) => void;
  onEdgeRemove: (from: string, to: string) => void;
  disabled?: boolean;
  revealEdges?: {
    correct: Edge[];
    wrong: Edge[];
    missed: [string, string][];
  } | null;
}

export default function BoardOverlay({
  width,
  height,
  stars,
  edges,
  onEdgeAdd,
  onEdgeRemove,
  disabled,
  revealEdges,
}: BoardOverlayProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const starMap = new Map(stars.map((s) => [s.id, s]));

  function handleStarClick(id: string) {
    if (disabled) return;
    if (!selected) {
      setSelected(id);
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    if (hasEdge(edges, selected, id)) {
      onEdgeRemove(selected, id);
    } else {
      onEdgeAdd(selected, id);
    }
    setSelected(null);
  }

  function renderEdge(e: Edge, color: string, key: string, dashed = false) {
    const a = starMap.get(e.from);
    const b = starMap.get(e.to);
    if (!a || !b) return null;
    return (
      <line
        key={key}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={dashed ? "6 4" : undefined}
        className="transition-all duration-200"
        style={{ opacity: 0.85 }}
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      {/* Player edges */}
      {!revealEdges &&
        edges.map((e, i) =>
          renderEdge(e, "hsl(215 65% 65%)", `edge-${i}`)
        )}

      {/* Reveal: correct */}
      {revealEdges?.correct.map((e, i) =>
        renderEdge(e, "hsl(145 60% 50%)", `correct-${i}`)
      )}
      {/* Reveal: wrong */}
      {revealEdges?.wrong.map((e, i) =>
        renderEdge(e, "hsl(0 72% 58%)", `wrong-${i}`, true)
      )}
      {/* Reveal: missed */}
      {revealEdges?.missed.map(([a, b], i) => {
        const sa = starMap.get(a);
        const sb = starMap.get(b);
        if (!sa || !sb) return null;
        return (
          <line
            key={`missed-${i}`}
            x1={sa.x}
            y1={sa.y}
            x2={sb.x}
            y2={sb.y}
            stroke="hsl(45 80% 55%)"
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.7}
          />
        );
      })}

      {/* Selection line preview */}
      {selected && hovered && selected !== hovered && (
        <line
          x1={starMap.get(selected)!.x}
          y1={starMap.get(selected)!.y}
          x2={starMap.get(hovered)!.x}
          y2={starMap.get(hovered)!.y}
          stroke="hsl(215 65% 65%)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.5}
        />
      )}

      {/* Stars */}
      {stars.map((star) => {
        const isSelected = selected === star.id;
        const isHov = hovered === star.id;
        return (
          <g key={star.id}>
            {/* Glow */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.r + 6}
              fill={isSelected ? "hsl(45 90% 65%)" : "transparent"}
              opacity={isSelected ? 0.3 : 0}
              className="transition-all duration-200"
            />
            {/* Main dot */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill={isSelected ? "hsl(45 95% 75%)" : isHov ? "hsl(45 90% 70%)" : "hsl(45 90% 65%)"}
              stroke="hsl(0 0% 100%)"
              strokeWidth={1.5}
              className="cursor-pointer transition-all duration-150"
              onClick={() => handleStarClick(star.id)}
              onMouseEnter={() => setHovered(star.id)}
              onMouseLeave={() => setHovered(null)}
            />
            {/* Label */}
            {star.name && (
              <text
                x={star.x}
                y={star.y - star.r - 6}
                textAnchor="middle"
                fill="hsl(0 0% 85%)"
                fontSize={10}
                fontFamily="DM Sans, sans-serif"
                opacity={isHov || isSelected ? 1 : 0.5}
                className="transition-opacity duration-200 pointer-events-none select-none"
              >
                {star.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
