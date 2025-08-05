declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINE_CHANNEL_ACCESS_TOKEN: string | undefined;
      LINE_CHANNEL_SECRET: string | undefined;
      PORT: string | undefined;
      GITHUB_PAT: string | undefined;
    }
  }
}

export {};
