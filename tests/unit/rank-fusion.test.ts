import {describe, expect, it} from "vitest";
import {rankFusion} from "@/application/retrieval/rank-fusion";

const semantic = { name: "semantic", items: ["a", "b", "c"] };
const keyword = { name: "keyword", items: ["c", "d"] };

describe("rankFusion", () => {
  it("returns an empty array for empty lists", () => {
    expect(
      rankFusion(
        [
          { name: "semantic", items: [] },
          { name: "keyword", items: [] },
        ],
        (item) => item,
        32
      ),
    ).toEqual([]);
  });

  it("ranks items found by both lists first, ties alphabetically", () => {
    const result = rankFusion([semantic, keyword], (item) => item,32);
    expect(result.map((entry) => entry.item)).toEqual(["c", "a", "b", "d"]);
  });

  it("sums the scores and records every list that found the item", () => {
    const [first] = rankFusion([semantic, keyword], (item) => item,32);
    expect(first?.item).toBe("c");
    expect(first?.sources).toEqual(["semantic", "keyword"]);
    expect(first?.score).toBeCloseTo(1 / 63 + 1 / 61);
  });

  it("applies the limit", () => {
    const result = rankFusion([semantic, keyword], (item) => item,1);
    expect(result.map((entry) => entry.item)).toEqual(["c"]);
  });

  it("merges different objects with the same key", () => {
    const semanticHits = { name: "semantic", items: [{ id: "c", text: "Szabadság: 25 nap" }] };
    const keywordHits = { name: "keyword", items: [{ id: "c", text: "Szabadság: 25 nap" }] };

    const result = rankFusion([semanticHits, keywordHits], (hit) => hit.id, 32);

    expect(result).toHaveLength(1);
    expect(result[0]?.sources).toEqual(["semantic", "keyword"]);
  });
});

