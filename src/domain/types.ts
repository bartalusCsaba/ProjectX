export type ChunkId = string;
export type DocumentId = string;
export type SourceType = "vector" | "keyword";

export interface GroundingReport {
  readonly valid: string[],
  readonly unknown: string[],
  readonly uncited: boolean
}

export interface ChunkDraft {
  readonly ordinal: number;
  readonly content: string;
  readonly headingPath: readonly string[];
  readonly pageNumber?: number;
  readonly estimatedToken: number;
}

export interface Chunk extends ChunkDraft {
  readonly id: ChunkId;
  readonly documentId: DocumentId;
}

export interface SearchHit {
  readonly chunk: Chunk;
  readonly score: number;
  readonly sources: readonly SourceType[];
  readonly documentTitle: string;
}

export interface SourceReference {
  readonly label: string;
  readonly documentTitle: string;
  readonly chunkId: ChunkId;
  readonly documentId: DocumentId;
  readonly headingPath: readonly string[];
  readonly pageNumber?: number;
}