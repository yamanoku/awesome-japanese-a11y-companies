import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadCache, saveCache } from "../src/cache";

describe("cache", () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it("returns an empty map when the file does not exist", async () => {
    const cache = await loadCache(join(tmpdir(), "missing-classifications.json"));
    expect(cache.size).toBe(0);
  });

  it("round-trips valid entries and skips invalid ones", async () => {
    const dir = await mkdtemp(join(tmpdir(), "a11y-cache-"));
    dirs.push(dir);
    const path = join(dir, "classifications.json");

    await saveCache(
      path,
      new Map([
        ["https://example.com/ok", { genre: "product", confidence: 0.8, model: "jev-latest" }],
      ]),
    );

    const loaded = await loadCache(path);
    expect(loaded.get("https://example.com/ok")).toEqual({
      genre: "product",
      confidence: 0.8,
      model: "jev-latest",
    });
  });
});
