import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataLoader } from "../src/data-loader";

vi.mock("../src/companies-data", () => ({
  companiesData: [
    {
      name: "株式会社A",
      cases: [
        { title: "アクセシビリティ対応", url: "https://a.com/1" },
        { title: "WCAG準拠", url: "https://a.com/2", description: "レベルAA準拠" },
      ],
    },
    {
      name: "株式会社B",
      cases: [{ title: "ユニバーサルデザイン", url: "https://b.com/1" }],
    },
  ],
}));

describe("DataLoader", () => {
  let dataLoader: DataLoader;

  beforeEach(() => {
    dataLoader = new DataLoader();
    vi.clearAllMocks();
  });

  describe("searchCompanies", () => {
    it("should search companies by name", async () => {
      const results = await dataLoader.searchCompanies("株式会社A");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("株式会社A");
    });

    it("should search companies by case title", async () => {
      const results = await dataLoader.searchCompanies("WCAG");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("株式会社A");
    });

    it("should search companies by case description", async () => {
      const results = await dataLoader.searchCompanies("レベルAA");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("株式会社A");
    });

    it("should return empty array when no match", async () => {
      const results = await dataLoader.searchCompanies("存在しない");
      expect(results).toHaveLength(0);
    });

    it("should be case insensitive", async () => {
      const results = await dataLoader.searchCompanies("wcag");
      expect(results).toHaveLength(1);
    });
  });

  describe("searchCases", () => {
    it("should search cases by title", async () => {
      const results = await dataLoader.searchCases("アクセシビリティ");
      expect(results).toHaveLength(1);
      expect(results[0].company).toBe("株式会社A");
      expect(results[0].case.title).toBe("アクセシビリティ対応");
    });

    it("should search cases across all companies", async () => {
      const results = await dataLoader.searchCases("デザイン");
      expect(results).toHaveLength(1);
      expect(results[0].company).toBe("株式会社B");
    });

    it("should return empty array when no match", async () => {
      const results = await dataLoader.searchCases("存在しない");
      expect(results).toHaveLength(0);
    });
  });

  describe("getAllCompanies", () => {
    it("should return all companies", async () => {
      const companies = await dataLoader.getAllCompanies();
      expect(companies).toHaveLength(2);
      expect(companies[0].name).toBe("株式会社A");
      expect(companies[1].name).toBe("株式会社B");
    });
  });
});
