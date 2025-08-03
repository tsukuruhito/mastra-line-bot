import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { tools } from '../tools/secretary-tool';

export const secretaryAgent = new Agent({
  name: '秘書エージェント',
  instructions: ``,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
