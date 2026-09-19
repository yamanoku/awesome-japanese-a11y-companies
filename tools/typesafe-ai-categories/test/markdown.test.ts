import { describe, expect, it } from "vitest";

import { renderClassifiedMarkdown } from "../src/markdown";
import type { ClassifiedCase } from "../src/types";

const sample: ClassifiedCase[] = [
  {
    companyName: "フリー株式会社",
    title: "freeeアクセシビリティー・ガイドライン",
    url: "https://a11y-guidelines.freee.co.jp/",
    genre: "policy_guideline",
    confidence: 0.92,
    model: "jev-latest",
  },
  {
    companyName: "フリー株式会社",
    title: "2022年、freeeのアクセシビリティを振り返る",
    url: "https://example.com/freee-review",
    genre: "article_talk",
    confidence: 0.81,
    model: "jev-latest",
  },
  {
    companyName: "株式会社foo",
    title: "あいまいな事例",
    url: "https://example.com/unclear",
    genre: "article_talk",
    confidence: 0.31,
    model: "jev-latest",
  },
];

describe("renderClassifiedMarkdown", () => {
  it("groups cases by genre and company, and lists low-confidence items", () => {
    const markdown = renderClassifiedMarkdown(sample, {
      generatedOn: "2026-09-19",
      models: ["jev-latest"],
      lowConfidenceThreshold: 0.5,
    });

    expect(markdown).toContain("# 事例ジャンル一覧");
    expect(markdown).toContain("- 生成: 2026-09-19");
    expect(markdown).toContain("- モデル: jev-latest");
    expect(markdown).toContain("- 事例数: 3");
    expect(markdown).toContain("## 方針・ガイドライン (1)");
    expect(markdown).toContain("### フリー株式会社");
    expect(markdown).toContain(
      "- [freeeアクセシビリティー・ガイドライン](https://a11y-guidelines.freee.co.jp/)",
    );
    expect(markdown).toContain("## 記事・登壇 (2)");
    expect(markdown).toContain("## 要確認（confidence < 0.5）");
    expect(markdown).toContain(
      "- 株式会社foo / [あいまいな事例](https://example.com/unclear) → 記事・登壇 (0.31)",
    );
    expect(markdown).not.toContain("## 事業・サービス");
  });

  it("says 該当なし when every case is confident", () => {
    const markdown = renderClassifiedMarkdown(sample.slice(0, 1), {
      generatedOn: "2026-09-19",
      models: ["jev-latest"],
      lowConfidenceThreshold: 0.5,
    });

    expect(markdown).toContain("該当なし。");
  });
});
