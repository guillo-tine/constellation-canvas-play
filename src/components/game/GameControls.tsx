import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Send, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface GameControlsProps {
  timer: string;
  difficulty: string;
  edgeCount: number;
  clue: string;
  onReset: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function GameControls({
  timer,
  difficulty,
  edgeCount,
  clue,
  onReset,
  onSubmit,
  disabled,
}: GameControlsProps) {
  const [showClue, setShowClue] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <Clock className="w-4 h-4" />
          <span className="tabular-nums font-display tracking-wider">{timer}</span>
        </div>
        <span className="text-xs font-display uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
          {difficulty}
        </span>
        <span className="text-sm text-muted-foreground">
          {edgeCount} edge{edgeCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={disabled}
          className="flex-1 border-border hover:bg-secondary hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowClue((v) => !v)}
          className="flex-1 border-border hover:bg-secondary hover:text-foreground"
        >
          <Lightbulb className="w-4 h-4 mr-1.5" />
          Clue
        </Button>
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={disabled}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80 font-display tracking-wider"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Submit
        </Button>
      </div>

      <AnimatePresence>
        {showClue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-4 text-sm text-muted-foreground leading-relaxed">
              🔮 {clue}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
