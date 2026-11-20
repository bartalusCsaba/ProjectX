export interface GroundingReport {
  readonly valid: string[],
  readonly unknown: string[],
  readonly uncited: boolean
}