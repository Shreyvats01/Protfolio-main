export const siteConfig = {
  name: "Shrey Vats",
  monogram: "SV",
  handle: "shreyvats01",
  role: "Rust, Backend & Solana Developer",
  heroIntro:
    "I'm Shrey Vats. I build software with Rust, TypeScript, and tools from the Solana ecosystem. I'm interested in how systems work under the surface.",
  aboutPreview:
    "I spend most of my time writing Rust and TypeScript, building backend services, and testing ideas on Solana. When I work with a framework or protocol, I like reading the underlying code to see how state, network I/O, and errors are actually handled.",
  contactIntro:
    "If you want to talk about Rust, Solana, backend projects, or anything in my repositories, send me an email or reach out on GitHub or X.",
  location: "India",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://shrey.online",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@shrey.online",
    portalUrl:
      process.env.NEXT_PUBLIC_CONTACT_URL || "https://contact.shrey.online",
    mailEndpoint:
      process.env.NEXT_PUBLIC_MAIL_ENDPOINT || "https://mail.shrey.online",
  },
  socials: {
    github: "https://github.com/shreyvats01",
    x: "https://x.com/shreyvats01",
    linkedin: "https://linkedin.com/in/shreyvats01",
  },
  aboutBio: [
    "I'm a developer from India focused on Rust, backend services, and Solana programs. I started programming because I wanted to understand how software works below high-level abstractions—how bytes are stored, how servers manage concurrent connections, and how on-chain programs validate state.",
    "Most of my learning comes from building small, focused projects from scratch. Writing Rust and working with the Solana runtime forces me to think clearly about data ownership, account permissions, and failure cases before code ever runs.",
    "Right now I'm exploring async Rust networking, Solana program architecture with Anchor and SPL tokens, and relational database design with PostgreSQL.",
  ],
  skillGroups: [
    {
      title: "Systems and Rust",
      description:
        "Writing command-line tools, async workers, and network services in Rust.",
      skills: ["Rust", "Tokio", "Serde", "Cargo", "Linux"],
    },
    {
      title: "Backend development",
      description:
        "Building HTTP APIs, WebSocket servers, and relational schemas.",
      skills: ["PostgreSQL", "SQLx", "Node.js", "WebSockets", "REST APIs"],
    },
    {
      title: "Solana and smart contracts",
      description:
        "Writing on-chain programs, token vaults, and client transaction builders.",
      skills: ["Solana", "Anchor", "SPL Token", "PDAs & CPI", "web3.js"],
    },
    {
      title: "Frontend and developer tools",
      description:
        "Creating web interfaces for developer tools and on-chain apps.",
      skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Git"],
    },
  ],
  workingHabits: [
    {
      title: "Building to understand",
      description:
        "When I want to learn a standard like ERC-4626 or a protocol like WebSockets, I build a working implementation to see where the edge cases are.",
      projectSlug: "solana-programs",
      projectLabel: "Solana Programs",
    },
    {
      title: "Keeping state explicit",
      description:
        "I prefer compile-time SQL checks and explicit account validation over hidden magic, so bugs surface early.",
      projectSlug: "wiki-backend",
      projectLabel: "Wiki Backend",
    },
    {
      title: "Reading source code",
      description:
        "Studying open-source crates and Solana programs helps me write simpler, more idiomatic Rust.",
      projectSlug: "lemon",
      projectLabel: "Lemon",
    },
  ],
} as const;
