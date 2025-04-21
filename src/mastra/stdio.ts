#!/usr/bin/env node

import { MCPServer } from "@mastra/mcp";
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
} from './tools/index.js';

const server = new MCPServer({
  name: "alanagoyal",
  version: "1.0.9",
  tools: { 
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
  },
});

server.startStdio().catch((error) => {
  console.error("Error running MCP server:", error);
  process.exit(1);
});
