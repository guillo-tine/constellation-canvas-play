import { StarNode, Edge, EdgeClassification } from "@/types/level";
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
  revealEdges?: EdgeClassification | null;
}

/** SVG colors pulled from design tokens (inlined for SVG compatibility). */
const COLORS = {
  edge: "hsl(215 65% 65%)",
  correct: "hsl(145 60% 50%)",
  wrong: "hsl(0 72% 58%)",
  missed: "hsl(45 80% 55%)",
  star: "hsl(45 90% 65%)",
  starHover: "hsl(45 90% 70%)",
  starSelected: "hsl(45 95% 75%)",
  starStroke: "hsl(0 0% 100%)",
  label: "hsl(0 0% 85%)",
} as const;

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

  function renderLine(
    fromId: string,
    toId: string,
    color: string,
    key: string,
    opts?: { dashed?: boolean; width?: number; opacity?: number }
  ) {
    const a = starMap.get(fromId);
    const b = starMap.get(toId);
    if (!a || !b) return null;
    return (
      <line
        key={key}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={color}
        strokeWidth={opts?.width ?? 2.5}
        strokeLinecap="round"
        strokeDasharray={opts?.dashed ? "6 4" : undefined}
        className="transition-all duration-200"
        opacity={opts?.opacity ?? 0.85}
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      {/* Player edges (play mode) */}
      {!revealEdges &&
        edges.map((e, i) => renderLine(e.from, e.to, COLORS.edge, `edge-${i}`))}

      {/* Reveal edges (results mode) */}
      {revealEdges?.correct.map((e, i) =>
        renderLine(e.from, e.to, COLORS.correct, `correct-${i}`)
      )}
      {revealEdges?.wrong.map((e, i) =>
        renderLine(e.from, e.to, COLORS.wrong, `wrong-${i}`, { dashed: true })
      )}
      {revealEdges?.missed.map(([a, b], i) =>
        renderLine(a, b, COLORS.missed, `missed-${i}`, { dashed: true, width: 2, opacity: 0.7 })
      )}

      {/* Selection preview line */}
      {selected && hovered && selected !== hovered && (() => {
        const a = starMap.get(selected);
        const b = starMap.get(hovered);
        if (!a || !b) return null;
        return (
          <line
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={COLORS.edge}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.5}
          />
        );
      })()}

      {/* Stars */}
      {stars.map((star) => {
        const isSelected = selected === star.id;
        const isHov = hovered === star.id;
        const fill = isSelected ? COLORS.starSelected : isHov ? COLORS.starHover : COLORS.star;

        return (
          <g key={star.id}>
            <circle
              cx={star.x} cy={star.y} r={star.r + 6}
              fill={COLORS.star}
              opacity={isSelected ? 0.3 : 0}
              className="transition-all duration-200"
            />
            <circle
              cx={star.x} cy={star.y} r={star.r}
              fill={fill}
              stroke={COLORS.starStroke}
              strokeWidth={1.5}
              className="cursor-pointer transition-all duration-150"
              onClick={() => handleStarClick(star.id)}
              onMouseEnter={() => setHovered(star.id)}
              onMouseLeave={() => setHovered(null)}
            />
            {star.name && (
              <text
                x={star.x} y={star.y - star.r - 6}
                textAnchor="middle"
                fill={COLORS.label}
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
