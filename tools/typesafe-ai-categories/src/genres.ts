import { GENRE_IDS, type GenreId } from "./types.js";

export const LOW_CONFIDENCE_THRESHOLD = 0.5;

export const GENRE_LABELS: Record<GenreId, string> = {
  policy_guideline: "方針・ガイドライン",
  business_service: "事業・サービス",
  product: "プロダクト対応",
  team_org: "チーム・組織の取り組み",
  article_talk: "記事・登壇",
  other: "その他",
};

export const GENRE_INSTRUCTIONS =
  "Which genre best describes this Japanese company accessibility case? Judge from `title`, `url`, and `description`. The case belongs to `company`.";

export const GENRE_CRITERIA: Record<GenreId, string> = {
  policy_guideline:
    "Official accessibility policy, conformance statement, or published guideline/checklist",
  business_service:
    "Paid or offered a11y service: audit, consulting, training, CMS features sold to clients",
  product: "The company's own product/app gained an a11y feature or improvement",
  team_org:
    "Internal team, process, hiring, or org-wide a11y promotion (not a public article/talk as the main artifact)",
  article_talk: "Blog post, retrospective, slide deck, or conference talk about a11y work",
  other: "Does not fit the other options",
};

export function isGenreId(value: unknown): value is GenreId {
  return typeof value === "string" && (GENRE_IDS as readonly string[]).includes(value);
}
