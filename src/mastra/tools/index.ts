import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { howIWork, portfolio, whoIWorkWith } from '../data/basecase';
import { quotes } from '../data/basecase';
import { aboutMe, quickLinks, principles, bookmarks, readingList, music, inspiration, favSpots, favProducts, groceries } from '../data/personal';

interface GitHubRepo {
  full_name: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

export const howIWorkTool = createTool({
  id: 'how-i-work',
  description: 'get a list of how i work',
  inputSchema: z.object({}),
  outputSchema: z.object({
    howIWork: z.array(z.string()),
  }),
  execute: async () => {
    return { howIWork };
  },
});

export const whoIWorkWithTool = createTool({
  id: 'who-i-work-with',
  description: 'get a list of people i work with',
  inputSchema: z.object({}),
  outputSchema: z.object({
    whoIWorkWith: z.array(z.string()),
  }),
  execute: async () => {
    return { whoIWorkWith };
  },
});

export const getPortfolioCompaniesTool = createTool({
  id: 'get-portfolio-companies',
  description: 'get a list of all companies in the basecase portfolio',
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
  description: 'get detailed metadata for a specific portfolio company',
  inputSchema: z.object({
    company: z.string().describe('company name'),
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
      throw new Error(`company "${context.company}" not found in portfolio`);
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
  description: 'get quotes from founders in the basecase portfolio',
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

export const getGitCommitHistoryTool = createTool({
  id: 'get-git-commit-history',
  description: 'fetch recent git commit history from github repositories',
  inputSchema: z.object({}),
  outputSchema: z.object({
    commits: z.array(z.object({
      id: z.string(),
      message: z.string(),
      repo: z.string(),
      timestamp: z.date(),
    })),
  }),
  execute: async () => {
    try {
      const response = await fetch(
        "https://api.github.com/user/repos?per_page=100",
        {
          headers: {
            Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`github api responded with status ${response.status}`);
      }

      const repos = await response.json();

      if (!Array.isArray(repos)) {
        throw new Error("github api did not return an array of repositories");
      }

      const allCommits = await Promise.all(
        repos.map(async (repo: GitHubRepo) => {
          try {
            const commitsResponse = await fetch(
              `https://api.github.com/repos/${repo.full_name}/commits?per_page=25`,
              {
                headers: {
                  Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                  Accept: "application/vnd.github.v3+json",
                },
              }
            );

            if (!commitsResponse.ok) {
              console.warn(
                `failed to fetch commits for ${repo.full_name}:`,
                await commitsResponse.json()
              );
              return [];
            }

            const commits = await commitsResponse.json();
            return commits.map((commit: GitHubCommit) => ({
              id: commit.sha,
              message: commit.commit.message.toLowerCase(),
              repo: repo.full_name.toLowerCase(),
              timestamp: new Date(commit.commit.author.date),
            }));
          } catch (error) {
            console.warn(`error fetching commits for ${repo.full_name}:`, error);
            return [];
          }
        })
      );

      const flattenedCommits = allCommits
        .flat()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 25);

      return { commits: flattenedCommits };
    } catch (err) {
      console.error("error fetching commits:", err);
      throw new Error("failed to load commit history");
    }
  },
});

export const aboutMeTool = createTool({
  id: 'about-me',
  description: "get information about alana's current and previous roles",
  inputSchema: z.object({}),
  outputSchema: z.object({
    aboutMe: z.array(z.object({
      title: z.string(),
      description: z.array(z.string())
    }))
  }),
  execute: async () => {
    return { aboutMe };
  },
});

export const quickLinksTool = createTool({
  id: 'quick-links',
  description: "get alana's social media and contact information",
  inputSchema: z.object({}),
  outputSchema: z.object({
    quickLinks: z.array(z.object({
      platform: z.string(),
      description: z.string(),
      url: z.string()
    }))
  }),
  execute: async () => {
    return { quickLinks };
  },
});

export const principlesTool = createTool({
  id: 'principles',
  description: "get alana's guiding principles and values",
  inputSchema: z.object({}),
  outputSchema: z.object({
    principles: z.array(z.string())
  }),
  execute: async () => {
    return { principles };
  },
});

export const bookmarksTool = createTool({
  id: 'bookmarks',
  description: "get alana's favorite quotes and their sources",
  inputSchema: z.object({}),
  outputSchema: z.object({
    bookmarks: z.array(z.object({
      quote: z.string(),
      author: z.string(),
      source: z.string().optional(),
      link: z.string().optional()
    }))
  }),
  execute: async () => {
    return { bookmarks };
  },
});

export const readingListTool = createTool({
  id: 'reading-list',
  description: "get alana's current, upcoming, and completed books",
  inputSchema: z.object({}),
  outputSchema: z.object({
    readingList: z.object({
      currentlyReading: z.array(z.object({
        title: z.string(),
        author: z.string(),
        url: z.string(),
        status: z.string()
      })),
      upNext: z.array(z.object({
        title: z.string(),
        author: z.string(),
        url: z.string(),
        status: z.string()
      })),
      completed2025: z.array(z.object({
        title: z.string(),
        author: z.string(),
        url: z.string(),
        status: z.string()
      })),
      completed2024: z.array(z.object({
        title: z.string(),
        author: z.string(),
        url: z.string(),
        status: z.string()
      }))
    })
  }),
  execute: async () => {
    return { readingList };
  },
});

export const musicTool = createTool({
  id: 'music',
  description: "get alana's music preferences by genre and current favorites",
  inputSchema: z.object({}),
  outputSchema: z.object({
    music: z.object({
      currentFavorites: z.array(z.object({
        artist: z.string(),
        title: z.string(),
        genre: z.string().optional(),
        url: z.string()
      })),
      electronic: z.array(z.object({
        artist: z.string(),
        title: z.string().optional(),
        url: z.string().optional()
      })),
      hiphop: z.array(z.object({
        artist: z.string(),
        genre: z.string().optional()
      })),
      country: z.array(z.object({
        artist: z.string(),
        note: z.string().optional()
      }))
    })
  }),
  execute: async () => {
    return { music };
  },
});

export const inspirationTool = createTool({
  id: 'inspiration',
  description: "get list of people, places, and things that inspire alana",
  inputSchema: z.object({}),
  outputSchema: z.object({
    inspiration: z.object({
      people: z.array(z.object({
        name: z.string(),
        occupation: z.string(),
        url: z.string()
      })),
      places: z.array(z.object({
        name: z.string(),
        url: z.string()
      })),
      things: z.array(z.object({
        name: z.string(),
        creator: z.string().optional(),
        url: z.string()
      }))
    })
  }),
  execute: async () => {
    return { inspiration };
  },
});

export const favSpotsTool = createTool({
  id: 'fav-spots',
  description: "get alana's favorite restaurants and coffee shops in sf and nyc",
  inputSchema: z.object({}),
  outputSchema: z.object({
    favSpots: z.object({
      sf: z.object({
        coffee: z.array(z.object({
          name: z.string(),
          url: z.string()
        }))
      }),
      nyc: z.object({
        coffeeBakeries: z.array(z.object({
          name: z.string(),
          url: z.string()
        })),
        restaurants: z.array(z.object({
          name: z.string(),
          url: z.string()
        }))
      })
    })
  }),
  execute: async () => {
    return { favSpots };
  },
});

export const favProductsTool = createTool({
  id: 'fav-products',
  description: "get alana's favorite products for development, productivity and other categories",
  inputSchema: z.object({}),
  outputSchema: z.object({
    favProducts: z.object({
      development: z.array(z.object({
        name: z.string(),
        description: z.string(),
        url: z.string()
      })),
      productivity: z.array(z.object({
        name: z.string(),
        description: z.string(),
        url: z.string()
      })),
      other: z.array(z.object({
        name: z.string(),
        description: z.string(),
        url: z.string(),
        instructors: z.array(z.object({
          name: z.string(),
          url: z.string()
        })).optional()
      }))
    })
  }),
  execute: async () => {
    return { favProducts };
  },
});

export const groceriesTool = createTool({
  id: 'groceries',
  description: "get alana's favorite grocery items by category",
  inputSchema: z.object({}),
  outputSchema: z.object({
    groceries: z.object({
      favorites: z.object({
        fruits: z.array(z.string()),
        dairy: z.array(z.string()),
        cheese: z.array(z.string()),
        proteins: z.array(z.string()),
        other: z.array(z.string()),
        drinks: z.array(z.string())
      })
    })
  }),
  execute: async () => {
    return { groceries };
  },
});