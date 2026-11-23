import {ChunkId, SearchHit, SourceReference} from "@/domain/types";

export class SourceRegistry {
  readonly #labelMap = new Map<string, SourceReference>();
  readonly #chunkIdMap = new Map<ChunkId, string>();

  register(hit: SearchHit): SourceReference {
    const sourceReference = this.#findByChunk(hit);
    if (sourceReference !== undefined) {
      return sourceReference;
    } else {
      const reference: SourceReference = {
        label: "S" + (this.#labelMap.size + 1),
        documentTitle: hit.documentTitle,
        chunkId: hit.chunk.id,
        documentId: hit.chunk.documentId,
        headingPath: hit.chunk.headingPath,
        pageNumber: hit.chunk.pageNumber,
      }
      this.#labelMap.set(reference.label, reference);
      this.#chunkIdMap.set(hit.chunk.id, reference.label)
      return reference;
    }
  }

  #findByChunk(hit: SearchHit): SourceReference | undefined {
    const label = this.#chunkIdMap.get(hit.chunk.id);
    return  label !== undefined ? this.#labelMap.get(label) : undefined;
  }

  get(label: string): SourceReference | undefined {
    return this.#labelMap.get(label.trim().toUpperCase());
  }

  all(): SourceReference[] {
    return [...this.#labelMap.values()];
  }

}