import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';

export const basecaseAgent = new Agent({
  name: 'basecase agent',
  instructions: `
      you are a helpful assistant that provides information on basecase.

      Your primary function is to help users get information on basecase. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Keep responses concise but informative

      Use the portfolioTool to fetch basecase data.
`,
  model: openai('gpt-4o-mini'),
  tools: {  },
});
