const GITHUB_USERNAME = "shreyvats01";
const REPO_SLUG_REGEX = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type PullRequestNode = {
  title: string;
  url: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  createdAt: string;
  repository: {
    nameWithOwner: string;
  };
};

export type RepoMetadata = {
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string | null;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: Array<{
    name: string;
    color: string;
  }>;
};

export type GithubPortfolioData = {
  status: "authenticated" | "public_fallback" | "unavailable";
  statusMessage: string;
  stats: {
    prs: number | null;
    contributions: number | null;
    repos: number | null;
    stars: number | null;
  };
  weeks: ContributionWeek[];
  openPrs: PullRequestNode[];
  closedPrs: PullRequestNode[];
  mergedPrs: PullRequestNode[];
  repoMap: Record<string, RepoMetadata>;
  discoveredRepos: RepoMetadata[];
};

const LANGUAGE_COLORS: Record<string, string> = {
  Rust: "#dea584",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Solidity: "#AA6746",
  Python: "#3572A5",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
};

export function isValidRepoSlug(slug: string): boolean {
  return REPO_SLUG_REGEX.test(slug.trim());
}

const USER_PORTFOLIO_QUERY = `
  query GetUserPortfolio($login: String!) {
    user(login: $login) {
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          nameWithOwner
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          pushedAt
          primaryLanguage {
            name
            color
          }
          languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      openPrs: pullRequests(
        states: OPEN
        first: 6
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          title
          url
          state
          createdAt
          repository {
            nameWithOwner
          }
        }
      }
      closedPrs: pullRequests(
        states: CLOSED
        first: 6
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          title
          url
          state
          createdAt
          repository {
            nameWithOwner
          }
        }
      }
      mergedPrs: pullRequests(
        states: MERGED
        first: 6
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          title
          url
          state
          createdAt
          repository {
            nameWithOwner
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

const SINGLE_REPO_QUERY = `
  query GetSingleRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      nameWithOwner
      description
      url
      homepageUrl
      stargazerCount
      forkCount
      pushedAt
      primaryLanguage {
        name
        color
      }
    }
  }
`;

async function fetchPublicRestFallback(
  login: string
): Promise<GithubPortfolioData | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "User-Agent": "shreyvats-portfolio",
    };

    const [userRes, reposRes, prsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(
          login
        )}/repos?per_page=100&type=owner&sort=pushed`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      ),
      fetch(
        `https://api.github.com/search/issues?q=author:${encodeURIComponent(
          login
        )}+type:pr&sort=created&order=desc&per_page=30`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      ),
    ]);

    if (!userRes.ok && !reposRes.ok) {
      return null;
    }

    const userJson = userRes.ok ? await userRes.json() : null;
    const reposJson = reposRes.ok ? await reposRes.json() : [];
    const prsJson = prsRes.ok ? await prsRes.json() : null;

    const nonForkRepos = Array.isArray(reposJson)
      ? reposJson.filter((r: Record<string, unknown>) => !r.fork)
      : [];

    const repoMap: Record<string, RepoMetadata> = {};
    const discoveredRepos: RepoMetadata[] = [];
    let totalStars = 0;

    for (const raw of nonForkRepos) {
      const stars =
        typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0;
      const forks = typeof raw.forks_count === "number" ? raw.forks_count : 0;
      totalStars += stars;

      const langName =
        typeof raw.language === "string" && raw.language ? raw.language : null;
      const primaryLanguage = langName
        ? {
            name: langName,
            color: LANGUAGE_COLORS[langName] || "#A1AAB6",
          }
        : null;

      const fullName =
        typeof raw.full_name === "string"
          ? raw.full_name
          : `${login}/${String(raw.name || "")}`;

      const metadata: RepoMetadata = {
        name: String(raw.name || ""),
        nameWithOwner: fullName,
        description:
          typeof raw.description === "string" ? raw.description : null,
        url:
          typeof raw.html_url === "string"
            ? raw.html_url
            : `https://github.com/${fullName}`,
        homepageUrl:
          typeof raw.homepage === "string" && raw.homepage.trim() !== ""
            ? raw.homepage.trim()
            : null,
        stargazerCount: stars,
        forkCount: forks,
        pushedAt: typeof raw.pushed_at === "string" ? raw.pushed_at : null,
        primaryLanguage,
        languages: primaryLanguage ? [primaryLanguage] : [],
      };

      repoMap[fullName.toLowerCase()] = metadata;
      discoveredRepos.push(metadata);
    }

    const openPrs: PullRequestNode[] = [];
    const closedPrs: PullRequestNode[] = [];
    const mergedPrs: PullRequestNode[] = [];
    let mergedCount: number | null = null;

    if (prsJson && Array.isArray(prsJson.items)) {
      let observedMerged = 0;
      for (const item of prsJson.items) {
        const repoUrl =
          typeof item.repository_url === "string" ? item.repository_url : "";
        const repoParts = repoUrl.split("/repos/");
        const nameWithOwner = repoParts[1] || `${login}/repository`;
        const isMerged = Boolean(item.pull_request?.merged_at);
        const rawState = String(item.state || "").toUpperCase();

        const prState: "OPEN" | "CLOSED" | "MERGED" = isMerged
          ? "MERGED"
          : rawState === "OPEN"
          ? "OPEN"
          : "CLOSED";

        const node: PullRequestNode = {
          title: String(item.title || "Pull Request"),
          url: String(item.html_url || `https://github.com/${nameWithOwner}`),
          state: prState,
          createdAt: String(item.created_at || new Date().toISOString()),
          repository: { nameWithOwner },
        };

        if (prState === "MERGED") {
          observedMerged += 1;
          if (mergedPrs.length < 6) mergedPrs.push(node);
        } else if (prState === "OPEN") {
          if (openPrs.length < 6) openPrs.push(node);
        } else {
          if (closedPrs.length < 6) closedPrs.push(node);
        }
      }
      mergedCount = observedMerged;
    }

    const reposCount =
      nonForkRepos.length > 0
        ? nonForkRepos.length
        : typeof userJson?.public_repos === "number"
        ? userJson.public_repos
        : null;

    return {
      status: "public_fallback",
      statusMessage:
        "Showing live public GitHub data. Configure GITHUB_TOKEN to unlock the 52-week contribution calendar.",
      stats: {
        prs: mergedCount,
        contributions: null, // GraphQL-only field
        repos: reposCount,
        stars: reposRes.ok ? totalStars : null,
      },
      weeks: [],
      openPrs,
      closedPrs,
      mergedPrs,
      repoMap,
      discoveredRepos,
    };
  } catch {
    return null;
  }
}

export async function getGithubPortfolioData(
  username: string = GITHUB_USERNAME
): Promise<GithubPortfolioData> {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "shreyvats-portfolio",
        },
        body: JSON.stringify({
          query: USER_PORTFOLIO_QUERY,
          variables: { login: username },
        }),
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const json = await res.json();
        const user = json?.data?.user;

        if (user && !json.errors) {
          const repoNodes = Array.isArray(user.repositories?.nodes)
            ? user.repositories.nodes
            : [];
          const repoMap: Record<string, RepoMetadata> = {};
          const discoveredRepos: RepoMetadata[] = [];
          let totalStars = 0;

          for (const node of repoNodes) {
            if (!node) continue;
            const stars =
              typeof node.stargazerCount === "number" ? node.stargazerCount : 0;
            const forks =
              typeof node.forkCount === "number" ? node.forkCount : 0;
            totalStars += stars;

            const languages = Array.isArray(node.languages?.edges)
              ? node.languages.edges
                  .map(
                    (edge: {
                      node?: { name?: string; color?: string };
                    }) =>
                      edge?.node?.name
                        ? {
                            name: edge.node.name,
                            color: edge.node.color || "#A1AAB6",
                          }
                        : null
                  )
                  .filter(Boolean)
              : [];

            const nameWithOwner =
              typeof node.nameWithOwner === "string"
                ? node.nameWithOwner
                : `${username}/${String(node.name || "")}`;

            const metadata: RepoMetadata = {
              name: String(node.name || ""),
              nameWithOwner,
              description:
                typeof node.description === "string" ? node.description : null,
              url:
                typeof node.url === "string"
                  ? node.url
                  : `https://github.com/${nameWithOwner}`,
              homepageUrl:
                typeof node.homepageUrl === "string" &&
                node.homepageUrl.trim() !== ""
                  ? node.homepageUrl.trim()
                  : null,
              stargazerCount: stars,
              forkCount: forks,
              pushedAt:
                typeof node.pushedAt === "string" ? node.pushedAt : null,
              primaryLanguage: node.primaryLanguage?.name
                ? {
                    name: node.primaryLanguage.name,
                    color: node.primaryLanguage.color || "#A1AAB6",
                  }
                : null,
              languages,
            };

            repoMap[nameWithOwner.toLowerCase()] = metadata;
            discoveredRepos.push(metadata);
          }

          return {
            status: "authenticated",
            statusMessage: "Synchronized via GitHub GraphQL API (ISR 1h)",
            stats: {
              prs:
                typeof user.mergedPrs?.totalCount === "number"
                  ? user.mergedPrs.totalCount
                  : null,
              contributions:
                typeof user.contributionsCollection?.contributionCalendar
                  ?.totalContributions === "number"
                  ? user.contributionsCollection.contributionCalendar
                      .totalContributions
                  : null,
              repos:
                typeof user.repositories?.totalCount === "number"
                  ? user.repositories.totalCount
                  : discoveredRepos.length,
              stars: totalStars,
            },
            weeks: Array.isArray(
              user.contributionsCollection?.contributionCalendar?.weeks
            )
              ? user.contributionsCollection.contributionCalendar.weeks
              : [],
            openPrs: Array.isArray(user.openPrs?.nodes)
              ? user.openPrs.nodes
              : [],
            closedPrs: Array.isArray(user.closedPrs?.nodes)
              ? user.closedPrs.nodes
              : [],
            mergedPrs: Array.isArray(user.mergedPrs?.nodes)
              ? user.mergedPrs.nodes
              : [],
            repoMap,
            discoveredRepos,
          };
        }
      }
    } catch {
      // Fall through to public REST fallback
    }
  }

  const fallback = await fetchPublicRestFallback(username);
  if (fallback) {
    return fallback;
  }

  return {
    status: "unavailable",
    statusMessage:
      "GitHub API is currently unreachable or rate-limited. Project specifications remain available below.",
    stats: {
      prs: null,
      contributions: null,
      repos: null,
      stars: null,
    },
    weeks: [],
    openPrs: [],
    closedPrs: [],
    mergedPrs: [],
    repoMap: {},
    discoveredRepos: [],
  };
}

// Legacy compatibility wrapper
export async function getGithubStats() {
  return getGithubPortfolioData(GITHUB_USERNAME);
}

export async function getRepoStats(
  repoName: string
): Promise<RepoMetadata | null> {
  if (!repoName || !isValidRepoSlug(repoName)) {
    return null;
  }

  const [owner, name] = repoName.trim().split("/");
  if (!owner || !name) return null;

  const token = process.env.GITHUB_TOKEN?.trim();

  if (token) {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "shreyvats-portfolio",
        },
        body: JSON.stringify({
          query: SINGLE_REPO_QUERY,
          variables: { owner, name },
        }),
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const json = await res.json();
        const repo = json?.data?.repository;
        if (repo && !json.errors) {
          return {
            name: String(repo.name || name),
            nameWithOwner: String(repo.nameWithOwner || `${owner}/${name}`),
            description:
              typeof repo.description === "string" ? repo.description : null,
            url:
              typeof repo.url === "string"
                ? repo.url
                : `https://github.com/${owner}/${name}`,
            homepageUrl:
              typeof repo.homepageUrl === "string" &&
              repo.homepageUrl.trim() !== ""
                ? repo.homepageUrl.trim()
                : null,
            stargazerCount:
              typeof repo.stargazerCount === "number" ? repo.stargazerCount : 0,
            forkCount: typeof repo.forkCount === "number" ? repo.forkCount : 0,
            pushedAt: typeof repo.pushedAt === "string" ? repo.pushedAt : null,
            primaryLanguage: repo.primaryLanguage?.name
              ? {
                  name: repo.primaryLanguage.name,
                  color: repo.primaryLanguage.color || "#A1AAB6",
                }
              : null,
            languages: [],
          };
        }
      }
    } catch {
      // Fall through to public REST endpoint
    }
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(name)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "shreyvats-portfolio",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const raw = await res.json();
    const langName =
      typeof raw.language === "string" && raw.language ? raw.language : null;

    return {
      name: String(raw.name || name),
      nameWithOwner: String(raw.full_name || `${owner}/${name}`),
      description: typeof raw.description === "string" ? raw.description : null,
      url:
        typeof raw.html_url === "string"
          ? raw.html_url
          : `https://github.com/${owner}/${name}`,
      homepageUrl:
        typeof raw.homepage === "string" && raw.homepage.trim() !== ""
          ? raw.homepage.trim()
          : null,
      stargazerCount:
        typeof raw.stargazers_count === "number" ? raw.stargazers_count : 0,
      forkCount: typeof raw.forks_count === "number" ? raw.forks_count : 0,
      pushedAt: typeof raw.pushed_at === "string" ? raw.pushed_at : null,
      primaryLanguage: langName
        ? {
            name: langName,
            color: LANGUAGE_COLORS[langName] || "#A1AAB6",
          }
        : null,
      languages: [],
    };
  } catch {
    return null;
  }
}
