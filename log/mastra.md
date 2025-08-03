# MastraでNotion MCPを利用する方法

このドキュメントでは、MastraフレームワークでNotionの機能を提供するMCP（Model Context Protocol）サーバーに接続し、Notionを操作する方法について解説します。

## 1. はじめに

Notion MCPを利用することで、Mastra Agentは以下のようなタスクを実行できるようになります。

- Notionデータベースのページを検索、作成、更新する
- ページコンテンツを追加、取得する
- ユーザー情報を取得する

これにより、自然言語の指示だけでNotionを操作する高度なAIアシスタントを構築できます。

## 2. 前提条件

- Mastraプロジェクトがセットアップ済みであること
- Node.jsとnpm/yarnがインストールされていること
- Notion APIのインテグレーションとデータベースが準備済みであること
- 必要な環境変数が設定されていること（`.env`ファイルなど）
  ```
  NOTION_API_KEY=your_notion_api_key
  NOTION_DATABASE_ID=your_database_id
  ```

## 3. ステップ1: Notion用MCPサーバーの準備

Mastraから利用するために、まずNotionの機能を提供するMCPサーバーを起動します。
ここでは、サードパーティ製の`@modelcontextprotocol/server-notion`を利用する例を示します。

ターミナルで以下のコマンドを実行し、MCPサーバーを起動します。

```bash
# Notion MCPサーバーをnpxで実行
npx -y @modelcontextprotocol/server-notion --port 8081
```

サーバーが起動すると、`http://localhost:8081/mcp`のエンドポイントでリクエストを待ち受けます。

## 4. ステップ2: MCPクライアントの作成

MastraからMCPサーバーに接続するためのクライアントを設定します。

**`src/mastra/tools/notion.ts`**
```typescript
import { MCPClient } from "@mastra/mcp";

// Notionの機能を提供するMCPサーバーへの接続を設定します。
const mcp = new MCPClient({
  servers: {
    notion: {
      // ステップ1で起動したローカルサーバーのURL
      url: new URL("http://localhost:8081/mcp"),
    },
  },
});

/**
 * MCPサーバーからNotion関連のツールを非同期で取得します。
 * @returns 取得したツールのオブジェクト。エラーの場合は空のオブジェクトを返します。
 */
export const getNotionTools = async () => {
  try {
    const tools = await mcp.getTools();
    console.log("Successfully fetched Notion tools from MCP server.");
    return tools;
  } catch (error) {
    console.error("Failed to fetch Notion tools from MCP server:", error);
    return {};
  }
};

/**
 * アプリケーション終了時などに、MCPクライアントとの接続を正常に切断します。
 */
export const disconnectNotionMcp = async () => {
  await mcp.disconnect();
  console.log("Disconnected from Notion MCP server.");
};
```

## 5. ステップ3: Notionエージェントの作成

取得したNotionツールを利用する専用のAgentを作成します。

**`src/mastra/agents/notion-agent.ts`**
```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { getNotionTools } from "../tools/notion";

export const notionAgent = new Agent({
  name: "Notion Agent",
  instructions: `You are an assistant that can interact with Notion.
Use the available tools to search, create, and update pages in a Notion database.
When asked to create a page, use the 'createPage' tool.
When asked to find pages, use the 'searchPages' tool.`,
  model: openai("gpt-4o-mini"),
  // 動的にツールを読み込む
  tools: getNotionTools,
});
```

## 6. ステップ4: Mastraへの登録

作成した`notionAgent`をMastraインスタンスに登録し、アプリケーション全体で利用できるようにします。

**`src/mastra/index.ts`** (抜粋)
```typescript
import { Mastra } from '@mastra/core/mastra';
import { notionAgent } from './agents/notion-agent'; // 作成したAgentをインポート

export const mastra = new Mastra({
  // ... 他のエージェントやワークフロー
  agents: {
    // ...
    notionAgent, // notionAgentを登録
  },
  // ... 他の設定
});
```

## 7. ステップ5: エージェントの実行

以上で準備は完了です。実際に`notionAgent`を呼び出してNotionを操作してみましょう。

以下のサンプルコードは、"My new page"というタイトルのページをNotionに作成する例です。

```typescript
import { mastra } from "./src/mastra"; // Mastraインスタンスをインポート

async function main() {
  console.log("Getting Notion agent...");
  const agent = await mastra.getAgent("notionAgent");

  const prompt = 'Create a new page in Notion with the title "My new page".';
  console.log(`Prompt: ${prompt}`);

  try {
    const response = await agent.generate(prompt);
    console.log("Agent Response:", response.text);
  } catch (error) {
    console.error("Error during agent execution:", error);
  }
}

main();
```

このコードを実行すると、`notionAgent`はプロンプトを解釈し、`createPage`ツールを呼び出してNotionに新しいページを作成します。

## 8. 別のアプローチ: `MCPClient`インスタンスの直接エクスポート

上記ではツール取得用の関数 `getNotionTools` を作成しましたが、ドキュメントにあるように`MCPClient`インスタンスを直接エクスポートする、よりシンプルな方法もあります。このアプローチは、複数の異なるMCPサーバーをまとめて管理したい場合に特に便利です。

### ステップ1: 複数のMCPサーバーを設定するクライアントを作成

`src/mastra/tools/mcp.ts` のようなファイルを作成し、利用したいすべてのMCPサーバーを定義します。

**`src/mastra/tools/mcp.ts`**
```typescript
import { MCPClient } from "@mastra/mcp";

// 複数のMCPサーバーに接続するためのクライアントインスタンス
export const mcp = new MCPClient({
  servers: {
    // Notionサーバー (command形式)
    notion: {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-notion",
      ],
      // 必要に応じて環境変数を渡す
      // env: {
      //   NOTION_API_KEY: process.env.NOTION_API_KEY,
      //   NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
      // },
    },
    // ローカルファイルシステムを操作するサーバー
    filesystem: {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/local/directory", // 注意: このパスは実際のディレクトリに置き換えてください
      ],
    },
  },
});
```

### ステップ2: エージェントからツールを動的に取得

エージェントの`tools`プロパティに非同期関数を渡し、その中で`mcp.getTools()`を呼び出します。

**`src/mastra/agents/multi-tool-agent.ts`**
```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { mcp } from "../tools/mcp"; // 作成したMCPクライアントインスタンス

export const multiToolAgent = new Agent({
  name: "Multi Tool Agent",
  instructions: "You can use tools from both Notion and the local filesystem.",
  model: openai("gpt-4o-mini"),
  // エージェント初期化時に非同期でツールを取得
  tools: async () => {
    try {
      console.log("Fetching tools from MCP servers...");
      return await mcp.getTools();
    } catch (error) {
      console.error("Failed to fetch MCP tools:", error);
      return {}; // エラー時は空のツールセットを返す
    }
  },
});
```

この方法により、`multiToolAgent`はNotionとローカルファイルシステムの両方を操作する能力を持つことになります。エージェントの定義がよりシンプルになり、管理するMCPサーバーが増えても拡張しやすくなります。
