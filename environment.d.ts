declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHANNEL_ACCESS_TOKEN: string | undefined;
      CHANNEL_SECRET: string | undefined;
      PORT: string | undefined;
    }
  }
}

export {};
