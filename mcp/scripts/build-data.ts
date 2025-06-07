import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import { parseMarkdownFile } from "../src/parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildData() {
  const rootDir = join(__dirname, "..", "..");
  const pattern = join(rootDir, "company-list", "*.md");
  const files = await glob(pattern);

  const companies = [];

  for (const file of files) {
    const companiesInFile = await parseMarkdownFile(file);
    companies.push(...companiesInFile);
  }

  const output = `// This file is auto-generated. Do not edit manually.
export const companiesData = ${JSON.stringify(companies, null, 2)};
`;

  await writeFile(join(__dirname, "..", "src", "companies-data.ts"), output);
  console.log(`Generated companies-data.ts with ${companies.length} companies`);
}

buildData().catch(console.error);
