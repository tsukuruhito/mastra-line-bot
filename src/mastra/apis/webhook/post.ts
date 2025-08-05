import { messagingApi, WebhookEvent, validateSignature } from '@line/bot-sdk';
import { registerApiRoute } from "@mastra/core/server";
import { PinoLogger } from '@mastra/loggers';

const logger = new PinoLogger({
  name: 'src/mastra/tools/secretary-tool.ts',
  level: 'debug',
});

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: (process.env.LINE_CHANNEL_ACCESS_TOKEN || "").replace(/^["']|["']$/g, ''),
});

export const route = registerApiRoute("/webhook", {
  method: "POST",
  handler: async (c) => {
    try {
      // LINE署名検証
      let channelSecret = process.env.LINE_CHANNEL_SECRET;
      if (!channelSecret) {
        logger.error("LINE_CHANNEL_SECRET is not set");
        return c.json({ error: "Channel secret not configured" }, 500);
      }
      
      // 環境変数から引用符を除去（.envファイルで引用符が含まれている場合があるため）
      channelSecret = channelSecret.replace(/^["']|["']$/g, '');

      // リクエストボディを文字列として取得（署名検証のため）
      const body = await c.req.text();
      
      // 署名を取得
      const signature = c.req.header("x-line-signature");
      if (!signature) {
        logger.error("No signature provided");
        return c.json({ error: "No signature" }, 400);
      }

      // LINE SDKを使用した署名検証
      if (!validateSignature(body, channelSecret, signature)) {
        logger.error("Invalid signature");
        return c.json({ error: "Invalid signature" }, 401);
      }

      logger.debug("署名検証に成功しました");

      const mastra = c.get("mastra");
      const agent = await mastra.getAgent("secretaryAgent");

      // JSONとしてパース
      const parsedBody = JSON.parse(body);
      const events: WebhookEvent[] = parsedBody.events;

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
      c.executionCtx.waitUntil(Promise.all(promises));
    } catch (err) {
      logger.error(`Webhook処理中にエラーが発生しました: ${err}`);
      return c.json({ error: "Internal server error" }, 500);
    }

    return c.json({ message: "ok" });
  },
});
