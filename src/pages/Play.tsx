import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadLevelById } from "@/lib/level-loader";
import { normalizeEdge, hasEdge, dedupeEdges } from "@/lib/edge-utils";
import { scorePlayerEdges } from "@/lib/scoring";
import { useTimer } from "@/hooks/useTimer";
import { LevelData, Edge } from "@/types/level";
import PageShell from "@/components/layout/PageShell";
import StatusMessage from "@/components/layout/StatusMessage";
import GameBoard from "@/components/game/GameBoard";
import GameControls from "@/components/game/GameControls";
import { motion } from "framer-motion";

export default function Play() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const levelId = params.get("level") ?? "";

  const [level, setLevel] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const timer = useTimer();

  useEffect(() => {
    if (!levelId) {
      setError("No puzzle selected.");
      setLoading(false);
      return;
    }
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

  const addEdge = useCallback((from: string, to: string) => {
    setEdges((prev) => {
      if (hasEdge(prev, from, to)) return prev;
      return dedupeEdges([...prev, normalizeEdge(from, to)]);
    });
  }, []);

  const removeEdge = useCallback((from: string, to: string) => {
    const n = normalizeEdge(from, to);
    setEdges((prev) => prev.filter((e) => !(e.from === n.from && e.to === n.to)));
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

  if (loading) return <StatusMessage variant="loading" message="Loading puzzle…" />;
  if (error || !level) return <StatusMessage variant="error" message={error ?? "Puzzle not found."} />;

  return (
    <PageShell
      title={level.title}
      headerRight={<span className="text-xs uppercase tracking-wider">{level.constellation}</span>}
    >
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <GameBoard
            image={level.image}
            alt={level.title}
            width={level.width}
            height={level.height}
            stars={level.stars}
            edges={edges}
            onEdgeAdd={addEdge}
            onEdgeRemove={removeEdge}
          />
        </motion.div>

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
    </PageShell>
  );
}
