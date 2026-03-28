import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadLevelsIndex } from "@/lib/level-loader";
import { LevelsIndexEntry } from "@/types/level";
import PageShell from "@/components/layout/PageShell";
import StatusMessage from "@/components/layout/StatusMessage";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Target, Orbit } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<LevelsIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadLevelsIndex()
      .then(setLevels)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StatusMessage variant="loading" message="Scanning the cosmos…" />;
  if (error || levels.length === 0) {
    return <StatusMessage variant="error" message="Lost in the void. Could not load puzzles." />;
  }

  const firstLevel = levels[0];

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto text-center pt-20 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Orbit className="w-12 h-12 mx-auto text-primary mb-4 animate-pulse-soft" />
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl sm:text-6xl leading-tight mb-5 glow-text tracking-wider"
        >
          TRACE THE
          <br />
          <span className="bg-gradient-to-r from-primary via-glow-pink to-glow-blue bg-clip-text text-transparent">
            COSMOS
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md mx-auto"
        >
          Connect the stars to reveal hidden constellations. A cosmic puzzle of
          precision, memory, and celestial pattern recognition.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Button
            size="lg"
            onClick={() => navigate(`/play?level=${firstLevel.id}`)}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-10 rounded-xl text-base h-13 font-display tracking-wider animate-glow-pulse"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            LAUNCH GAME
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(`/play?level=${firstLevel.id}`)}
            className="rounded-xl text-base h-13 px-10 border-primary/30 text-primary hover:bg-primary/10 font-display tracking-wider"
          >
            DAILY MISSION
          </Button>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="glass-panel p-8 text-left"
        >
          <h3 className="font-display text-sm tracking-widest uppercase mb-6 flex items-center gap-3 text-primary">
            <Target className="w-4 h-4" />
            Mission Briefing
          </h3>
          <div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium text-foreground text-base">Draw edges</p>
              <p>Click two stars to connect them. Click an existing edge to remove it.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground text-base">Precision & recall</p>
              <p>Score rewards both finding correct edges and avoiding false ones.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground text-base">Review answers</p>
              <p>After submitting, see which edges were correct, wrong, or missed.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
