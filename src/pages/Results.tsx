import { useLocation, useNavigate } from "react-router-dom";
import { ResultsState } from "@/types/level";
import { classifyEdges } from "@/lib/scoring";
import PageShell from "@/components/layout/PageShell";
import StatusMessage from "@/components/layout/StatusMessage";
import ScoreBreakdown from "@/components/game/ScoreBreakdown";
import GameBoard from "@/components/game/GameBoard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, RotateCcw, ArrowRight } from "lucide-react";
import { useMemo } from "react";

export default function Results() {
  const { state } = useLocation() as { state: ResultsState | null };
  const navigate = useNavigate();

  const classification = useMemo(
    () => state ? classifyEdges(state.playerEdges, state.answerEdges) : null,
    [state]
  );

  if (!state || !classification) {
    return <StatusMessage variant="empty" message="No results to show." />;
  }

  const {
    result, time, levelId, levelTitle,
    stars, boardWidth, boardHeight, boardImage,
  } = state;

  return (
    <PageShell title={`Results — ${levelTitle}`}>
      <div className="max-w-3xl mx-auto space-y-10">
        <ScoreBreakdown result={result} time={time} />

        {/* Answer reveal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="font-serif text-xl text-center mb-4">Answer Reveal</h2>

          <div className="flex justify-center gap-4 text-xs text-muted-foreground mb-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-edge-correct inline-block rounded" /> Correct
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-edge-wrong inline-block rounded" /> False
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-edge-missed inline-block rounded" /> Missed
            </span>
          </div>

          <GameBoard
            image={boardImage}
            alt={`${levelTitle} — answer reveal`}
            width={boardWidth}
            height={boardHeight}
            stars={stars}
            edges={[]}
            disabled
            revealEdges={classification}
            className="max-w-lg mx-auto"
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button variant="outline" onClick={() => navigate(`/play?level=${levelId}`)} className="rounded-xl">
            <RotateCcw className="w-4 h-4 mr-1.5" /> Play Again
          </Button>
          <Button variant="outline" onClick={() => navigate("/")} className="rounded-xl">
            <ArrowRight className="w-4 h-4 mr-1.5" /> New Puzzle
          </Button>
          <Button onClick={() => navigate("/")} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            <Home className="w-4 h-4 mr-1.5" /> Back Home
          </Button>
        </motion.div>
      </div>
    </PageShell>
  );
}
