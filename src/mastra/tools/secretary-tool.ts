import { PinoLogger } from "@mastra/loggers";
import { MCPClient } from "@mastra/mcp";

const logger = new PinoLogger({
  name: 'src/mastra/tools/secretary-tool.ts',
  level: 'info',
});

logger.info(`NOTION_API_KEY: ${process.env.NOTION_API_KEY}`);

const mcp = new MCPClient({
  servers: {
    notion: {
      command: "npx",
      args: ["-y", "@notionhq/notion-mcp-server"],
      env: {
        NOTION_TOKEN: process.env.NOTION_API_KEY || "",
      }
      // url: new URL("https://mcp.notion.com/mcp"),
      // requestInit: {
      //   headers: {
      //     Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      //   },
      // }
    },
    sequential: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
  },
});

export const tools = await mcp.getTools();
