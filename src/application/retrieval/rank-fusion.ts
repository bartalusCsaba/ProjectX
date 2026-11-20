// szemantikus: a, b, c
// kulcsszavas: c, d

// KEY       Semantic             Keyword          Value
// A,        1/61 = 0,0164        0                0,0164
// B,        1/62 = 0,0161        0                0,0161
// C,        1/63 = 0,0158        1/61 = 0,0164    0,0322
// D         0                    1/62 = 0,0161    0,0161

// Megoldás C, A, B, D
// észrevétel, hogy B és D ugyanaz melyik lesz mégis a győztes?
// Megoldás jó. Használhatunk súlyozott RRF-t de túl kicsi az adat, hogy eldönthessük statisztikailag melyik keresés a jobb
// vagy egyszerű az ABC sorrendje.

export interface RankedList<T> {
  readonly name: string;
  readonly items: readonly T[];
}

interface RankedValue<T> {
  readonly item: T;
  readonly sources: string[];
  score: number;
}

export interface RankedFusionResult<T> {
  readonly sources: readonly string[];
  readonly score: number;
  readonly item: T;
}

export const RRF_K = 60;
const calculateRRValue = (indexOfItem: number, k: number): number => 1/(k+indexOfItem+1)

export function rankFusion<T>(lists: readonly RankedList<T>[], keyOf: (item: T) => string, limit: number, k: number = RRF_K): RankedFusionResult<T>[] {
  const rankedMap = new Map<string, RankedValue<T>>()
  for(const list of lists) {
    list.items.forEach((item, index) => {
      record(rankedMap, keyOf(item), { score: calculateRRValue(index, k), sources: [list.name], item: item})
    });
  }

  const entries: [string, RankedValue<T>][] = [...rankedMap.entries()];
  entries.sort(([termA, valueA], [termB, valueB]) =>
    valueB.score - valueA.score || termA.localeCompare(termB)
  );
  return entries.slice(0, limit).map(([, value]): RankedFusionResult<T> => {
    return {
      item: value.item,
      score: value.score,
      sources: value.sources
    }
  });
}

function record<T>(terms: Map<string, RankedValue<T>>, key: string, rankedValue: RankedValue<T>): void {
  const existing = terms.get(key);
  if (existing) {
    existing.score += rankedValue.score;
    const source = rankedValue.sources.find((source: string) => !existing.sources.includes(source))
    if (source) {
      existing.sources.push(source);
    }
  } else {
    terms.set(key, { score: rankedValue.score, sources: rankedValue.sources, item: rankedValue.item });
  }
}
