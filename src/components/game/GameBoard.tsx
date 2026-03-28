import { StarNode, Edge, EdgeClassification } from "@/types/level";
import BoardOverlay from "@/components/game/BoardOverlay";

interface GameBoardProps {
  image: string;
  alt: string;
  width: number;
  height: number;
  stars: StarNode[];
  edges: Edge[];
  onEdgeAdd?: (from: string, to: string) => void;
  onEdgeRemove?: (from: string, to: string) => void;
  disabled?: boolean;
  revealEdges?: EdgeClassification | null;
  className?: string;
}

const noop = () => {};

/** Wraps the board image + SVG overlay in a framed container. */
export default function GameBoard({
  image,
  alt,
  width,
  height,
  stars,
  edges,
  onEdgeAdd = noop,
  onEdgeRemove = noop,
  disabled,
  revealEdges,
  className = "",
}: GameBoardProps) {
  return (
    <div
      className={`board-frame relative ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <BoardOverlay
        width={width}
        height={height}
        stars={stars}
        edges={edges}
        onEdgeAdd={onEdgeAdd}
        onEdgeRemove={onEdgeRemove}
        disabled={disabled}
        revealEdges={revealEdges}
      />
    </div>
  );
}
