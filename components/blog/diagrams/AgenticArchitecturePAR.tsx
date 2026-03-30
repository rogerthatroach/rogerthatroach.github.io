'use client';

export default function AgenticArchitecturePAR() {
  return (
    <svg width="100%" viewBox="0 0 680 720" xmlns="http://www.w3.org/2000/svg" className="my-8">
      {/* Title */}
      <text fill="var(--color-text-secondary)" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="340" y="30" textAnchor="middle">Enterprise agentic AI architecture</text>
      <text fill="var(--color-text-tertiary)" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="340" y="48" textAnchor="middle">LangGraph + MCP tools + multi-layer RAG</text>

      {/* ============ USER INPUT ============ */}
      <rect x="240" y="70" width="200" height="44" rx="8" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="0.5" />
      <text fill="var(--color-text-primary)" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="340" y="96" textAnchor="middle">User input</text>

      {/* Arrow down */}
      <line x1="340" y1="114" x2="340" y2="144" stroke="var(--color-border)" strokeWidth="1.5" />
      <polygon points="334,140 340,150 346,140" fill="var(--color-border)" />

      {/* ============ LANGGRAPH ORCHESTRATION CONTAINER ============ */}
      <rect x="60" y="144" width="560" height="120" rx="16" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.3)" strokeWidth="0.5" />
      <text fill="#a78bfa" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="340" y="170" textAnchor="middle">LangGraph orchestration</text>
      <text fill="#7c3aed" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="340" y="188" textAnchor="middle" opacity="0.7">Directed graph with persistent state machine</text>

      {/* Internal nodes */}
      <rect x="86" y="200" width="110" height="44" rx="6" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.3)" strokeWidth="0.5" />
      <text fill="#5eead4" fontFamily="var(--font-inter), sans-serif" fontSize="13" fontWeight="500" x="141" y="226" textAnchor="middle">Parse intent</text>

      <line x1="196" y1="222" x2="216" y2="222" stroke="var(--color-border)" strokeWidth="1" />
      <polygon points="212,219 220,222 212,225" fill="var(--color-border)" />

      <rect x="216" y="200" width="110" height="44" rx="6" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.3)" strokeWidth="0.5" />
      <text fill="#5eead4" fontFamily="var(--font-inter), sans-serif" fontSize="13" fontWeight="500" x="271" y="226" textAnchor="middle">Route</text>

      <line x1="326" y1="222" x2="346" y2="222" stroke="var(--color-border)" strokeWidth="1" />
      <polygon points="342,219 350,222 342,225" fill="var(--color-border)" />

      <rect x="346" y="200" width="128" height="44" rx="6" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.3)" strokeWidth="0.5" />
      <text fill="#5eead4" fontFamily="var(--font-inter), sans-serif" fontSize="13" fontWeight="500" x="410" y="226" textAnchor="middle">Execute tool</text>

      <line x1="474" y1="222" x2="494" y2="222" stroke="var(--color-border)" strokeWidth="1" />
      <polygon points="490,219 498,222 490,225" fill="var(--color-border)" />

      <rect x="494" y="200" width="110" height="44" rx="6" fill="rgba(20,184,166,0.12)" stroke="rgba(20,184,166,0.3)" strokeWidth="0.5" />
      <text fill="#5eead4" fontFamily="var(--font-inter), sans-serif" fontSize="13" fontWeight="500" x="549" y="226" textAnchor="middle">Respond</text>

      {/* Arrows down to MCP + RAG */}
      <line x1="220" y1="264" x2="220" y2="300" stroke="var(--color-border)" strokeWidth="1.5" />
      <polygon points="214,296 220,306 226,296" fill="var(--color-border)" />
      <text fill="var(--color-text-tertiary)" fontFamily="var(--font-inter), sans-serif" fontSize="11" x="228" y="286">Tools</text>

      <line x1="460" y1="264" x2="460" y2="300" stroke="var(--color-border)" strokeWidth="1.5" />
      <polygon points="454,296 460,306 466,296" fill="var(--color-border)" />
      <text fill="var(--color-text-tertiary)" fontFamily="var(--font-inter), sans-serif" fontSize="11" x="468" y="286">Retrieval</text>

      {/* ============ MCP TOOLS CONTAINER ============ */}
      <rect x="60" y="300" width="280" height="200" rx="16" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.5" />
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="200" y="326" textAnchor="middle">MCP tools (action layer)</text>
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="200" y="344" textAnchor="middle" opacity="0.6">Typed, logged, auditable</text>

      {/* Tool boxes */}
      <rect x="80" y="360" width="120" height="44" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.5" />
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="140" y="378" textAnchor="middle">Template</text>
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="140" y="394" textAnchor="middle">selection</text>

      <rect x="208" y="360" width="120" height="44" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.5" />
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="268" y="378" textAnchor="middle">Field</text>
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="268" y="394" textAnchor="middle">assignment</text>

      <rect x="80" y="416" width="120" height="44" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.5" />
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="140" y="434" textAnchor="middle">Conflict</text>
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="140" y="450" textAnchor="middle">resolution</text>

      <rect x="208" y="416" width="120" height="44" rx="6" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.5" />
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="268" y="434" textAnchor="middle">Ambiguity</text>
      <text fill="#fca5a5" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="268" y="450" textAnchor="middle">detection</text>

      {/* ============ MULTI-LAYER RAG CONTAINER ============ */}
      <rect x="360" y="300" width="260" height="200" rx="16" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.5" />
      <text fill="#93c5fd" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="490" y="326" textAnchor="middle">Multi-layer RAG</text>
      <text fill="#93c5fd" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="490" y="344" textAnchor="middle" opacity="0.6">Three retrieval scopes</text>

      {/* RAG layer rows */}
      <rect x="380" y="360" width="220" height="36" rx="6" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.5" />
      <text fill="#93c5fd" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="490" y="382" textAnchor="middle">Layer 1: Conversation history</text>

      <rect x="380" y="404" width="220" height="36" rx="6" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.5" />
      <text fill="#93c5fd" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="490" y="426" textAnchor="middle">Layer 2: Uploaded documents</text>

      <rect x="380" y="448" width="220" height="36" rx="6" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.5" />
      <text fill="#93c5fd" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="490" y="470" textAnchor="middle">Layer 3: Institutional knowledge</text>

      {/* Arrows down to PostgreSQL */}
      <line x1="200" y1="500" x2="200" y2="540" stroke="var(--color-border)" strokeWidth="1.5" />
      <polygon points="194,536 200,546 206,536" fill="var(--color-border)" />

      <line x1="490" y1="500" x2="490" y2="540" stroke="var(--color-border)" strokeWidth="1.5" />
      <polygon points="484,536 490,546 496,536" fill="var(--color-border)" />

      {/* ============ POSTGRESQL BACKBONE ============ */}
      <rect x="100" y="540" width="480" height="70" rx="12" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.5" />
      <text fill="#fbbf24" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="340" y="570" textAnchor="middle">PostgreSQL + pgvector</text>
      <text fill="#fbbf24" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="340" y="590" textAnchor="middle" opacity="0.7">Unified store: workflow state, embeddings, metadata, sessions</text>

      {/* ============ SEPARATION OF CONCERNS CALLOUT ============ */}
      <rect x="120" y="640" width="440" height="52" rx="8" fill="none" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 3" />
      <text fill="var(--color-text-primary)" fontFamily="var(--font-inter), sans-serif" fontSize="14" fontWeight="500" x="340" y="662" textAnchor="middle">Separation of concerns</text>
      <text fill="var(--color-text-tertiary)" fontFamily="var(--font-inter), sans-serif" fontSize="12" x="340" y="680" textAnchor="middle">LLMs reason — tools act — code controls flow — database remembers</text>
    </svg>
  );
}
