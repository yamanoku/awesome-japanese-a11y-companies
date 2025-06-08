import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseMarkdownFile } from "../src/parser";

describe("parseMarkdownFile", () => {
  const testFile = join(__dirname, "test-companies.md");

  afterEach(async () => {
    try {
      await rm(testFile);
    } catch {
      // ignore if file doesn't exist
    }
  });

  it("should parse companies and their cases", async () => {
    const content = `# テスト

## 株式会社テストA
- [テスト記事1](https://example.com/1)
- [テスト記事2](https://example.com/2)
  - アクセシビリティ対応の詳細

## 株式会社テストB
- [WCAG対応事例](https://example.com/3)
`;

    await writeFile(testFile, content, "utf-8");
    const companies = await parseMarkdownFile(testFile);

    expect(companies).toHaveLength(2);

    expect(companies[0].name).toBe("株式会社テストA");
    expect(companies[0].cases).toHaveLength(2);
    expect(companies[0].cases[0].title).toBe("テスト記事1");
    expect(companies[0].cases[0].url).toBe("https://example.com/1");
    expect(companies[0].cases[1].description).toBe("アクセシビリティ対応の詳細");

    expect(companies[1].name).toBe("株式会社テストB");
    expect(companies[1].cases).toHaveLength(1);
    expect(companies[1].cases[0].title).toBe("WCAG対応事例");
  });

  it("should handle empty file", async () => {
    await writeFile(testFile, "", "utf-8");
    const companies = await parseMarkdownFile(testFile);
    expect(companies).toHaveLength(0);
  });

  it("should handle file with no companies", async () => {
    const content = `# ヘッダー

これは説明文です。

- リスト項目1
- リスト項目2
`;
    await writeFile(testFile, content, "utf-8");
    const companies = await parseMarkdownFile(testFile);
    expect(companies).toHaveLength(0);
  });
});
