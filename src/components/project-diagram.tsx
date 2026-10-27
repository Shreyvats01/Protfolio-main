import React from "react";

export type DiagramType =
  | "lemon-signer"
  | "solana-vault"
  | "wiki-realtime"
  | "spl-launchpad"
  | "media-pipeline"
  | string;

const COMPACT_FLOWS: Record<
  string,
  { label: string; nodes: [string, string, string] }
> = {
  "lemon-signer": {
    label: "Telegram → Rust → Solana RPC",
    nodes: ["Telegram Update", "Tokio Signer", "Solana RPC"],
  },
  "solana-vault": {
    label: "SPL Token → PDA Vault → Share Mint",
    nodes: ["User Token Acct", "Vault PDA", "Share Mint CPI"],
  },
  "wiki-realtime": {
    label: "Client WS → Rust Hub → PostgreSQL",
    nodes: ["WebSocket Room", "Rust Server", "SQLx / Postgres"],
  },
  "spl-launchpad": {
    label: "Browser Wallet → Tx Builder → SPL Mint",
    nodes: ["Wallet Adapter", "Atomic Tx", "SPL Token Mint"],
  },
  "media-pipeline": {
    label: "Upload → Stream Queue → Output",
    nodes: ["Telegram Media", "Job Queue", "Encoded Output"],
  },
};

export function ProjectDiagram({
  type,
  title,
  variant = "full",
}: {
  type?: DiagramType;
  title: string;
  variant?: "compact" | "full";
}) {
  if (!type) return null;

  if (variant === "compact") {
    const flow = COMPACT_FLOWS[type];
    if (!flow) return null;

    return (
      <div
        aria-label={`Flow preview for ${title}: ${flow.nodes.join(" to ")}`}
        className="rounded-md border border-border bg-[#0B0D0F] px-3.5 py-3"
      >
        <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#A1AAB6]">
          <span className="truncate rounded border border-border bg-card px-2 py-1 text-foreground">
            {flow.nodes[0]}
          </span>
          <span aria-hidden="true" className="text-primary shrink-0">
            →
          </span>
          <span className="truncate rounded border border-primary/30 bg-card px-2 py-1 text-foreground">
            {flow.nodes[1]}
          </span>
          <span aria-hidden="true" className="text-primary shrink-0">
            →
          </span>
          <span className="truncate rounded border border-border bg-card px-2 py-1 text-foreground">
            {flow.nodes[2]}
          </span>
        </div>
      </div>
    );
  }

  if (type === "lemon-signer") {
    return (
      <div className="w-full rounded-lg border border-border bg-[#0B0D0F] p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-[#788391]">
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#B7F36B" />
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#788391" />
            </marker>
          </defs>

          <rect
            x="12"
            y="40"
            width="124"
            height="80"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="26" y="64" fill="#788391" fontSize="9.5" fontFamily="monospace">
            01 · CHAT
          </text>
          <text x="26" y="84" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            Telegram Bot
          </text>
          <text x="26" y="102" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            User Commands
          </text>

          <line
            x1="136"
            y1="80"
            x2="174"
            y2="80"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-lemon)"
          />

          <rect
            x="178"
            y="28"
            width="142"
            height="104"
            rx="6"
            fill="#12161B"
            stroke="#B7F36B"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <text x="192" y="52" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            02 · RUST SERVICE
          </text>
          <text x="192" y="73" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            Tokio Worker
          </text>
          <text x="192" y="92" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Command Parser
          </text>
          <text x="192" y="108" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Tx Builder
          </text>

          <line
            x1="320"
            y1="60"
            x2="358"
            y2="60"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-lemon)"
          />
          <line
            x1="320"
            y1="102"
            x2="358"
            y2="102"
            stroke="#788391"
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
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="374" y="43" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Ed25519 Signer
          </text>
          <text x="374" y="61" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Keypair Signature
          </text>

          <rect
            x="362"
            y="88"
            width="124"
            height="52"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="374" y="109" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            RPC Simulation
          </text>
          <text x="374" y="126" fill="#788391" fontSize="9.5" fontFamily="monospace">
            Pre-flight check
          </text>

          <line
            x1="486"
            y1="52"
            x2="518"
            y2="72"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-lemon)"
          />
          <line
            x1="486"
            y1="112"
            x2="518"
            y2="90"
            stroke="#788391"
            strokeWidth="1.25"
            markerEnd="url(#arrow-muted-lemon)"
          />

          <rect
            x="522"
            y="40"
            width="106"
            height="80"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="534" y="64" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            03 · NETWORK
          </text>
          <text x="534" y="84" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            Solana RPC
          </text>
          <text x="534" y="102" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            JSON-RPC Node
          </text>
        </svg>
      </div>
    );
  }

  if (type === "solana-vault") {
    return (
      <div className="w-full rounded-lg border border-border bg-[#0B0D0F] p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-[#788391]">
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#B7F36B" />
            </marker>
          </defs>

          <rect
            x="12"
            y="36"
            width="126"
            height="88"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="24" y="58" fill="#788391" fontSize="9.5" fontFamily="monospace">
            SIGNER
          </text>
          <text x="24" y="79" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            User Token Acct
          </text>
          <text x="24" y="98" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Deposit / Withdraw
          </text>

          <line
            x1="138"
            y1="80"
            x2="184"
            y2="80"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-vault)"
          />

          <rect
            x="188"
            y="22"
            width="230"
            height="116"
            rx="6"
            fill="#12161B"
            stroke="#B7F36B"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <text x="204" y="45" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            SOLANA PROGRAM · PDA
          </text>
          <text x="204" y="66" fill="#F1F5F9" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            Vault &amp; Escrow Authority
          </text>
          <text x="204" y="86" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Checked share &amp; balance math
          </text>
          <rect
            x="204"
            y="97"
            width="198"
            height="26"
            rx="4"
            fill="#171C22"
            stroke="#242A31"
          />
          <text x="214" y="114" fill="#F1F5F9" fontSize="9.5" fontFamily="monospace">
            seeds = [b&quot;vault&quot;, mint.key(), bump]
          </text>

          <line
            x1="418"
            y1="58"
            x2="466"
            y2="50"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-vault)"
          />
          <line
            x1="418"
            y1="102"
            x2="466"
            y2="110"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-vault)"
          />

          <rect
            x="470"
            y="20"
            width="156"
            height="54"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="484" y="42" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Token Vault Account
          </text>
          <text x="484" y="60" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            SPL Transfer CPI
          </text>

          <rect
            x="470"
            y="86"
            width="156"
            height="54"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="484" y="108" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Vault Share Mint
          </text>
          <text x="484" y="126" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            Mint / Burn Shares
          </text>
        </svg>
      </div>
    );
  }

  if (type === "wiki-realtime") {
    return (
      <div className="w-full rounded-lg border border-border bg-[#0B0D0F] p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-xs text-[#788391]">
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
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#B7F36B" />
            </marker>
          </defs>

          <rect
            x="12"
            y="30"
            width="130"
            height="100"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="26" y="54" fill="#788391" fontSize="9.5" fontFamily="monospace">
            CLIENTS
          </text>
          <text x="26" y="75" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            WebSocket Peers
          </text>
          <text x="26" y="94" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Task Updates
          </text>
          <text x="26" y="110" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Activity Feed
          </text>

          <line
            x1="142"
            y1="80"
            x2="188"
            y2="80"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-wiki)"
          />

          <rect
            x="192"
            y="24"
            width="210"
            height="112"
            rx="6"
            fill="#12161B"
            stroke="#B7F36B"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <text x="208" y="48" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            RUST BACKEND
          </text>
          <text x="208" y="69" fill="#F1F5F9" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            HTTP Router + WS Rooms
          </text>
          <text x="208" y="90" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Broadcast channels per room
          </text>
          <text x="208" y="108" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • SQLx compile-time queries
          </text>

          <line
            x1="402"
            y1="80"
            x2="452"
            y2="80"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-wiki)"
          />

          <rect
            x="456"
            y="30"
            width="170"
            height="100"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="472" y="54" fill="#788391" fontSize="9.5" fontFamily="monospace">
            DATABASE
          </text>
          <text x="472" y="75" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            PostgreSQL
          </text>
          <text x="472" y="94" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Tasks &amp; Users Schema
          </text>
          <text x="472" y="110" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            Connection Pool
          </text>
        </svg>
      </div>
    );
  }

  const fallbackFlow = COMPACT_FLOWS[type] || {
    label: "System Pipeline",
    nodes: ["Input", "Processing", "Output"],
  };

  return (
    <div className="w-full rounded-lg border border-border bg-[#0B0D0F] p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-xs text-[#788391]">
        <span>Pipeline · {title}</span>
        <span>{fallbackFlow.label}</span>
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
          fill="#12161B"
          stroke="#242A31"
        />
        <text x="28" y="46" fill="#788391" fontSize="9.5" fontFamily="monospace">
          STEP 01
        </text>
        <text x="28" y="70" fill="#F1F5F9" fontSize="11.5" fontWeight="600">
          {fallbackFlow.nodes[0]}
        </text>

        <line x1="194" y1="60" x2="230" y2="60" stroke="#B7F36B" strokeWidth="1.25" />

        <rect
          x="230"
          y="20"
          width="180"
          height="80"
          rx="6"
          fill="#12161B"
          stroke="#B7F36B"
          strokeOpacity="0.45"
        />
        <text x="244" y="46" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
          STEP 02
        </text>
        <text x="244" y="70" fill="#F1F5F9" fontSize="11.5" fontWeight="600">
          {fallbackFlow.nodes[1]}
        </text>

        <line x1="410" y1="60" x2="446" y2="60" stroke="#B7F36B" strokeWidth="1.25" />

        <rect
          x="446"
          y="20"
          width="180"
          height="80"
          rx="6"
          fill="#171C22"
          stroke="#242A31"
        />
        <text x="460" y="46" fill="#788391" fontSize="9.5" fontFamily="monospace">
          STEP 03
        </text>
        <text x="460" y="70" fill="#F1F5F9" fontSize="11.5" fontWeight="600">
          {fallbackFlow.nodes[2]}
        </text>
      </svg>
    </div>
  );
}
