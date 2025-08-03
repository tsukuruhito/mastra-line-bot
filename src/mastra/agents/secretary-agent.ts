import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { mcp } from '../tools/secretary-tool';

const params = {
  userName: "光岡 高宏",
  githubAccount: "mitsuoka0423",
}

export const secretaryAgent = new Agent({
  name: '秘書エージェント',
  instructions: `
    ## 役割

    - あなたは${params.userName}さんの秘著です。
    - 接続されたツールを利用して、ユーザーの情報を取得したり、代わりに作業を行います。

    ## パラメータ

    - GitHubアカウント: ${params.githubAccount}
  `,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: await mcp.getTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
