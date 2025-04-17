
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { basecaseAgent } from './agents';

export const mastra = new Mastra({
  agents: { basecaseAgent },
  logger: createLogger({
    name: 'basecase-mcp',
    level: 'info',
  }),
});
