import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadLevelById } from "@/lib/level-loader";
import { normalizeEdge, hasEdge, dedupeEdges } from "@/lib/edge-utils";
import { scorePlayerEdges } from "@/lib/scoring";
import { useTimer } from "@/hooks/useTimer";
import { LevelData, Edge } from "@/types/level";
import BoardOverlay from "@/components/game/BoardOverlay";
import GameControls from "@/components/game/GameControls";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Play() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const levelId = params.get("level") ?? "orion-1";

  const [level, setLevel] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const timer = useTimer();

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadLevelById(levelId)
      .then((data) => {
        setLevel(data);
        setEdges([]);
        timer.reset();
        timer.start();
      })
      .catch(() => setError("Could not load puzzle."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const addEdge = useCallback(
    (from: string, to: string) => {
      setEdges((prev) => {
        if (hasEdge(prev, from, to)) return prev;
        return dedupeEdges([...prev, normalizeEdge(from, to)]);
      });
    },
    []
  );

  const removeEdge = useCallback((from: string, to: string) => {
    const n = normalizeEdge(from, to);
    setEdges((prev) =>
      prev.filter((e) => !(e.from === n.from && e.to === n.to))
    );
  }, []);

  const handleReset = useCallback(() => {
    setEdges([]);
    timer.reset();
    timer.start();
  }, [timer]);

  const handleSubmit = useCallback(() => {
    if (!level) return;
    timer.stop();
    const result = scorePlayerEdges(edges, level.answerEdges);
    navigate("/results", {
      state: {
        result,
        time: timer.formatted,
        levelId: level.id,
        levelTitle: level.title,
        playerEdges: edges,
        answerEdges: level.answerEdges,
        stars: level.stars,
        boardWidth: level.width,
        boardHeight: level.height,
        boardImage: level.image,
      },
    });
  }, [level, edges, timer, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Star className="w-8 h-8 text-primary animate-pulse-soft mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading puzzle…</p>
        </div>
      </div>
    );
  }

  if (error || !level) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-sm">
          <p className="text-destructive font-medium mb-4">{error ?? "Puzzle not found"}</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          <h1 className="font-serif text-lg">{level.title}</h1>
          <span className="text-xs text-muted-foreground">{level.constellation}</span>
        </div>
      </header>

      <main className="flex-1 px-6 pb-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_280px] gap-6 items-start">
          {/* Board */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="board-frame relative"
            style={{ aspectRatio: `${level.width} / ${level.height}` }}
          >
            <img
              src={level.image}
              alt={level.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <BoardOverlay
              width={level.width}
              height={level.height}
              stars={level.stars}
              edges={edges}
              onEdgeAdd={addEdge}
              onEdgeRemove={removeEdge}
            />
          </motion.div>

          {/* Controls panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="glass-panel p-5"
          >
            <GameControls
              timer={timer.formatted}
              difficulty={level.difficulty}
              edgeCount={edges.length}
              clue={level.clue}
              onReset={handleReset}
              onSubmit={handleSubmit}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
