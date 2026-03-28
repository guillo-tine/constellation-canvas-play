import { ScoreResult } from "@/types/level";
import { motion } from "framer-motion";

interface ScoreBreakdownProps {
  result: ScoreResult;
  time: string;
}

const statItem = (label: string, value: string | number, color?: string) => (
  <div className="flex flex-col items-center gap-1">
    <span className={`text-2xl font-semibold tabular-nums ${color ?? "text-foreground"}`}>
      {value}
    </span>
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
  </div>
);

export default function ScoreBreakdown({ result, time }: ScoreBreakdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel p-8 max-w-md mx-auto"
    >
      {/* Big score */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <span className="text-7xl font-serif font-bold text-primary tabular-nums">
            {result.score}
          </span>
          <p className="text-muted-foreground text-sm mt-1">out of 100</p>
        </motion.div>
      </div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-6 mb-6"
      >
        {statItem("Correct", result.correct, "text-edge-correct")}
        {statItem("Missed", result.missed, "text-edge-missed")}
        {statItem("False", result.falseEdges, "text-edge-wrong")}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="grid grid-cols-3 gap-6 pt-4 border-t border-border"
      >
        {statItem("Precision", `${Math.round(result.precision * 100)}%`)}
        {statItem("Recall", `${Math.round(result.recall * 100)}%`)}
        {statItem("Time", time)}
      </motion.div>
    </motion.div>
  );
}
