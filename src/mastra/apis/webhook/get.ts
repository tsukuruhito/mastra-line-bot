import { registerApiRoute } from "@mastra/core/server";

export const route = registerApiRoute("/webhook", {
  method: "GET",
  handler: async (c) => {
    const mastra = c.get("mastra");
    const weatherAgent = await mastra.getAgent("weatherAgent");

    const forecast = await weatherAgent.generate("東京の天気は？");

    return c.json({ message: forecast.text });
  },
});
