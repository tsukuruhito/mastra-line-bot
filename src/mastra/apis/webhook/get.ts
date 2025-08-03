import { registerApiRoute } from "@mastra/core/server";

export const route = registerApiRoute("/webhook", {
  method: "GET",
  handler: async (c) => {
    const input = c.req.query("input");

    if (!input) {
      return c.json({ message: "GET /webhook OK" });
    }

    const mastra = c.get("mastra");
    const agent = await mastra.getAgent("secretaryAgent");
    const { text } = await agent.generate(input);

    return c.json({ message: text });
  },
});
