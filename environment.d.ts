declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINE_CHANNEL_ACCESS_TOKEN: string | undefined;
      LINE_CHANNEL_SECRET: string | undefined;
      PORT: string | undefined;
      NOTION_API_KEY: string | undefined;
    }
  }
}

export {};
