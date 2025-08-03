import { messagingApi, WebhookEvent } from '@line/bot-sdk';
import { registerApiRoute } from "@mastra/core/server";

export const route = registerApiRoute("/webhook", {
  method: "POST",
  handler: async (c) => {
    const mastra = c.get("mastra");
    const weatherAgent = await mastra.getAgent("weatherAgent");

    const client = new messagingApi.MessagingApiClient({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "",
    });

    const body = await c.req.json();
    const events: WebhookEvent[] = body.events;

    const promises = events.map(async (event: WebhookEvent) => {
      if (event.type !== "message" || event.message.type !== "text") {
        return Promise.resolve(null);
      }

      const { text } = await weatherAgent.generate(event.message.text);

      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: "text", text }],
      });
    });

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }

    return c.json({ message: "ok" });
  },
});
