import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { isGenreId } from "./genres.js";
import type { CacheEntry } from "./types.js";

export async function loadCache(cachePath: string): Promise<Map<string, CacheEntry>> {
  try {
    const raw = await readFile(cachePath, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    const cache = new Map<string, CacheEntry>();

    if (!parsed || typeof parsed !== "object") {
      return cache;
    }

    for (const [url, value] of Object.entries(parsed)) {
      if (!isCacheEntry(value)) {
        continue;
      }
      cache.set(url, value);
    }

    return cache;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return new Map();
    }
    throw error;
  }
}

export async function saveCache(cachePath: string, cache: Map<string, CacheEntry>): Promise<void> {
  await mkdir(dirname(cachePath), { recursive: true });
  const payload = Object.fromEntries(cache);
  await writeFile(cachePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function isCacheEntry(value: unknown): value is CacheEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    isGenreId(entry.genre) &&
    typeof entry.confidence === "number" &&
    typeof entry.model === "string"
  );
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
