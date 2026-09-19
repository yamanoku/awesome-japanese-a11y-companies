# 事例ジャンル分けツール

[company-list](../../company-list/) の各事例を [TypeSafe](https://docs.typesafe.ai/)（Jev）で6ジャンルに分類し、ジャンル別 Markdown を出力します。`company-list/` の原文は書き換えません。

## ジャンル

- 方針・ガイドライン
- 事業・サービス
- プロダクト対応
- チーム・組織の取り組み
- 記事・登壇
- その他

判定は事例（リンク）1件ごとです。タイトル・URL・補足説明だけを送り、ページ本文は取得しません。

## 使い方

Node.js 24 以上が必要です。API キーは [TypeSafe のコンソール](https://console.typesafe.ai/settings/keys) で発行し、`tools/typesafe-ai-categories/.env` に書いてください。すでに同じ名前の環境変数がある場合は、そちらの値が優先されます。

```bash
cd tools/typesafe-ai-categories
npm install
cp .env.example .env
npm start
```

出力先のデフォルトは `tools/typesafe-ai-categories/output/classified.md` です。同じ URL は `tools/typesafe-ai-categories/.cache/classifications.json` に残るので、再実行では API を呼びません。

試走する場合:

```bash
npx tsx src/index.ts --limit 5
```

## CLI オプション

| オプション        | デフォルト                          | 説明                  |
| ----------------- | ----------------------------------- | --------------------- |
| `--limit N`       | なし（全件）                        | 先頭 N 件だけ分類する |
| `--concurrency N` | `8`                                 | 同時リクエスト数      |
| `--output PATH`   | `tools/typesafe-ai-categories/output/classified.md`        | Markdown の出力先     |
| `--cache PATH`    | `tools/typesafe-ai-categories/.cache/classifications.json` | 分類キャッシュ        |

confidence が `0.5` 未満の事例は、選ばれたジャンルにも載せたうえで末尾の「要確認」に出します。閾値は `src/genres.ts` の `LOW_CONFIDENCE_THRESHOLD` です。
