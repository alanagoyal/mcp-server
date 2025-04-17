import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { portfolio } from '../data/portfolio';
import { quotes } from '../data/quotes';

export const getPortfolioCompaniesTool = createTool({
  id: 'get-portfolio-companies',
  description: 'Get a list of all companies in the Basecase portfolio',
  inputSchema: z.object({}),
  outputSchema: z.object({
    companies: z.array(z.string()),
  }),
  execute: async () => {
    const companies = portfolio.map(company => company.title);
    return { companies };
  },
});

export const getCompanyMetadataTool = createTool({
  id: 'get-company-metadata',
  description: 'Get detailed metadata for a specific portfolio company',
  inputSchema: z.object({
    company: z.string().describe('Company name'),
  }),
  outputSchema: z.object({
    icon: z.string(),
    description: z.string(),
    url: z.string(),
    status: z.string().nullable(),
  }),
  execute: async ({ context }) => {
    const companyData = portfolio.find(c => c.title.toLowerCase() === context.company.toLowerCase());
    if (!companyData) {
      throw new Error(`Company "${context.company}" not found in portfolio`);
    }
    return {
      icon: companyData.icon,
      description: companyData.description,
      url: companyData.url,
      status: companyData.status,
    };
  },
});

export const getFounderAllQuotesTool = createTool({
  id: 'get-founder-quotes',
  description: 'Get quotes from founders in the Basecase portfolio',
  inputSchema: z.object({}),
  outputSchema: z.object({
    quotes: z.array(z.object({
      text: z.string(),
      author: z.string(),
      title: z.string(),
      company: z.string(),
      url: z.string(),
    })),
  }),
  execute: async () => {
    return { quotes };
  },
});
