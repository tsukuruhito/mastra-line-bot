
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { registerApiRoute } from '@mastra/core/server';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    apiRoutes: [
      registerApiRoute("/", {
        method: "GET",
        handler: async (c) => {
          // const mastra = c.get("mastra");
          // const agents = await mastra.getAgent("my-agent");
 
          return c.json({ message: "GET / Hello, world!" });
        },
      }),
      registerApiRoute("/webhook", {
        method: "POST",
        handler: async (c) => {
          // const mastra = c.get("mastra");
          // const agents = await mastra.getAgent("my-agent");
 
          return c.json({ message: "POST /webhook Hello, world!" });
        },
      }),
    ],
  },
});
