import { PinoLogger } from "@mastra/loggers";
import { MiddlewareHandler } from "hono";

const logger = new PinoLogger({
  name: 'Default',
  level: 'info',
});

export const process: MiddlewareHandler = async (c, next) => {
  if (['/api/telemetry', '/__refresh', '/refresh-events'].reduce((acc, path) => acc || c.req.url.includes(path), false)) {
    return next();
  }

  logger.info(`[START] ${c.req.method} ${c.req.url}`);
  await next();
  logger.info(`[END  ] ${c.req.method} ${c.req.url}`);
};