/**
 * Very small, fast similarity checker based on token shingles + Jaccard.
 * Good enough for MVP plagiarism flags.
 */

function normalizePython(src: string): string {
  // strip inline comments and trailing spaces, keep code lines
  return src
    .split(/\r?\n/)
    .map(l => l.replace(/#.*$/g, "").trim())
    .filter(Boolean)
    .join("\n");
}

function tokenize(src: string): string[] {
  // crude tokenizer: identifiers, numbers, and symbols
  const tokens = src
    .toLowerCase()
    .replace(/\s+/g, " ")
    .match(/[a-z_][a-z0-9_]*|\d+|[^\s]/g);
  return tokens ?? [];
}

function shingles(tokens: string[], k = 5): string[] {
  const out: string[] = [];
  for (let i = 0; i + k <= tokens.length; i++) {
    out.push(tokens.slice(i, i + k).join(" "));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>) {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export type SimilarityPair = {
  aId: number;
  bId: number;
  aStudent: string;
  bStudent: string;
  score: number;
  overlap: number;
  aLen: number;
  bLen: number;
};

export function similarityScore(codeA: string, codeB: string): { score: number; overlap: number; aLen: number; bLen: number } {
  const na = normalizePython(codeA);
  const nb = normalizePython(codeB);
  const ta = tokenize(na);
  const tb = tokenize(nb);
  const sa = new Set(shingles(ta, 5));
  const sb = new Set(shingles(tb, 5));
  const score = jaccard(sa, sb);
  // approximate overlap as intersection size
  let overlap = 0;
  for (const s of sa) if (sb.has(s)) overlap++;
  return { score, overlap, aLen: sa.size, bLen: sb.size };
}
