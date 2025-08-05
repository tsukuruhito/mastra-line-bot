# mastra-line-bot

- Mastraフレームワークを使ったエージェントLINE Botです。
- 解説記事はこちらをご参照ください。
  - [解説資料 - 【Live Vibe Cording】MastraとLINEで個人秘書エージェントを作る](https://zenn.dev/tmitsuoka0423/articles/mastra-line-bot)

## セットアップ

### インストール

```bash
npm install
```

### 起動

```bash
npm run dev
```

## 環境変数

このプロジェクトを実行するには、以下の環境変数を設定した`.env`ファイルを作成する必要があります。

| 変数名                      | 説明                                                                         |
| --------------------------- | ---------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`         | Anthropic APIを利用するためのAPIキー。Mastra Agentが使用します。               |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging APIのチャネルアクセストークン（長期）。Botがメッセージを送受信するために必要です。 |
| `LINE_CHANNEL_SECRET`       | LINE Messaging APIのチャネルシークレット。Webhookの署名検証などに使用します。    |
| `GITHUB_PAT`                | GitHubのパーソナルアクセストークン。GitHubのデータのCRUD操作に使用します。 |

## ライセンス

ISC
