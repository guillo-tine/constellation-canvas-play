import { Edge } from "@/types/level";

export function normalizeEdge(from: string, to: string): Edge {
  return from < to ? { from, to } : { from: to, to: from };
}

export function edgeEquals(a: Edge, b: Edge): boolean {
  const na = normalizeEdge(a.from, a.to);
  const nb = normalizeEdge(b.from, b.to);
  return na.from === nb.from && na.to === nb.to;
}

export function edgeKey(e: Edge): string {
  const n = normalizeEdge(e.from, e.to);
  return `${n.from}--${n.to}`;
}

export function dedupeEdges(edges: Edge[]): Edge[] {
  const seen = new Set<string>();
  return edges.filter((e) => {
    const k = edgeKey(e);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function hasEdge(edges: Edge[], from: string, to: string): boolean {
  const target = normalizeEdge(from, to);
  return edges.some((e) => {
    const n = normalizeEdge(e.from, e.to);
    return n.from === target.from && n.to === target.to;
  });
}
