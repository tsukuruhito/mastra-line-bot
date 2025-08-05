import { MCPClient } from "@mastra/mcp";

const GITHUB_PAT = process.env.GITHUB_PAT;
if (!GITHUB_PAT) {
  throw new Error("GITHUB_PATは必須です。");
}

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error("LINE_CHANNEL_ACCESS_TOKENは必須です。");
}

export const mcp = new MCPClient({
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PAT}`,
        },
      },
    },
  },
});
