import { useLocation, useNavigate } from "react-router-dom";
import { ScoreResult, StarNode, Edge } from "@/types/level";
import ScoreBreakdown from "@/components/game/ScoreBreakdown";
import BoardOverlay from "@/components/game/BoardOverlay";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Home, RotateCcw, ArrowRight } from "lucide-react";
import { normalizeEdge, edgeKey } from "@/lib/edge-utils";

interface ResultsState {
  result: ScoreResult;
  time: string;
  levelId: string;
  levelTitle: string;
  playerEdges: Edge[];
  answerEdges: [string, string][];
  stars: StarNode[];
  boardWidth: number;
  boardHeight: number;
  boardImage: string;
}

export default function Results() {
  const { state } = useLocation() as { state: ResultsState | null };
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-sm">
          <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No results to show.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-1.5" /> Back Home
          </Button>
        </div>
      </div>
    );
  }

  const {
    result,
    time,
    levelId,
    levelTitle,
    playerEdges,
    answerEdges,
    stars,
    boardWidth,
    boardHeight,
    boardImage,
  } = state;

  // Classify edges for reveal
  const answerSet = new Set(
    answerEdges.map(([a, b]) => edgeKey(normalizeEdge(a, b)))
  );
  const playerSet = new Set(playerEdges.map((e) => edgeKey(e)));

  const correctEdges = playerEdges.filter((e) => answerSet.has(edgeKey(e)));
  const wrongEdges = playerEdges.filter((e) => !answerSet.has(edgeKey(e)));
  const missedEdges = answerEdges.filter(
    ([a, b]) => !playerSet.has(edgeKey(normalizeEdge(a, b)))
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-serif text-lg">Results — {levelTitle}</span>
        </div>
      </header>

      <main className="flex-1 px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <ScoreBreakdown result={result} time={time} />

          {/* Board reveal */}
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
            <div
              className="board-frame relative max-w-lg mx-auto"
              style={{ aspectRatio: `${boardWidth} / ${boardHeight}` }}
            >
              <img
                src={boardImage}
                alt="Answer board"
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <BoardOverlay
                width={boardWidth}
                height={boardHeight}
                stars={stars}
                edges={[]}
                onEdgeAdd={() => {}}
                onEdgeRemove={() => {}}
                disabled
                revealEdges={{
                  correct: correctEdges,
                  wrong: wrongEdges,
                  missed: missedEdges,
                }}
              />
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              variant="outline"
              onClick={() => navigate(`/play?level=${levelId}`)}
              className="rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" /> Play Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/play?level=orion-1")}
              className="rounded-xl"
            >
              <ArrowRight className="w-4 h-4 mr-1.5" /> New Puzzle
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Home className="w-4 h-4 mr-1.5" /> Back Home
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
