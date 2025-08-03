import { Mastra } from "@mastra/core";
import { Handler } from "hono";

export const hander: Handler<{ Variables: { mastra: Mastra } }> = async (c) => {
  const mastra = c.get("mastra");
  const weatherAgent = await mastra.getAgent("weatherAgent");

  const forecast = await weatherAgent.generate("東京の天気は？");

  return c.json({ message: forecast.text });
};
