import { PinoLogger } from "@mastra/loggers";
import { MCPClient } from "@mastra/mcp";

export const mcp = new MCPClient({
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PAT}`,
        },
      },
    }
  },
});
