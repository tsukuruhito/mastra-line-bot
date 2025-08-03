
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { registerApiRoute } from '@mastra/core/server';
import { hander as handerAsGet } from './apis/webhook/get';
import { hander as handerAsPost } from './apis/webhook/post';

const logger = new PinoLogger({
  name: 'Default',
  level: 'info',
});

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
      registerApiRoute("/webhook", {
        method: "GET",
        handler: handerAsGet,
      }),
      registerApiRoute("/webhook", {
        method: "POST",
        handler: handerAsPost,
      }),
    ],
    middleware: [
      async (c, next) => {
        if (['/api/telemetry', '/__refresh', '/refresh-events'].reduce((acc, path) => acc || c.req.url.includes(path), false)) {
          return next();
        }

        logger.info(`[START] ${c.req.method} ${c.req.url}`);
        await next();
        logger.info(`[END  ] ${c.req.method} ${c.req.url}`);
      },
    ],
  },
});
