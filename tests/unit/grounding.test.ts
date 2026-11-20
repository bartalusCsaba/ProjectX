import {it, describe, expect} from "vitest";
import {checkCitations} from "@/application/agent/sources";

describe("Grounding Report", () => {
  it('should return uncited', () => {
    expect(checkCitations("", new Set([]))).toEqual({valid: [], unknown: [], uncited: false});
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

  it('should return uncited for not empty whitespace text', () => {
    expect(checkCitations("        ", new Set([]))).toEqual({valid: [], unknown: [], uncited: false});
  });
})