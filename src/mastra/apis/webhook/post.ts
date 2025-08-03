import { messagingApi, WebhookEvent } from '@line/bot-sdk';
import { registerApiRoute } from "@mastra/core/server";
import { PinoLogger } from '@mastra/loggers';

const logger = new PinoLogger({
  name: 'src/mastra/tools/secretary-tool.ts',
  level: 'debug',
});

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
});

export const route = registerApiRoute("/webhook", {
  method: "POST",
  handler: async (c) => {
    try {
      const mastra = c.get("mastra");
      const agent = await mastra.getAgent("secretaryAgent");

      const body = await c.req.json();
      const events: WebhookEvent[] = body.events;

      const promises = events.map(async (event: WebhookEvent) => {
        if (event.type !== "message" || event.message.type !== "text") {
          return Promise.resolve(null);
        }

        logger.debug(`受信メッセージ: ${event.message.text}`);

        let text = "";
        try {
          const result = await agent.generate(event.message.text);
          text = result.text;
        } catch (err) {
          text = `エージェントの処理中にエラーが発生しました。(${err})`;
        }
        logger.debug(`返信メッセージ: ${text}`);

        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: "text", text }],
        });
      });

      await Promise.all(promises);
    } catch (err) {
      logger.error(`Webhook処理中にエラーが発生しました: ${err}`);
    }

    return c.json({ message: "ok" });
  },
});
