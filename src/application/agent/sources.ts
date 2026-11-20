import type {GroundingReport} from "@/domain/types";

const citation = /\[S[0-9]+]/g

const sortCallback = (citationA: string, citationB: string): number => {
  const numberA = Number(citationA.substring(1));
  const numberB = Number(citationB.substring(1));
  return numberA - numberB;
}

function sortCitations(report: GroundingReport): GroundingReport {
  return {
    valid: report.valid.sort(sortCallback),
    unknown: report.unknown.sort(sortCallback),
    uncited: report.uncited
  }
}

export function checkCitations(answer: string, known: Set<string>): GroundingReport  {
  const citations = new Set(answer.match(citation)?.map((citation) => citation.substring(1, citation.length - 1)));
  const uncited = citations.size === 0 && answer.trim().length > 0;

  const report: GroundingReport = {
    valid: [],
    unknown: [],
    uncited,
  }

  citations.forEach((citation) => {
    if (known.has(citation)) {
      report.valid.push(citation);
    } else {
      report.unknown.push(citation);
   }
  });

  return sortCitations(report);
}