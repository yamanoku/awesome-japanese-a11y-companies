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

## リモートMCPサーバーの提供

このMCPサーバーは、リモートでホストされており、以下のURLを使ってMCPサーバーを起動できます。

`https://awesome-japanese-a11y-companies-mcp.yamanoku.workers.dev/mcp`

### VSCodeでの設定

```json
{
  "mcp": {
    "servers": {
      "awesome-japanese-a11y-companies-mcp": {
        "url": "https://awesome-japanese-a11y-companies-mcp.yamanoku.workers.dev/mcp"
      }
    }
  }
}
```

### Claude Desktopでの設定

Claude Pro, Max, Team, EnterpriseプランのユーザーはClaude Desktopアプリの「Custom Integrations」からURLを設定し、再起動することで使用できるようになります。

![Awesome JapaneseA11y Companies MCPの設定画面。URLフィールドに https://awesome-japanese-a11y-companies-mcp.yamanoku.workers.dev/sse が入力されている状態](https://i.gyazo.com/b0763f8e1884e17164c9459c64beab5d.png)

![Claude Desktopのツールメニュー。「検索とツール」で表示されるメニュー下部にAwesome JapaneseA11y Companiesが3つのツールとともに表示されている](https://i.gyazo.com/d3fdce7d6d2bc45894b507a7968c85e3.png)

![Awesome JapaneseA11y Companiesのメニュー詳細。search_companies、search_cases、list_all_companiesの3つの機能が有効化されている](https://i.gyazo.com/ea31a8779e7a7de3fc3e258ae3d82c46.png)
