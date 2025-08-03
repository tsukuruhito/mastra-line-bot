# mastra-line-bot

Mastraフレームワークを使ったLINE向け天気情報ボットです。

## 概要

- ユーザーの位置情報から天気を取得し、天気に応じたアクティビティ提案も行います。
- Mastraのエージェント・ツール・ワークフローを活用。
- Claude 3.5 Sonnetモデルを利用。

## 主な構成

- `src/mastra/agents/weather-agent.ts`: 天気情報を提供するエージェント
- `src/mastra/tools/weather-tool.ts`: 天気データ取得用ツール
- `src/mastra/workflows/weather-workflow.ts`: 天気予報ワークフロー
- `src/mastra/index.ts`: Mastraの初期化・設定

## セットアップ

1. 依存パッケージのインストール
   ```bash
   npm install
   ```
2. 開発サーバー起動
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
| `NOTION_API_KEY`            | Notion APIと連携するためのインテグレーションキー。Notion関連のツールで使用します。 |



## 使い方

- LINE Botとして動作させるには、LINE Messaging APIとの連携が必要です（実装例は今後追加予定）。
- サーバー起動後、エージェントに位置情報を送ることで天気情報が取得できます。

## ライセンス

ISC
