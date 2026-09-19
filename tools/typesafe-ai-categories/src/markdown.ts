import { GENRE_LABELS, LOW_CONFIDENCE_THRESHOLD } from "./genres.js";
import { type ClassifiedCase, GENRE_IDS, type MarkdownMeta } from "./types.js";

export function renderClassifiedMarkdown(cases: ClassifiedCase[], meta: MarkdownMeta): string {
  const lines: string[] = [
    "# 事例ジャンル一覧",
    "",
    `- 生成: ${meta.generatedOn}`,
    `- モデル: ${formatModels(meta.models)}`,
    `- 事例数: ${cases.length}`,
    "",
  ];

  for (const genre of GENRE_IDS) {
    const genreCases = cases.filter((item) => item.genre === genre);
    if (genreCases.length === 0) {
      continue;
    }

    lines.push(`## ${GENRE_LABELS[genre]} (${genreCases.length})`, "");

    let currentCompany = "";
    for (const item of genreCases) {
      if (item.companyName !== currentCompany) {
        if (currentCompany) {
          lines.push("");
        }
        currentCompany = item.companyName;
        lines.push(`### ${item.companyName}`);
      }
      lines.push(`- [${item.title}](${item.url})`);
    }

    lines.push("");
  }

  const uncertain = cases.filter((item) => item.confidence < meta.lowConfidenceThreshold);
  lines.push(`## 要確認（confidence < ${meta.lowConfidenceThreshold}）`, "");
  lines.push("判定が分かれた事例。ジャンルは上にも掲載している。", "");

  if (uncertain.length === 0) {
    lines.push("該当なし。", "");
  } else {
    for (const item of uncertain) {
      const confidence = item.confidence.toFixed(2);
      lines.push(
        `- ${item.companyName} / [${item.title}](${item.url}) → ${GENRE_LABELS[item.genre]} (${confidence})`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}`;
}

export function collectModels(cases: ClassifiedCase[]): string[] {
  return [...new Set(cases.map((item) => item.model))];
}

export function defaultMarkdownMeta(cases: ClassifiedCase[]): MarkdownMeta {
  return {
    generatedOn: new Date().toISOString().slice(0, 10),
    models: collectModels(cases),
    lowConfidenceThreshold: LOW_CONFIDENCE_THRESHOLD,
  };
}

function formatModels(models: string[]): string {
  if (models.length === 0) {
    return "unknown";
  }
  return models.join(", ");
}
