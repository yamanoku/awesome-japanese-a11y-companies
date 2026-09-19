import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { classifyCases } from "./classify.js";
import { defaultMarkdownMeta, renderClassifiedMarkdown } from "./markdown.js";
import { flattenCases, parseCompanyListDir } from "./parser.js";

const packageDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(packageDir, "..", "..");

loadEnvFile(join(packageDir, ".env"));

async function main() {
  const options = parseCliArgs();
  const companies = await parseCompanyListDir(join(repoRoot, "company-list"));
  const cases = flattenCases(companies);
  const selected = options.limit ? cases.slice(0, options.limit) : cases;

  console.log(`Loaded ${cases.length} cases. Classifying ${selected.length}.`);

  const classified = await classifyCases(selected, {
    concurrency: options.concurrency,
    cachePath: options.cachePath,
    onProgress(done, total, item, cached) {
      const tag = cached ? "cache" : "api";
      console.log(`[${done}/${total}] ${tag} ${item.companyName} — ${item.title}`);
    },
  });

  const markdown = renderClassifiedMarkdown(classified, defaultMarkdownMeta(classified));
  await mkdir(dirname(options.outputPath), { recursive: true });
  await writeFile(options.outputPath, markdown, "utf-8");
  console.log(`Wrote ${options.outputPath}`);
}

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      limit: { type: "string" },
      concurrency: { type: "string", default: "8" },
      output: { type: "string" },
      cache: { type: "string" },
    },
  });

  return {
    limit: parsePositiveInt(values.limit, "limit"),
    concurrency: parsePositiveInt(values.concurrency, "concurrency") ?? 8,
    outputPath: resolve(values.output ?? join(packageDir, "output", "classified.md")),
    cachePath: resolve(values.cache ?? join(packageDir, ".cache", "classifications.json")),
  };
}

function loadEnvFile(envPath: string) {
  if (!existsSync(envPath)) {
    return;
  }
  process.loadEnvFile(envPath);
}

function parsePositiveInt(value: string | undefined, name: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`--${name} must be a positive integer`);
  }
  return parsed;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
