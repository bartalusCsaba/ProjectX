import {expect, it} from "vitest";
import {queryTerms} from "@/application/retrieval/query-terms";

it("checks text gives back a list without stopwords", () => {
  expect(queryTerms("Which cost centre do training invoices go to?")).toEqual([ 'cost', 'centre', 'training', 'invoices', 'go' ]);
})