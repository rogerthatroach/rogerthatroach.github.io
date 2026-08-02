export const ABOUT = {
  opener: 'I believe the best technical leaders still build.',
  paragraphs: [
    "That's why I stay ~70% hands-on. Designing architectures, writing code, debugging production systems, while leading a growing AI team at RBC's CFO Group. Not because I have to. Because the moment a technical leader stops building, they start making decisions based on abstractions instead of reality.",
    "Three things I've learned building AI systems across power plants, cloud pipelines, and enterprise finance:",
  ],
  beliefs: [
    {
      lead: 'First, the architecture IS the product.',
      body: "Not the model, not the prompt, not the framework. The decisions about what the LLM touches and what it doesn't, that's what makes an AI system trustworthy in a regulated environment. In the current LLM systems, models handle language-shaped work while deterministic code owns governed calculation paths. That separation isn't a constraint. It's the design.",
    },
    {
      lead: 'Second, the best leaders translate vision into shipped systems.',
      body: "PAR Assist is the first true agentic AI platform approved for production at the bank. I conceived it, gave the 2025 Amplify interns the problem space as an ideation exercise, then built the production platform end-to-end; it launched across the full CFO Group in all geographies in May 2026. For Astraeus, I conceived, architected, and built the platform, then led its cross-functional productionisation as days-long headcount-movement requests became interactive analysis across authorized CFO Group hierarchy scopes. The work that matters is the arc from a one-page plan to a system shipping to real users; architecture diagrams without production builds are PowerPoint.",
    },
    {
      lead: 'Third, trust requires more than accuracy in regulated AI.',
      body: "The hardest thing in production AI at a regulated institution isn\u2019t getting the answer right \u2014 it\u2019s getting the humans who own the decision to trust the system that produced it. Commodity Tax\u2019s Tableau transparency layer, Astraeus\u2019s permission entitlement modeling, PAR Assist\u2019s MCP-tool audit trail: at every stage the architecture has to survive stakeholder audit. That\u2019s the job.",
    },
  ],
  closer:
    'I\u2019m always open to conversations about building AI teams, shipping GenAI in regulated industries, and what "production-ready" actually means when the CFO is watching.',
} as const;
