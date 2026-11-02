"use client";

import React, { useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

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
        detail: 'Validates seeds = [b"vault", mint.key(), bump] and computes shares.',
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

function getDiagramConfig(type: string, title: string) {
  return (
    MOBILE_DIAGRAM_STEPS[type] || {
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
    }
  );
}

function MobileStepStack({
  config,
  activeStep,
  onSelectStep,
}: {
  config: { header: string; tech: string; steps: MobileStep[] };
  activeStep: number;
  onSelectStep: (idx: number) => void;
}) {
  return (
    <div className="sm:hidden rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5 font-mono text-[11px] text-muted-subtle">
        <span className="truncate">{config.header}</span>
        <span className="shrink-0 text-muted-foreground">{config.tech}</span>
      </div>

      <div className="space-y-2" role="list" aria-label={`Architecture steps for ${config.header}`}>
        {config.steps.map((item, index) => {
          const isSelected = activeStep === index;
          return (
            <React.Fragment key={item.step}>
              <button
                type="button"
                onClick={() => onSelectStep(index)}
                aria-pressed={isSelected}
                className={`w-full text-left rounded-md border p-3.5 space-y-1 transition-all duration-150 ease-[var(--ease-out-expo)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? "border-primary/60 bg-card shadow-xs"
                    : "border-border bg-card/80 hover:border-foreground/25"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[10px] ${
                      isSelected || item.accent ? "text-primary font-medium" : "text-muted-subtle"
                    }`}
                  >
                    {item.step}
                  </span>
                  {isSelected && (
                    <span className="font-mono text-[10px] text-primary">
                      Active stage
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-foreground">
                  {item.title}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </button>
              {index < config.steps.length - 1 && (
                <div className="flex justify-center py-0.5" aria-hidden="true">
                  <ArrowDown
                    className={`h-3.5 w-3.5 transition-colors duration-150 ${
                      isSelected ? "text-primary" : "text-muted-subtle/70"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
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
  const config = getDiagramConfig(type || "", title);
  const defaultIdx = Math.max(
    0,
    config.steps.findIndex((s) => s.accent)
  );
  const [activeStep, setActiveStep] = useState<number>(defaultIdx);

  if (!type) return null;

  const currentStep = config.steps[activeStep] || config.steps[0];

  return (
    <div>
      {/* Mobile (< 640px): Interactive Vertical Step Cards */}
      <MobileStepStack
        config={config}
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* Tablet & Desktop (>= 640px): Interactive Horizontal SVG Diagram + Synchronized Readout */}
      <div className="hidden sm:block">
        <div className="w-full rounded-lg border border-border bg-secondary/40 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-subtle">
            <span>Architecture · {config.header}</span>
            <div className="flex items-center gap-1.5">
              {config.steps.map((step, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    onMouseEnter={() => setActiveStep(idx)}
                    aria-pressed={isSelected}
                    className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? "bg-card text-primary border border-primary/40 font-medium"
                        : "text-muted-subtle hover:text-foreground border border-transparent"
                    }`}
                  >
                    0{idx + 1}
                  </button>
                );
              })}
              <span className="ml-1.5 text-muted-foreground">{config.tech}</span>
            </div>
          </div>

          {type === "lemon-signer" && (
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

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(0)}
                onMouseEnter={() => setActiveStep(0)}
              >
                <rect
                  x="12"
                  y="40"
                  width="124"
                  height="80"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 0 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 0 ? "1.75" : "1.25"}
                />
                <text x="26" y="64" fill={activeStep === 0 ? "var(--primary)" : "var(--muted-subtle)"} fontSize="9.5" fontFamily="monospace">
                  01 · CHAT
                </text>
                <text x="26" y="84" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                  Telegram Bot
                </text>
                <text x="26" y="102" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                  User Commands
                </text>
              </g>

              <line
                x1="136"
                y1="80"
                x2="174"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
                markerEnd="url(#arrow-lime-lemon)"
              />

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(1)}
                onMouseEnter={() => setActiveStep(1)}
              >
                <rect
                  x="178"
                  y="28"
                  width="142"
                  height="104"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 1 ? "var(--primary)" : "var(--border)"}
                  strokeOpacity={activeStep === 1 ? "0.9" : "0.75"}
                  strokeWidth={activeStep === 1 ? "1.75" : "1.25"}
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
              </g>

              <line
                x1="320"
                y1="60"
                x2="358"
                y2="60"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
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

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(2)}
                onMouseEnter={() => setActiveStep(2)}
              >
                <rect
                  x="362"
                  y="22"
                  width="124"
                  height="58"
                  rx="6"
                  fill="var(--secondary)"
                  stroke={activeStep === 2 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 2 ? "1.75" : "1.25"}
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
                  stroke={activeStep === 2 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 2 ? "1.75" : "1.25"}
                />
                <text x="374" y="109" fill="var(--foreground)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                  RPC Simulation
                </text>
                <text x="374" y="126" fill="var(--muted-subtle)" fontSize="9.5" fontFamily="monospace">
                  Pre-flight check
                </text>
              </g>

              <line
                x1="486"
                y1="52"
                x2="518"
                y2="72"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
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

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(3)}
                onMouseEnter={() => setActiveStep(3)}
              >
                <rect
                  x="522"
                  y="40"
                  width="106"
                  height="80"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 3 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 3 ? "1.75" : "1.25"}
                />
                <text x="534" y="64" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                  04 · NETWORK
                </text>
                <text x="534" y="84" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                  Solana RPC
                </text>
                <text x="534" y="102" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                  JSON-RPC Node
                </text>
              </g>
            </svg>
          )}

          {type === "solana-vault" && (
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

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(0)}
                onMouseEnter={() => setActiveStep(0)}
              >
                <rect
                  x="12"
                  y="36"
                  width="126"
                  height="88"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 0 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 0 ? "1.75" : "1.25"}
                />
                <text x="24" y="58" fill={activeStep === 0 ? "var(--primary)" : "var(--muted-subtle)"} fontSize="9.5" fontFamily="monospace">
                  01 · SIGNER
                </text>
                <text x="24" y="79" fill="var(--foreground)" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
                  User Token Acct
                </text>
                <text x="24" y="98" fill="var(--muted-foreground)" fontSize="9.5" fontFamily="monospace">
                  Deposit / Withdraw
                </text>
              </g>

              <line
                x1="138"
                y1="80"
                x2="184"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
                markerEnd="url(#arrow-lime-vault)"
              />

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(1)}
                onMouseEnter={() => setActiveStep(1)}
              >
                <rect
                  x="188"
                  y="22"
                  width="230"
                  height="116"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 1 ? "var(--primary)" : "var(--border)"}
                  strokeOpacity={activeStep === 1 ? "0.9" : "0.75"}
                  strokeWidth={activeStep === 1 ? "1.75" : "1.25"}
                />
                <text x="204" y="45" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                  02 · SOLANA PROGRAM · PDA
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
              </g>

              <line
                x1="418"
                y1="58"
                x2="466"
                y2="50"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
                markerEnd="url(#arrow-lime-vault)"
              />
              <line
                x1="418"
                y1="102"
                x2="466"
                y2="110"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
                markerEnd="url(#arrow-lime-vault)"
              />

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(2)}
                onMouseEnter={() => setActiveStep(2)}
              >
                <rect
                  x="470"
                  y="20"
                  width="156"
                  height="54"
                  rx="6"
                  fill="var(--secondary)"
                  stroke={activeStep === 2 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 2 ? "1.75" : "1.25"}
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
                  stroke={activeStep === 2 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 2 ? "1.75" : "1.25"}
                />
                <text x="484" y="108" fill="var(--foreground)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                  Vault Share Mint
                </text>
                <text x="484" y="126" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                  Mint / Burn Shares
                </text>
              </g>
            </svg>
          )}

          {type === "wiki-realtime" && (
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

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(0)}
                onMouseEnter={() => setActiveStep(0)}
              >
                <rect
                  x="12"
                  y="30"
                  width="130"
                  height="100"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 0 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 0 ? "1.75" : "1.25"}
                />
                <text x="26" y="54" fill={activeStep === 0 ? "var(--primary)" : "var(--muted-subtle)"} fontSize="9.5" fontFamily="monospace">
                  01 · CLIENTS
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
              </g>

              <line
                x1="142"
                y1="80"
                x2="188"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
                markerEnd="url(#arrow-lime-wiki)"
              />

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(1)}
                onMouseEnter={() => setActiveStep(1)}
              >
                <rect
                  x="192"
                  y="24"
                  width="210"
                  height="112"
                  rx="6"
                  fill="var(--card)"
                  stroke={activeStep === 1 ? "var(--primary)" : "var(--border)"}
                  strokeOpacity={activeStep === 1 ? "0.9" : "0.75"}
                  strokeWidth={activeStep === 1 ? "1.75" : "1.25"}
                />
                <text x="208" y="48" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                  02 · RUST BACKEND
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
              </g>

              <line
                x1="402"
                y1="80"
                x2="452"
                y2="80"
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                className="animate-flow-dash"
                markerEnd="url(#arrow-lime-wiki)"
              />

              <g
                className="cursor-pointer"
                onClick={() => setActiveStep(2)}
                onMouseEnter={() => setActiveStep(2)}
              >
                <rect
                  x="456"
                  y="30"
                  width="170"
                  height="100"
                  rx="6"
                  fill="var(--secondary)"
                  stroke={activeStep === 2 ? "var(--primary)" : "var(--border)"}
                  strokeWidth={activeStep === 2 ? "1.75" : "1.25"}
                />
                <text x="472" y="54" fill={activeStep === 2 ? "var(--primary)" : "var(--muted-subtle)"} fontSize="9.5" fontFamily="monospace">
                  03 · DATABASE
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
              </g>
            </svg>
          )}

          {type !== "lemon-signer" &&
            type !== "solana-vault" &&
            type !== "wiki-realtime" && (
              <svg
                viewBox="0 0 640 120"
                role="img"
                aria-label={`Pipeline diagram for ${title}`}
                className="w-full h-auto"
              >
                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStep(0)}
                  onMouseEnter={() => setActiveStep(0)}
                >
                  <rect
                    x="14"
                    y="20"
                    width="180"
                    height="80"
                    rx="6"
                    fill="var(--card)"
                    stroke={activeStep === 0 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStep === 0 ? "1.75" : "1.25"}
                  />
                  <text x="28" y="46" fill={activeStep === 0 ? "var(--primary)" : "var(--muted-subtle)"} fontSize="9.5" fontFamily="monospace">
                    {config.steps[0]?.step || "STEP 01"}
                  </text>
                  <text x="28" y="70" fill="var(--foreground)" fontSize="11.5" fontWeight="600">
                    {config.steps[0]?.title || "Input"}
                  </text>
                </g>

                <line
                  x1="194"
                  y1="60"
                  x2="230"
                  y2="60"
                  stroke="var(--primary)"
                  strokeWidth="1.25"
                  strokeDasharray="3 3"
                  className="animate-flow-dash"
                />

                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStep(1)}
                  onMouseEnter={() => setActiveStep(1)}
                >
                  <rect
                    x="230"
                    y="20"
                    width="180"
                    height="80"
                    rx="6"
                    fill="var(--card)"
                    stroke={activeStep === 1 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStep === 1 ? "1.75" : "1.25"}
                  />
                  <text x="244" y="46" fill="var(--primary)" fontSize="9.5" fontFamily="monospace">
                    {config.steps[1]?.step || "STEP 02"}
                  </text>
                  <text x="244" y="70" fill="var(--foreground)" fontSize="11.5" fontWeight="600">
                    {config.steps[1]?.title || "Processing"}
                  </text>
                </g>

                <line
                  x1="410"
                  y1="60"
                  x2="446"
                  y2="60"
                  stroke="var(--primary)"
                  strokeWidth="1.25"
                  strokeDasharray="3 3"
                  className="animate-flow-dash"
                />

                <g
                  className="cursor-pointer"
                  onClick={() => setActiveStep(2)}
                  onMouseEnter={() => setActiveStep(2)}
                >
                  <rect
                    x="446"
                    y="20"
                    width="180"
                    height="80"
                    rx="6"
                    fill="var(--secondary)"
                    stroke={activeStep === 2 ? "var(--primary)" : "var(--border)"}
                    strokeWidth={activeStep === 2 ? "1.75" : "1.25"}
                  />
                  <text x="460" y="46" fill={activeStep === 2 ? "var(--primary)" : "var(--muted-subtle)"} fontSize="9.5" fontFamily="monospace">
                    {config.steps[2]?.step || "STEP 03"}
                  </text>
                  <text x="460" y="70" fill="var(--foreground)" fontSize="11.5" fontWeight="600">
                    {config.steps[2]?.title || "Output"}
                  </text>
                </g>
              </svg>
            )}

          {/* Synchronized Interactive Readout Bar */}
          {currentStep && (
            <div
              aria-live="polite"
              className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-4 py-2.5 text-xs"
            >
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 min-w-0">
                <span className="font-mono text-[11px] font-medium text-primary shrink-0">
                  {currentStep.step}
                </span>
                <span className="font-semibold text-foreground shrink-0">
                  {currentStep.title}
                </span>
                <span aria-hidden="true" className="text-muted-subtle">
                  —
                </span>
                <span className="text-muted-foreground">
                  {currentStep.detail}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveStep((prev) => (prev + 1) % config.steps.length)
                }
                className="group inline-flex items-center gap-1 font-mono text-[11px] text-muted-subtle hover:text-primary transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <span>Next stage</span>
                <ArrowRight
                  className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
