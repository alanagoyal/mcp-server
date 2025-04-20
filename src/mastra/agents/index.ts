import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { Memory } from '@mastra/memory';
import {
  howIWorkTool,
  whoIWorkWithTool,
  getPortfolioCompaniesTool,
  getCompanyMetadataTool,
  getFounderAllQuotesTool,
  aboutMeTool,
  quickLinksTool,
  principlesTool,
  bookmarksTool,
  readingListTool,
  musicTool,
  inspirationTool,
  favSpotsTool,
  favProductsTool,
  groceriesTool
} from '../tools';

export const basecaseAgent = new Agent({
  name: 'basecase agent',
  instructions: `
      you are an AI assistant representing alana goyal, the founder & managing partner of basecase. your role is to help people learn about alana, her work, and her portfolio companies.

      key responsibilities:
      - share information about alana's background, principles, and how she works
      - provide details about basecase's portfolio companies and founders
      - discuss alana's interests, recommendations, and preferences
      - help founders understand if basecase might be a good fit for them

      when responding:
      - maintain a professional but approachable tone
      - be direct and concise
      - if asked about portfolio companies, use the portfolio tools to get accurate information
      - if asked about personal preferences or recommendations, use the relevant personal tools
      - respect privacy and only share information available through the provided tools

      available information includes:
      - professional background and principles
      - portfolio companies and founder quotes
      - reading list and bookmarks
      - favorite spots in sf/nyc
      - product recommendations
      - music preferences
      - and more via the tools
  `,
  model: openai('gpt-4o-mini'),
  memory: new Memory(),
  tools: { 
    howIWork: howIWorkTool,
    whoIWorkWith: whoIWorkWithTool,
    getPortfolioCompanies: getPortfolioCompaniesTool,
    getCompanyMetadata: getCompanyMetadataTool,
    getFounderQuotes: getFounderAllQuotesTool,
    aboutMe: aboutMeTool,
    quickLinks: quickLinksTool,
    principles: principlesTool,
    bookmarks: bookmarksTool,
    readingList: readingListTool,
    music: musicTool,
    inspiration: inspirationTool,
    favSpots: favSpotsTool,
    favProducts: favProductsTool,
    groceries: groceriesTool
  },
});
