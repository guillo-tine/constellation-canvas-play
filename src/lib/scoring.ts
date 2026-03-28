import { Edge, ScoreResult, EdgeClassification } from "@/types/level";
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
  const score = Math.round((precision * 0.4 + recall * 0.6) * 100);

  return { correct, missed, falseEdges, precision, recall, score };
}

/** Classify player edges against answer edges for reveal overlay. */
export function classifyEdges(
  playerEdges: Edge[],
  answerPairs: [string, string][]
): EdgeClassification {
  const answerSet = new Set(
    answerPairs.map(([a, b]) => edgeKey(normalizeEdge(a, b)))
  );
  const playerSet = new Set(playerEdges.map((e) => edgeKey(e)));

  return {
    correct: playerEdges.filter((e) => answerSet.has(edgeKey(e))),
    wrong: playerEdges.filter((e) => !answerSet.has(edgeKey(e))),
    missed: answerPairs.filter(
      ([a, b]) => !playerSet.has(edgeKey(normalizeEdge(a, b)))
    ),
  };
}
