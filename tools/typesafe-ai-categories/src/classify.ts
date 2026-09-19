import { TypeSafeClient, choice } from "@typesafe-ai/sdk";

import { loadCache, saveCache } from "./cache.js";
import { GENRE_CRITERIA, GENRE_INSTRUCTIONS } from "./genres.js";
import type { CacheEntry, ClassifiedCase, ClassifyOptions, FlattenedCase } from "./types.js";

export function genreQuestions() {
  return {
    genre: choice(GENRE_INSTRUCTIONS, GENRE_CRITERIA),
  };
}

export function createTypeSafeClient(): TypeSafeClient {
  if (!process.env.TYPESAFE_API_KEY?.trim()) {
    throw new Error(
      "TYPESAFE_API_KEY is not set. Put it in tools/typesafe-ai-categories/.env or export it before running classification.",
    );
  }
  return new TypeSafeClient();
}

export async function classifyCases(
  items: FlattenedCase[],
  options: ClassifyOptions,
): Promise<ClassifiedCase[]> {
  const cache = await loadCache(options.cachePath);
  const uncached = items.filter((item) => !cache.has(item.url));
  const client = uncached.length > 0 ? createTypeSafeClient() : null;
  let done = 0;

  for (const item of items) {
    if (cache.has(item.url)) {
      done += 1;
      options.onProgress?.(done, items.length, item, true);
    }
  }

  await mapPool(uncached, options.concurrency, async (item) => {
    if (!client) {
      return;
    }

    const classified = await classifyCase(client, item);
    cache.set(item.url, {
      genre: classified.genre,
      confidence: classified.confidence,
      model: classified.model,
    });
    await saveCache(options.cachePath, cache);
    done += 1;
    options.onProgress?.(done, items.length, item, false);
  });

  return items.map((item) => {
    const entry = cache.get(item.url);
    if (!entry) {
      throw new Error(`Missing classification for ${item.url}`);
    }
    return toClassifiedCase(item, entry);
  });
}

export async function classifyCase(
  client: TypeSafeClient,
  item: FlattenedCase,
): Promise<ClassifiedCase> {
  const { answers, model } = await client.systemOne({
    state: {
      company: item.companyName,
      title: item.title,
      url: item.url,
      description: item.description ?? "",
    },
    questions: genreQuestions(),
  });

  return {
    ...item,
    genre: answers.genre.choice,
    confidence: answers.genre.confidence,
    model,
  };
}

function toClassifiedCase(item: FlattenedCase, entry: CacheEntry): ClassifiedCase {
  return {
    ...item,
    genre: entry.genre,
    confidence: entry.confidence,
    model: entry.model,
  };
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  if (items.length === 0) {
    return;
  }

  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  let next = 0;

  async function worker() {
    while (true) {
      const index = next;
      next += 1;
      if (index >= items.length) {
        return;
      }
      await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
}
