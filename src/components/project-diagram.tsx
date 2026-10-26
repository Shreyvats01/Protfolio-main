import React from "react";

export type DiagramType =
  | "lemon-signer"
  | "solana-vault"
  | "wiki-realtime"
  | "spl-launchpad"
  | "media-pipeline"
  | string;

export function ProjectDiagram({
  type,
  title,
}: {
  type: DiagramType;
  title: string;
}) {
  if (type === "lemon-signer") {
    return (
      <div className="w-full rounded-md border border-[#242A31] bg-[#0B0D0F] p-4">
        <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#788391]">
          <span>SYSTEM TOPOLOGY · TELEGRAM SIGNER BRIDGE</span>
          <span className="text-[#A1AAB6]">ASYNC TOKIO / ED25519</span>
        </div>
        <svg
          viewBox="0 0 640 165"
          role="img"
          aria-label={`Architecture diagram for ${title}: Telegram client dispatches commands to Rust Tokio router, which verifies session state, simulates transactions, and submits signed Ed25519 payloads to Solana RPC`}
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

          {/* Subtle background grid lines */}
          <line x1="0" y1="35" x2="640" y2="35" stroke="#171C22" strokeWidth="1" />
          <line x1="0" y1="82" x2="640" y2="82" stroke="#171C22" strokeWidth="1" />
          <line x1="0" y1="130" x2="640" y2="130" stroke="#171C22" strokeWidth="1" />

          {/* Node 1: Telegram Client */}
          <rect
            x="12"
            y="42"
            width="124"
            height="80"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="26" y="66" fill="#788391" fontSize="9.5" fontFamily="monospace">
            01 · INGRESS
          </text>
          <text x="26" y="86" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            Telegram Client
          </text>
          <text x="26" y="104" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Webhook / Updates
          </text>

          {/* Connector 1 -> 2 */}
          <line
            x1="136"
            y1="82"
            x2="174"
            y2="82"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-lemon)"
          />
          <text x="142" y="73" fill="#788391" fontSize="8.5" fontFamily="monospace">
            TLS
          </text>

          {/* Node 2: Tokio Command Engine */}
          <rect
            x="178"
            y="30"
            width="142"
            height="104"
            rx="6"
            fill="#12161B"
            stroke="#B7F36B"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <text x="192" y="54" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            02 · RUST RUNTIME
          </text>
          <text x="192" y="75" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            Tokio Dispatcher
          </text>
          <text x="192" y="94" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • State Machine
          </text>
          <text x="192" y="110" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Tx Builder
          </text>

          {/* Connector 2 -> 3 */}
          <line
            x1="320"
            y1="62"
            x2="358"
            y2="62"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-lemon)"
          />
          <line
            x1="320"
            y1="104"
            x2="358"
            y2="104"
            stroke="#788391"
            strokeWidth="1.25"
            strokeDasharray="3 3"
            markerEnd="url(#arrow-muted-lemon)"
          />

          {/* Node 3A: Ed25519 Key Vault */}
          <rect
            x="362"
            y="24"
            width="124"
            height="58"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="374" y="45" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Ed25519 Signer
          </text>
          <text x="374" y="63" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Scoped Keypair
          </text>

          {/* Node 3B: Pre-Flight Sim */}
          <rect
            x="362"
            y="90"
            width="124"
            height="52"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="374" y="111" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            RPC Simulation
          </text>
          <text x="374" y="128" fill="#788391" fontSize="9.5" fontFamily="monospace">
            simulateTransaction
          </text>

          {/* Connector 3 -> 4 */}
          <line
            x1="486"
            y1="54"
            x2="518"
            y2="74"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-lemon)"
          />
          <line
            x1="486"
            y1="114"
            x2="518"
            y2="92"
            stroke="#788391"
            strokeWidth="1.25"
            markerEnd="url(#arrow-muted-lemon)"
          />

          {/* Node 4: Solana Mainnet / RPC */}
          <rect
            x="522"
            y="42"
            width="106"
            height="80"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="534" y="66" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            04 · ON-CHAIN
          </text>
          <text x="534" y="86" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            Solana SVM
          </text>
          <text x="534" y="104" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            SPL / System CPI
          </text>
        </svg>
      </div>
    );
  }

  if (type === "solana-vault") {
    return (
      <div className="w-full rounded-md border border-[#242A31] bg-[#0B0D0F] p-4">
        <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#788391]">
          <span>ACCOUNT TOPOLOGY · ERC-4626 VAULT & PDA ESCROW</span>
          <span className="text-[#A1AAB6]">ANCHOR / SPL CPI</span>
        </div>
        <svg
          viewBox="0 0 640 165"
          role="img"
          aria-label={`Architecture diagram for ${title}: Depositor SPL token account transfers assets via CPI to a deterministic PDA Vault Authority, which mints proportional vault shares`}
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

          <line x1="0" y1="40" x2="640" y2="40" stroke="#171C22" strokeWidth="1" />
          <line x1="0" y1="125" x2="640" y2="125" stroke="#171C22" strokeWidth="1" />

          {/* Signer Account */}
          <rect
            x="12"
            y="38"
            width="126"
            height="88"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="24" y="60" fill="#788391" fontSize="9.5" fontFamily="monospace">
            SIGNER · ATA
          </text>
          <text x="24" y="81" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            User Token Acct
          </text>
          <text x="24" y="100" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            Deposit / Redeem
          </text>
          <text x="24" y="114" fill="#788391" fontSize="8.5" fontFamily="monospace">
            is_signer: true
          </text>

          {/* Arrow 1 */}
          <line
            x1="138"
            y1="82"
            x2="184"
            y2="82"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-vault)"
          />
          <text x="145" y="73" fill="#B7F36B" fontSize="8.5" fontFamily="monospace">
            ix data
          </text>

          {/* Program Box */}
          <rect
            x="188"
            y="24"
            width="230"
            height="116"
            rx="6"
            fill="#12161B"
            stroke="#B7F36B"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <text x="204" y="47" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            ON-CHAIN PROGRAM · PDA SEEDS
          </text>
          <text x="204" y="68" fill="#F1F5F9" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            Vault &amp; Escrow State PDA
          </text>
          <text x="204" y="88" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            shares = assets * total_supply / pool
          </text>
          <rect
            x="204"
            y="99"
            width="198"
            height="26"
            rx="4"
            fill="#171C22"
            stroke="#242A31"
          />
          <text x="214" y="116" fill="#F1F5F9" fontSize="9.5" fontFamily="monospace">
            seeds = [b&quot;vault&quot;, mint.key(), bump]
          </text>

          {/* Arrows to SPL CPI targets */}
          <line
            x1="418"
            y1="60"
            x2="466"
            y2="52"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-vault)"
          />
          <line
            x1="418"
            y1="104"
            x2="466"
            y2="112"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-vault)"
          />
          <text x="424" y="46" fill="#788391" fontSize="8.5" fontFamily="monospace">
            CPI
          </text>

          {/* Target 1: Vault Token Custody */}
          <rect
            x="470"
            y="22"
            width="156"
            height="54"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="484" y="44" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Custody Token Vault
          </text>
          <text x="484" y="62" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            SPL TransferChecked
          </text>

          {/* Target 2: Share Mint Authority */}
          <rect
            x="470"
            y="88"
            width="156"
            height="54"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="484" y="110" fill="#F1F5F9" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
            Share Mint Authority
          </text>
          <text x="484" y="128" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            MintTo / Burn Signed
          </text>
        </svg>
      </div>
    );
  }

  if (type === "wiki-realtime") {
    return (
      <div className="w-full rounded-md border border-[#242A31] bg-[#0B0D0F] p-4">
        <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#788391]">
          <span>DATA PIPELINE · REAL-TIME WEBSOCKET &amp; SQLX ENGINE</span>
          <span className="text-[#A1AAB6]">RUST / POSTGRESQL</span>
        </div>
        <svg
          viewBox="0 0 640 165"
          role="img"
          aria-label={`Architecture diagram for ${title}: Connected clients communicate over multiplexed WebSockets with the Rust server, which executes compile-time checked SQLx transactions against PostgreSQL`}
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

          <line x1="0" y1="82" x2="640" y2="82" stroke="#171C22" strokeWidth="1" />

          {/* Clients */}
          <rect
            x="12"
            y="32"
            width="130"
            height="100"
            rx="6"
            fill="#12161B"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="26" y="56" fill="#788391" fontSize="9.5" fontFamily="monospace">
            CLIENTS
          </text>
          <text x="26" y="77" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            WS Subscribers
          </text>
          <text x="26" y="96" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Task Deltas
          </text>
          <text x="26" y="112" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Live Presence
          </text>

          <line
            x1="142"
            y1="82"
            x2="188"
            y2="82"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-wiki)"
          />
          <text x="148" y="72" fill="#B7F36B" fontSize="8.5" fontFamily="monospace">
            ws://
          </text>

          {/* Hub */}
          <rect
            x="192"
            y="26"
            width="210"
            height="112"
            rx="6"
            fill="#12161B"
            stroke="#B7F36B"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <text x="208" y="50" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            RUST APPLICATION SERVER
          </text>
          <text x="208" y="71" fill="#F1F5F9" fontSize="12" fontWeight="600" fontFamily="sans-serif">
            Room Broadcast Hub + REST
          </text>
          <text x="208" y="92" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Tokio MPSC Broadcast Channels
          </text>
          <text x="208" y="110" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            • Compile-Time SQLx Query Macros
          </text>

          <line
            x1="402"
            y1="82"
            x2="452"
            y2="82"
            stroke="#B7F36B"
            strokeWidth="1.25"
            markerEnd="url(#arrow-lime-wiki)"
          />
          <text x="410" y="72" fill="#788391" fontSize="8.5" fontFamily="monospace">
            PgPool
          </text>

          {/* Postgres */}
          <rect
            x="456"
            y="32"
            width="170"
            height="100"
            rx="6"
            fill="#171C22"
            stroke="#242A31"
            strokeWidth="1.25"
          />
          <text x="472" y="56" fill="#788391" fontSize="9.5" fontFamily="monospace">
            STORAGE ENGINE
          </text>
          <text x="472" y="77" fill="#F1F5F9" fontSize="11.5" fontWeight="600" fontFamily="sans-serif">
            PostgreSQL Relational
          </text>
          <text x="472" y="96" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
            ACID Task Ledger
          </text>
          <text x="472" y="112" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
            sqlx::query! verified
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-[#242A31] bg-[#0B0D0F] p-4">
      <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-[#788391]">
        <span>EXECUTION PIPELINE · {title.toUpperCase()}</span>
        <span className="text-[#A1AAB6]">ATOMIC INSTRUCTION FLOW</span>
      </div>
      <svg
        viewBox="0 0 640 130"
        role="img"
        aria-label={`Technical execution pipeline diagram for ${title}`}
        className="w-full h-auto"
      >
        <rect
          x="14"
          y="24"
          width="180"
          height="82"
          rx="6"
          fill="#12161B"
          stroke="#242A31"
        />
        <text x="28" y="50" fill="#788391" fontSize="9.5" fontFamily="monospace">
          STAGE 01
        </text>
        <text x="28" y="72" fill="#F1F5F9" fontSize="11.5" fontWeight="600">
          Instruction Assembly
        </text>
        <text x="28" y="90" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
          Schema &amp; Account Layout
        </text>

        <line x1="194" y1="65" x2="230" y2="65" stroke="#B7F36B" strokeWidth="1.25" />

        <rect
          x="230"
          y="24"
          width="180"
          height="82"
          rx="6"
          fill="#12161B"
          stroke="#B7F36B"
          strokeOpacity="0.45"
        />
        <text x="244" y="50" fill="#B7F36B" fontSize="9.5" fontFamily="monospace">
          STAGE 02
        </text>
        <text x="244" y="72" fill="#F1F5F9" fontSize="11.5" fontWeight="600">
          Signature &amp; Dispatch
        </text>
        <text x="244" y="90" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
          Atomic Batch Execution
        </text>

        <line x1="410" y1="65" x2="446" y2="65" stroke="#B7F36B" strokeWidth="1.25" />

        <rect
          x="446"
          y="24"
          width="180"
          height="82"
          rx="6"
          fill="#171C22"
          stroke="#242A31"
        />
        <text x="460" y="50" fill="#788391" fontSize="9.5" fontFamily="monospace">
          STAGE 03
        </text>
        <text x="460" y="72" fill="#F1F5F9" fontSize="11.5" fontWeight="600">
          Finalized State
        </text>
        <text x="460" y="90" fill="#A1AAB6" fontSize="9.5" fontFamily="monospace">
          Deterministic Verification
        </text>
      </svg>
    </div>
  );
}
