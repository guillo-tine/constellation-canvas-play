export interface StarNode {
  id: string;
  x: number;
  y: number;
  r: number;
  name?: string;
  mag?: number;
}

export interface Edge {
  from: string;
  to: string;
}

export interface LevelData {
  id: string;
  title: string;
  constellation: string;
  image: string;
  width: number;
  height: number;
  clue: string;
  difficulty: string;
  stars: StarNode[];
  answerEdges: [string, string][];
}

export interface LevelsIndexEntry {
  id: string;
  title: string;
  constellation: string;
  difficulty: string;
  starCount: number;
}

export interface ScoreResult {
  correct: number;
  missed: number;
  falseEdges: number;
  precision: number;
  recall: number;
  score: number;
}
