import {it, describe, expect} from "vitest";
import {checkCitations} from "@/application/agent/sources";
import {type SearchHit} from "@/domain/types";
import {SourceRegistry} from "@/application/agent/source-registry";

describe("Grounding Report", () => {
  it('does not flag an empty answer as uncited', () => {
    expect(checkCitations("", new Set([]))).toEqual({valid: [], unknown: [], uncited: false});
    expect(checkCitations("        ", new Set([]))).toEqual({valid: [], unknown: [], uncited: false});
  });

  it('should return uncited true', () => {
    expect(checkCitations("Something that is not empty but has no citations", new Set())).toEqual({valid: [], unknown: [], uncited: true});
  });

  it('should return [S1] as unknown', () => {
    expect(checkCitations("Something has citations but not valid [S1]", new Set())).toEqual({valid: [], unknown: ["S1"], uncited: false});
  });

  it('should return valid citations', () => {
    expect(checkCitations("Something has citations but not valid [S1]", new Set(["S1"]))).toEqual({valid: ["S1"], unknown: [], uncited: false});
  });

  it('should return valid 2 valid citations', () => {
    expect(checkCitations("Something has citations but not valid [S1][S2]", new Set(["S1", "S2"]))).toEqual({valid: ["S1", "S2"], unknown: [], uncited: false});
  });

  it('should return valid 1 valid citations and 1 unknown', () => {
    expect(checkCitations("Something has citations but not valid [S1][S2]", new Set(["S1"]))).toEqual({valid: ["S1"], unknown: ["S2"], uncited: false});
  });

  it('should return 1 valid citation and leave out PS5 and S3 modell as citation', () => {
    expect(checkCitations("A PS5 és az S3 modell is támogatott [S1].", new Set(["S1"])))
      .toEqual({valid: ["S1"], unknown: [], uncited: false});
  });

  it('should return lists always sorted', () => {
    expect(checkCitations("A PS5 és az S3 modell is támogatott [S20][S3].", new Set(["S3", "S20"])))
      .toEqual({valid: ["S3", "S20"], unknown: [], uncited: false});
  });

  it('should return one valid citations', () => {
    expect(checkCitations("Something has citations but not valid [S1][S1]", new Set(["S1"]))).toEqual({valid: ["S1"], unknown: [], uncited: false});
  });
})



const aHit = (id: string): SearchHit => ({
  chunk: {
    id,
    documentId: "doc-1",
    ordinal: 0,
    content: `Content of ${id}`,
    headingPath: ["Leave"],
    estimatedToken: 5,
  },
  score: 1,
  sources: ["vector"],
  documentTitle: "Handbook",
});

describe('Source Registry', () => {
  it("assigns labels in order and reuses the label of a known chunk", () => {
    const registry = new SourceRegistry();

    expect(registry.register(aHit("a")).label).toBe("S1");
    expect(registry.register(aHit("b")).label).toBe("S2");
    expect(registry.register(aHit("a")).label).toBe("S1");
  });

  it("finds a source by its label, ignoring case and spaces", () => {
    const registry = new SourceRegistry();
    registry.register(aHit("a"));
    registry.register(aHit("b"));

    expect(registry.get("S2")?.chunkId).toBe("b");
    expect(registry.get(" s2")?.chunkId).toBe("b");
  });

  it('lists all sources in the order they were registered ', () => {
    const registry = new SourceRegistry();
    registry.register(aHit("a"));
    registry.register(aHit("b"));

    expect(registry.all().map((reference) => reference.label)).toEqual(["S1", "S2"]);
  });

  it("returns undefined for a label that was never assigned", () => {
    const registry = new SourceRegistry();
    expect(registry.get("S9")).toBeUndefined();
  })
})