import { companiesData } from "./companies-data.js";
import type { Company } from "./types.js";

export class DataLoader {
  private companies: Company[] = companiesData;

  async loadData(): Promise<void> {
    // Data is already loaded from the static import
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const lowerQuery = query.toLowerCase();
    return this.companies.filter(
      (company) =>
        company.name.toLowerCase().includes(lowerQuery) ||
        company.cases.some(
          (c) =>
            c.title.toLowerCase().includes(lowerQuery) ||
            c.description?.toLowerCase().includes(lowerQuery),
        ),
    );
  }

  async searchCases(query: string): Promise<Array<{ company: string; case: Company["cases"][0] }>> {
    const lowerQuery = query.toLowerCase();
    const results: Array<{ company: string; case: Company["cases"][0] }> = [];

    for (const company of this.companies) {
      for (const caseItem of company.cases) {
        if (
          caseItem.title.toLowerCase().includes(lowerQuery) ||
          caseItem.description?.toLowerCase().includes(lowerQuery)
        ) {
          results.push({ company: company.name, case: caseItem });
        }
      }
    }

    return results;
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.companies;
  }
}
