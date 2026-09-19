export interface Company {
  name: string;
  cases: Case[];
}

export interface Case {
  title: string;
  url: string;
  description?: string;
}

export const GENRE_IDS = [
  "policy_guideline",
  "business_service",
  "product",
  "team_org",
  "article_talk",
  "other",
] as const;

export type GenreId = (typeof GENRE_IDS)[number];

export interface FlattenedCase extends Case {
  companyName: string;
}

export interface ClassifiedCase extends FlattenedCase {
  genre: GenreId;
  confidence: number;
  model: string;
}

export interface CacheEntry {
  genre: GenreId;
  confidence: number;
  model: string;
}

export interface ClassifyOptions {
  concurrency: number;
  cachePath: string;
  onProgress?: (done: number, total: number, item: FlattenedCase, cached: boolean) => void;
}

export interface MarkdownMeta {
  generatedOn: string;
  models: string[];
  lowConfidenceThreshold: number;
}
