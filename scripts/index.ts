import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import chalk from "chalk";
import boxen from "boxen";
import { z } from "zod";
import * as fs from "fs";
import { invoke } from "braintrust";
import StagehandConfig from "../stagehand.config.js";

/**
 * 🤘 Welcome to Stagehand! Thanks so much for trying us out!
 * 🛠️ CONFIGURATION: stagehand.config.ts will help you configure Stagehand
 *
 * 📝 Check out our docs for more fun use cases, like building agents
 * https://docs.stagehand.dev/
 *
 * 💬 If you have any feedback, reach out to us on Slack!
 * https://stagehand.dev/slack
 *
 * 📚 You might also benefit from the docs for Zod, Browserbase, and Playwright:
 * - https://zod.dev/
 * - https://docs.browserbase.com/
 * - https://playwright.dev/docs/intro
 */
async function main({
  page,
  context,
  stagehand,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
}) {
  const pages = [
    {
      pageName: "about me",
      constName: "aboutMe",
    },
    {
      pageName: "quick links",
      constName: "quickLinks",
    },
    {
      pageName: "principles",
      constName: "principles",
    },
    {
      pageName: "bookmarks",
      constName: "bookmarks",
    },
    {
      pageName: "fav spots",
      constName: "favSpots",
    },
    {
      pageName: "fav products",
      constName: "favProducts",
    },
    {
      pageName: "on repeat",
      constName: "music",
    },
    {
      pageName: "reading list",
      constName: "readingList",
    },
    {
      pageName: "inspo",
      constName: "inspiration",
    },
    {
      pageName: "groceries",
      constName: "groceries",
    },
  ];

  // Navigate to Alana's website
  await page.goto("https://alanagoyal.com");
  await page.waitForTimeout(2000);

  // Create an object to store all the data
  const data: Record<string, any> = {};

  // Process each page
  for (const pageInfo of pages) {
    try {
      console.log(chalk.yellow(`Processing "${pageInfo.pageName}"`));

      // Navigate to the page
      await page.act(`Click the navigation link for "${pageInfo.pageName}"`);
      await page.waitForTimeout(1000);

      // Extract content based on the page type
      const { content } = await page.extract({
        instruction: `Extract the content in the body of the ${pageInfo.pageName} page.`,
        schema: z.object({
          content: z.array(
            z.object({
              content: z.string(),
            })
          ),
        }),
      });

      // Store the content
      data[pageInfo.constName] = content;
      console.log(
        chalk.green(`Successfully extracted ${content.length} content items`)
      );
    } catch (error: any) {
      console.error(chalk.red(`Error processing "${pageInfo.pageName}" page:`));
      console.error(chalk.red(`${error?.message || String(error)}`));

      // Continue with next page even if this one fails
      continue;
    }
  }

  // Write the data to a file
  const outputPath = "./src/mastra/data/personal.ts";
  console.log(chalk.blue("Saving extracted data"));

  let fileContent = "// Generated from alanagoyal.com\n\n";

  // Convert each page's data into a constant
  for (const [constName, content] of Object.entries(data)) {
    // Clean the content through braintrust
    const cleanedContent = await Promise.all(
      content.map(async (item: { content: string }) => {
        const result = await invoke({
          projectName: "mcp",
          slug: "clean-const-2c95",
          input: { content: item.content },
          schema: z.object({
            cleanedContent: z.string(),
          }),
        });
        return { content: result.cleanedContent };
      })
    );

    fileContent += `export const ${constName} = ${JSON.stringify(
      cleanedContent,
      null,
      2
    )};\n\n`;
  }

  try {
    fs.writeFileSync(outputPath, fileContent);
    console.log(chalk.green(`Data successfully written to ${outputPath}`));
    console.log(`File size: ${(fileContent.length / 1024).toFixed(2)}KB`);
  } catch (error: any) {
    console.error(chalk.red(`Error saving data to file:`));
    console.error(chalk.red(`${error?.message || String(error)}`));
  }
}

/**
 * This is the main function that runs when you do npm run start
 *
 * YOU PROBABLY DON'T NEED TO MODIFY ANYTHING BELOW THIS POINT!
 *
 */
async function run() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
  });
  await stagehand.init();

  if (StagehandConfig.env === "BROWSERBASE" && stagehand.browserbaseSessionID) {
    console.log(
      boxen(
        `View this session live in your browser: \n${chalk.blue(
          `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`
        )}`,
        {
          title: "Browserbase",
          padding: 1,
          margin: 3,
        }
      )
    );
  }

  const page = stagehand.page;
  const context = stagehand.context;
  await main({
    page,
    context,
    stagehand,
  });
  await stagehand.close();
  console.log(
    `\n🤘 Thanks so much for using Stagehand! Reach out to us on Slack if you have any feedback: ${chalk.blue(
      "https://stagehand.dev/slack"
    )}\n`
  );
}

run();
