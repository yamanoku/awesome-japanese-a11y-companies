# awesome-japanese-a11y-companies-mcp-server

日本企業のアクセシビリティへの取り組み事例を検索・取得できるMCP（Model Context Protocol）サーバーです。

## 概要

このMCPサーバーは、[awesome-japanese-a11y-companies](https://github.com/yamanoku/awesome-japanese-a11y-companies)のデータを活用し、日本企業のアクセシビリティ事例をAIエージェントから簡単に検索・参照できるようにします。

## 機能

### 利用可能なツール

1. **search_companies**
   - 企業名やアクセシビリティの内容で企業を検索
   - パラメータ: `query` (検索クエリ)
   - 返り値: 該当する企業とその事例のリスト

2. **search_cases**
   - すべての企業から特定のアクセシビリティ事例を検索
   - パラメータ: `query` (検索クエリ)
   - 返り値: 該当する事例と企業名のリスト

3. **list_all_companies**
   - アクセシビリティへの取り組みがある全企業のリストを取得
   - パラメータ: なし
   - 返り値: 企業名のリスト

## データソース

このMCPサーバーは[awesome-japanese-a11y-companies](https://github.com/yamanoku/awesome-japanese-a11y-companies)のcompany-listのMarkdownファイルから企業情報を自動的に取得・パースしています。