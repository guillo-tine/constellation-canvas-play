import { Edge, ScoreResult } from "@/types/level";
import { edgeKey, normalizeEdge } from "./edge-utils";

export function scorePlayerEdges(
  playerEdges: Edge[],
  answerPairs: [string, string][]
): ScoreResult {
  const answerSet = new Set(
    answerPairs.map(([a, b]) => edgeKey(normalizeEdge(a, b)))
  );
  const playerSet = new Set(playerEdges.map((e) => edgeKey(e)));

  let correct = 0;
  let falseEdges = 0;

  playerSet.forEach((k) => {
    if (answerSet.has(k)) correct++;
    else falseEdges++;
  });

  const missed = answerSet.size - correct;
  const precision = playerSet.size === 0 ? 0 : correct / playerSet.size;
  const recall = answerSet.size === 0 ? 0 : correct / answerSet.size;
  const score = Math.round(
    (precision * 0.4 + recall * 0.6) * 100
  );

  return { correct, missed, falseEdges, precision, recall, score };
}
