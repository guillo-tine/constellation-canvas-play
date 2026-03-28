import { LevelData, LevelsIndexEntry } from "@/types/level";

export async function loadLevelsIndex(): Promise<LevelsIndexEntry[]> {
  const res = await fetch("/data/levels-index.json");
  if (!res.ok) throw new Error("Failed to load levels index");
  return res.json();
}

export async function loadLevelById(id: string): Promise<LevelData> {
  const res = await fetch(`/data/levels/${id}.json`);
  if (!res.ok) throw new Error(`Failed to load level: ${id}`);
  return res.json();
}
