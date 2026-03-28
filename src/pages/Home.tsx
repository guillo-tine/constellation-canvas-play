import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Sparkles, Target } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <span className="font-serif text-lg">Constellation Forensics</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="max-w-xl text-center">
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl sm:text-6xl leading-tight mb-4"
          >
            Trace the stars.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md mx-auto"
          >
            Connect the dots to reveal hidden constellations. A daily puzzle of precision, memory, and pattern recognition.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <Button
              size="lg"
              onClick={() => navigate("/play?level=orion-1")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 rounded-xl text-base h-12"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Game
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/play?level=orion-1")}
              className="rounded-xl text-base h-12 px-8"
            >
              Daily Puzzle
            </Button>
          </motion.div>

          {/* Scoring explanation */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-panel p-6 text-left"
          >
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              How scoring works
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Draw edges</p>
                <p>Click two stars to connect them. Click an existing edge to remove it.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Precision & recall</p>
                <p>Score rewards both finding correct edges and avoiding false ones.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Review answers</p>
                <p>After submitting, see which edges were correct, wrong, or missed.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
