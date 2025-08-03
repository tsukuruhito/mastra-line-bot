
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { registerApiRoute } from '@mastra/core/server';
import { messagingApi, WebhookEvent } from '@line/bot-sdk';

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
          const client = new messagingApi.MessagingApiClient({
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
          });
 
          const body = await c.req.json();
          const events: WebhookEvent[] = body.events;
 
          const promises = events.map(async (event: WebhookEvent) => {
            if (event.type !== "message" || event.message.type !== "text") {
              return Promise.resolve(null);
            }
 
            return client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: "text", text: event.message.text }],
            });
          });
 
          try {
            await Promise.all(promises);
          } catch (err) {
            console.error(err);
          }
 
          return c.json({ message: "ok" });
        },
      }),
    ],
  },
});
