import { readFile } from "node:fs/promises";
import type { Case, Company } from "./types.js";

export async function parseMarkdownFile(filePath: string): Promise<Company[]> {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const companies: Company[] = [];
  let currentCompany: Company | null = null;

  for (const line of lines) {
    const companyMatch = line.match(/^## (.+)$/);
    if (companyMatch) {
      if (currentCompany) {
        companies.push(currentCompany);
      }
      currentCompany = {
        name: companyMatch[1].trim(),
        cases: [],
      };
      continue;
    }

    if (currentCompany) {
      const caseMatch = line.match(/^- \[(.+?)\]\((.+?)\)(.*)$/);
      if (caseMatch) {
        const caseItem: Case = {
          title: caseMatch[1].trim(),
          url: caseMatch[2].trim(),
        };

        const restContent = caseMatch[3].trim();
        if (restContent) {
          caseItem.description = restContent;
        }

        currentCompany.cases.push(caseItem);
      } else if (line.match(/^\s+- /) && currentCompany.cases.length > 0) {
        const descContent = line.replace(/^\s+- /, "").trim();
        if (descContent) {
          const lastCase = currentCompany.cases[currentCompany.cases.length - 1];
          lastCase.description = lastCase.description
            ? `${lastCase.description} ${descContent}`
            : descContent;
        }
      }
    }
  }

  if (currentCompany) {
    companies.push(currentCompany);
  }

  return companies;
}
