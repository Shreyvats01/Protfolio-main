export const siteConfig = {
  name: "Shrey Vats",
  monogram: "SV",
  handle: "shreyvats01",
  role: "Rust, Backend Systems & Solana Developer",
  headline:
    "Building low-level software, resilient backend services, and on-chain programs on Solana.",
  intro:
    "I’m Shrey Vats, a developer exploring Rust, backend systems, and Solana. I like understanding what happens beneath abstractions—from memory layout and async I/O to deterministic account state—and building software around that understanding.",
  currentFocus:
    "Currently exploring Solana account runtime mechanics, zero-copy deserialization in Rust, and high-concurrency backend pipelines.",
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
  domains: [
    {
      index: "01",
      title: "Systems & Rust Engineering",
      summary:
        "Writing predictable, memory-safe services and CLI tooling with explicit error boundaries, async runtime discipline, and minimal allocation overhead.",
      stack: ["Rust", "Tokio", "Async I/O", "Serde", "Memory Layout", "Linux"],
    },
    {
      index: "02",
      title: "Solana Protocol Development",
      summary:
        "Designing deterministic on-chain programs using Program Derived Addresses (PDAs), Cross-Program Invocations (CPIs), and strict account validation.",
      stack: [
        "Solana SVM",
        "Anchor",
        "SPL Token-2022",
        "ERC-4626 Vaults",
        "PDAs & CPI",
        "web3.js",
      ],
    },
    {
      index: "03",
      title: "Backend & Distributed State",
      summary:
        "Architecting real-time WebSocket pipelines, relational schemas, and transactional APIs that stay consistent under concurrent client load.",
      stack: [
        "PostgreSQL",
        "SQLx",
        "WebSockets",
        "TypeScript",
        "Node.js",
        "Next.js",
      ],
    },
  ],
  principles: [
    {
      title: "Read beneath the abstraction",
      body: "Frameworks accelerate delivery, but debugging latency spikes or state corruption requires knowing how the underlying runtime, database engine, or VM actually executes instructions.",
    },
    {
      title: "Explicit invariants over implicit trust",
      body: "Whether validating Solana account ownership on-chain or enforcing relational constraints in PostgreSQL, state transitions should verify invariants at the boundary.",
    },
    {
      title: "Learn by shipping working systems",
      body: "Every repository is an exercise in turning protocol specifications and systems concepts into inspectable, working software with clear trade-offs.",
    },
  ],
} as const;
