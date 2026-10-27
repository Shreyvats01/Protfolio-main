import React from "react";
import { ArrowDown } from "lucide-react";

export type DiagramType =
  | "lemon-signer"
  | "solana-vault"
  | "wiki-realtime"
  | "spl-launchpad"
  | "media-pipeline"
  | string;

type MobileStep = {
  step: string;
  title: string;
  detail: string;
  accent?: boolean;
};

const MOBILE_DIAGRAM_STEPS: Record<
  string,
  { header: string; tech: string; steps: MobileStep[] }
> = {
  "lemon-signer": {
    header: "Telegram → Solana RPC",
    tech: "Tokio / Ed25519",
    steps: [
      {
        step: "01 · CHAT",
        title: "Telegram Bot Updates",
        detail: "Receives user commands and transfer parameters from chat.",
      },
      {
        step: "02 · RUST SERVICE",
        title: "Tokio Worker & Tx Builder",
        detail: "Parses commands asynchronously and constructs Solana instructions.",
        accent: true,
      },
      {
        step: "03 · VERIFICATION",
        title: "RPC Simulation & Ed25519 Signer",
        detail: "Runs a pre-flight simulation check before signing with the keypair.",
      },
      {
        step: "04 · NETWORK",
        title: "Solana JSON-RPC Node",
        detail: "Broadcasts the signed transaction to the Solana network.",
      },
    ],
  },
  "solana-vault": {
    header: "Vault & Escrow PDAs",
    tech: "Anchor / SPL Token",
    steps: [
      {
        step: "01 · SIGNER",
        title: "User Token Account",
        detail: "Initiates deposit, withdrawal, or escrow instruction.",
      },
      {
        step: "02 · SOLANA PROGRAM",
        title: "Vault & Escrow PDA Authority",
        detail: "Validates seeds = [b\"vault\", mint.key(), bump] and computes shares.",
        accent: true,
      },
      {
        step: "03 · CPI SETTLEMENT",
        title: "SPL Token Vault & Share Mint",
        detail: "Executes cross-program token transfers and mints or burns vault shares.",
      },
    ],
  },
  "wiki-realtime": {
    header: "WebSockets & SQLx",
    tech: "Rust / PostgreSQL",
    steps: [
      {
        step: "01 · CLIENTS",
        title: "WebSocket Subscribers",
        detail: "Connected peers listening for live task updates and activity feeds.",
      },
      {
        step: "02 · RUST BACKEND",
        title: "HTTP Router & WS Broadcast Rooms",
        detail: "Handles requests, runs compile-time checked SQLx queries, and broadcasts deltas.",
        accent: true,
      },
      {
        step: "03 · DATABASE",
        title: "PostgreSQL Connection Pool",
        detail: "Stores relational task state and community member records.",
      },
    ],
  },
  "spl-launchpad": {
    header: "Token Mint Pipeline",
    tech: "Solana web3.js / SPL",
    steps: [
      {
        step: "01 · WALLET",
        title: "Browser Wallet Adapter",
        detail: "Connects user wallet and configures token decimals and supply.",
      },
      {
        step: "02 · TRANSACTION",
        title: "Atomic Instruction Batch",
        detail: "Bundles account creation, mint initialization, and token minting.",
        accent: true,
      },
      {
        step: "03 · ON-CHAIN",
        title: "SPL Token Program",
        detail: "Initializes the token mint and assigns authority on Solana.",
      },
    ],
  },
  "media-pipeline": {
    header: "Media Processing Queue",
    tech: "Node.js / Streams",
    steps: [
      {
        step: "01 · INPUT",
        title: "Telegram Media Upload",
        detail: "Receives user image or video stream from Telegram.",
      },
      {
        step: "02 · WORKER",
        title: "Queued Stream Compositor",
        detail: "Applies visual effects and merges audio tracks in an async queue.",
        accent: true,
      },
      {
        step: "03 · OUTPUT",
        title: "Processed Media Delivery",
        detail: "Sends the finished file back to chat and cleans up temp buffers.",
      },
    ],
  },
};

function MobileStepStack({
  type,
  title,
}: {
  type: string;
  title: string;
}) {
  const config = MOBILE_DIAGRAM_STEPS[type] || {
    header: title,
    tech: "Architecture",
    steps: [
      {
        step: "01 · INPUT",
        title: "Request Ingress",
        detail: "Validates incoming parameters and state.",
      },
      {
        step: "02 · CORE",
        title: "Execution Pipeline",
        detail: "Processes logic and state transitions.",
        accent: true,
      },
      {
        step: "03 · OUTPUT",
        title: "Finalized State",
        detail: "Commits and returns verified output.",
      },
    ],
  };

  return (
    <div className="sm:hidden rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5 font-mono text-[11px] text-muted-subtle">
        <span className="truncate">{config.header}</span>
        <span className="shrink-0 text-muted-foreground">{config.tech}</span>
      </div>

      <div className="space-y-2">
        {config.steps.map((item, index) => (
          <React.Fragment key={item.step}>
            <div
              className={`rounded-md border p-3 space-y-1 ${
                item.accent
                  ? "border-primary/40 bg-card"
                  : "border-border bg-card"
              }`}
            >
              <span
                className={`block font-mono text-[10px] ${
                  item.accent ? "text-primary" : "text-muted-subtle"
                }`}
              >
                {item.step}
              </span>
              <div className="text-xs font-semibold text-foreground">
                {item.title}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
            {index < config.steps.length - 1 && (
              <div className="flex justify-center py-0.5" aria-hidden="true">
                <ArrowDown className="h-3.5 w-3.5 text-primary/80" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function ProjectDiagram({
  type,
  title,
}: {
  type?: DiagramType;
  title: string;
}) {
  if (!type) return null;

  return (
    <div>
      {/* Mobile (< 640px): Readable Vertical Step Cards */}
      <MobileStepStack type={type} title={title} />

      {/* Tablet & Desktop (>= 640px): Full Horizontal SVG Diagram */}
      <div className="hidden sm:block">
        {type === "lemon-signer" && (
          <div className="w-full rounded-lg border border-border bg-secondary/40 p-5">
            <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted-subtle">
              <span>Architecture · Telegram to Solana RPC</span>
              <span>Tokio / Ed25519</span>
            </div>
            <svg
              viewBox="0 0 640 160"
              role="img"
              aria-label={`Architecture diagram for ${title}: Telegram client sends commands to the Rust Tokio dispatcher, which simulates and signs transactions before sending them to Solana RPC`}
              className="w-full h-auto"
            >
              <defs>
                <marker
                  id="arrow-lime-lemon"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--primary)" />
                </marker>
                <marker
                  id="arrow-muted-lemon"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--muted-subtle)" />
                </marker>
              </defs>

              <rect
                x="12"
                y="40"
                width="124"
                height="80"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="26" y="64" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                01 · CHAT
              </text>
              <text x="26" y="84" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Telegram Bot
              </text>
              <text x="26" y="102" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                User Commands
              </text>

              <line
                x1="136"
                y1="80"
                x2="174"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-lemon)"
              />

              <rect
                x="178"
                y="28"
                width="142"
                height="104"
                rx="6"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeOpacity="0.55"
                strokeWidth="1.25"
              />
              <text x="192" y="52" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                02 · RUST SERVICE
              </text>
              <text x="192" y="73" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Tokio Worker
              </text>
              <text x="192" y="92" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                • Command Parser
              </text>
              <text x="192" y="108" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                • Tx Builder
              </text>

              <line
                x1="320"
                y1="60"
                x2="358"
                y2="60"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-lemon)"
              />
              <line
                x1="320"
                y1="102"
                x2="358"
                y2="102"
                stroke="var(--muted-subtle)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                markerEnd="url(#arrow-muted-lemon)"
              />

              <rect
                x="362"
                y="22"
                width="124"
                height="58"
                rx="6"
                fill="var(--secondary)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="374" y="43" fill="var(--foreground)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                Ed25519 Signer
              </text>
              <text x="374" y="61" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                Keypair Signature
              </text>

              <rect
                x="362"
                y="88"
                width="124"
                height="52"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="374" y="109" fill="var(--foreground)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                RPC Simulation
              </text>
              <text x="374" y="126" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                Pre-flight check
              </text>

              <line
                x1="486"
                y1="52"
                x2="518"
                y2="72"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-lemon)"
              />
              <line
                x1="486"
                y1="112"
                x2="518"
                y2="90"
                stroke="var(--muted-subtle)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-muted-lemon)"
              />

              <rect
                x="522"
                y="40"
                width="106"
                height="80"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="534" y="64" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                03 · NETWORK
              </text>
              <text x="534" y="84" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                Solana RPC
              </text>
              <text x="534" y="102" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                JSON-RPC Node
              </text>
            </svg>
          </div>
        )}

        {type === "solana-vault" && (
          <div className="w-full rounded-lg border border-border bg-secondary/40 p-5">
            <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted-subtle">
              <span>Account Flow · Vault &amp; Escrow PDAs</span>
              <span>Anchor / SPL Token</span>
            </div>
            <svg
              viewBox="0 0 640 160"
              role="img"
              aria-label={`Architecture diagram for ${title}: User token account interacts with the Vault State PDA, which invokes SPL Token transfers and share minting`}
              className="w-full h-auto"
            >
              <defs>
                <marker
                  id="arrow-lime-vault"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--primary)" />
                </marker>
              </defs>

              <rect
                x="12"
                y="36"
                width="126"
                height="88"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="24" y="58" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                SIGNER
              </text>
              <text x="24" y="79" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                User Token Acct
              </text>
              <text x="24" y="98" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                Deposit / Withdraw
              </text>

              <line
                x1="138"
                y1="80"
                x2="184"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-vault)"
              />

              <rect
                x="188"
                y="22"
                width="230"
                height="116"
                rx="6"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeOpacity="0.55"
                strokeWidth="1.25"
              />
              <text x="204" y="45" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                SOLANA PROGRAM · PDA
              </text>
              <text x="204" y="66" fill="var(--foreground)" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                Vault &amp; Escrow Authority
              </text>
              <text x="204" y="86" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                Checked share &amp; balance math
              </text>
              <rect
                x="204"
                y="97"
                width="198"
                height="26"
                rx="4"
                fill="var(--secondary)"
                stroke="var(--border)"
              />
              <text x="214" y="114" fill="var(--foreground)" fontSize="9.5" fontFamily="monospace">
                seeds = [b&quot;vault&quot;, mint.key(), bump]
              </text>

              <line
                x1="418"
                y1="58"
                x2="466"
                y2="50"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-vault)"
              />
              <line
                x1="418"
                y1="102"
                x2="466"
                y2="110"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-vault)"
              />

              <rect
                x="470"
                y="20"
                width="156"
                height="54"
                rx="6"
                fill="var(--secondary)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="484" y="42" fill="var(--foreground)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                Token Vault Account
              </text>
              <text x="484" y="60" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                SPL Transfer CPI
              </text>

              <rect
                x="470"
                y="86"
                width="156"
                height="54"
                rx="6"
                fill="var(--secondary)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="484" y="108" fill="var(--foreground)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                Vault Share Mint
              </text>
              <text x="484" y="126" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                Mint / Burn Shares
              </text>
            </svg>
          </div>
        )}

        {type === "wiki-realtime" && (
          <div className="w-full rounded-lg border border-border bg-secondary/40 p-5">
            <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted-subtle">
              <span>Data Flow · WebSockets &amp; SQLx</span>
              <span>Rust / PostgreSQL</span>
            </div>
            <svg
              viewBox="0 0 640 160"
              role="img"
              aria-label={`Architecture diagram for ${title}: WebSocket clients connect to the Rust server, which persists tasks in PostgreSQL via SQLx`}
              className="w-full h-auto"
            >
              <defs>
                <marker
                  id="arrow-lime-wiki"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--primary)" />
                </marker>
              </defs>

              <rect
                x="12"
                y="30"
                width="130"
                height="100"
                rx="6"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="26" y="54" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                CLIENTS
              </text>
              <text x="26" y="75" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                WebSocket Peers
              </text>
              <text x="26" y="94" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                • Task Updates
              </text>
              <text x="26" y="110" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                • Activity Feed
              </text>

              <line
                x1="142"
                y1="80"
                x2="188"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-wiki)"
              />

              <rect
                x="192"
                y="24"
                width="210"
                height="112"
                rx="6"
                fill="var(--card)"
                stroke="var(--primary)"
                strokeOpacity="0.55"
                strokeWidth="1.25"
              />
              <text x="208" y="48" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                RUST BACKEND
              </text>
              <text x="208" y="69" fill="var(--foreground)" fontSize="12" fontWeight="600" fontFamily="sans-serif">
                HTTP Router + WS Rooms
              </text>
              <text x="208" y="90" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                • Broadcast channels per room
              </text>
              <text x="208" y="108" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                • SQLx compile-time queries
              </text>

              <line
                x1="402"
                y1="80"
                x2="452"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                markerEnd="url(#arrow-lime-wiki)"
              />

              <rect
                x="456"
                y="30"
                width="170"
                height="100"
                rx="6"
                fill="var(--secondary)"
                stroke="var(--border)"
                strokeWidth="1.25"
              />
              <text x="472" y="54" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                DATABASE
              </text>
              <text x="472" y="75" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                PostgreSQL
              </text>
              <text x="472" y="94" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                Tasks &amp; Users Schema
              </text>
              <text x="472" y="110" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                Connection Pool
              </text>
            </svg>
          </div>
        )}

        {type !== "lemon-signer" &&
          type !== "solana-vault" &&
          type !== "wiki-realtime" && (
            <div className="w-full rounded-lg border border-border bg-secondary/40 p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-xs text-muted-subtle">
                <span>Pipeline · {title}</span>
                <span>
                  {MOBILE_DIAGRAM_STEPS[type]?.tech || "System Flow"}
                </span>
              </div>
              <svg
                viewBox="0 0 640 120"
                role="img"
                aria-label={`Pipeline diagram for ${title}`}
                className="w-full h-auto"
              >
                <rect
                  x="14"
                  y="20"
                  width="180"
                  height="80"
                  rx="6"
                  fill="var(--card)"
                  stroke="var(--border)"
                />
                <text x="28" y="46" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                  STEP 01
                </text>
                <text x="28" y="70" fill="var(--foreground)" fontSize="11.5" fontWeight="600">
                  {MOBILE_DIAGRAM_STEPS[type]?.steps[0]?.title || "Input"}
                </text>

                <line x1="194" y1="60" x2="230" y2="60" stroke="var(--primary)" strokeWidth="1.25" />

                <rect
                  x="230"
                  y="20"
                  width="180"
                  height="80"
                  rx="6"
                  fill="var(--card)"
                  stroke="var(--primary)"
                  strokeOpacity="0.55"
                />
                <text x="244" y="46" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                  STEP 02
                </text>
                <text x="244" y="70" fill="var(--foreground)" fontSize="11.5" fontWeight="600">
                  {MOBILE_DIAGRAM_STEPS[type]?.steps[1]?.title || "Processing"}
                </text>

                <line x1="410" y1="60" x2="446" y2="60" stroke="var(--primary)" strokeWidth="1.25" />

                <rect
                  x="446"
                  y="20"
                  width="180"
                  height="80"
                  rx="6"
                  fill="var(--secondary)"
                  stroke="var(--border)"
                />
                <text x="460" y="46" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                  STEP 03
                </text>
                <text x="460" y="70" fill="var(--foreground)" fontSize="11.5" fontWeight="600">
                  {MOBILE_DIAGRAM_STEPS[type]?.steps[2]?.title || "Output"}
                </text>
              </svg>
            </div>
          )}
      </div>
    </div>
  );
}
