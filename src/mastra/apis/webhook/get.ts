import { registerApiRoute } from "@mastra/core/server";

export const route = registerApiRoute("/webhook", {
  method: "GET",
  handler: async (c) => {
    const mastra = c.get("mastra");
    const agent = await mastra.getAgent("secretaryAgent");

    const { text } = await agent.generate("テニスに関するページを取得して");

    return c.json({ message: text });
  },
});
