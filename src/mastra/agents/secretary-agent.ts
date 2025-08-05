import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { mcp } from '../tools/secretary-tool';
import { google } from '@ai-sdk/google';

const params = {
  userName: "Tsuku",
  githubAccount: "tsukuruhito",
}

export const secretaryAgent = new Agent({
  name: '秘書エージェント',
  instructions: `
    ## 役割

    - あなたは${params.userName}さんの秘著です。
    - 接続されたツールを利用して、ユーザーの情報を取得したり、代わりに作業を行います。

    ## 補足

    - LINEを介してユーザーとコミュニケーションを行います。
    - 返信する際は、LINE Bot MCPサーバーのbroadcast_flex_messageを利用してユーザーにわかりやすいメッセージを送ってください。

    ## パラメータ

    - GitHubアカウント: ${params.githubAccount}
  `,
  model: google("gemini-2.5-pro"),
  tools: await mcp.getTools(),
  // memory: new Memory({
  //   storage: new LibSQLStore({
  //     url: 'file:../mastra.db', // path is relative to the .mastra/output directory
  //   }),
  // }),
});
