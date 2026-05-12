export const ABOUT = {
  opener: 'I believe the best technical leaders still build.',
  paragraphs: [
    "That's why I stay 70% hands-on. Designing architectures, writing code, debugging production systems, while leading a growing AI team at RBC's CFO Group. Not because I have to. Because the moment a technical leader stops building, they start making decisions based on abstractions instead of reality.",
    "Three things I've learned building AI systems across power plants, cloud pipelines, and enterprise finance:",
  ],
  beliefs: [
    {
      lead: 'First, the architecture IS the product.',
      body: "Not the model, not the prompt, not the framework. The decisions about what the LLM touches and what it doesn't, that's what makes an AI system trustworthy in a regulated environment. In every system I've built, GPT handles intent; deterministic code handles truth. That separation isn't a constraint. It's the design.",
    },
    {
      lead: 'Second, the best leaders translate vision into shipped systems.',
      body: "PAR Assist is RBC's first bank-wide production agentic AI platform, conceived as my vision, given to Amplify interns as an ideation exercise to explore the problem space, then built end-to-end. Astraeus followed the same arc: conceived, architected, and built end-to-end into a production analytics platform that brought headcount-movement queries from days (line-of-business level only) to real time at any granularity across CFO Group data. The work that matters is the arc from a one-page plan to a system shipping to real users; architecture diagrams without production builds are powerpoint.",
    },
    {
      lead: 'Third, trust beats accuracy in regulated AI.',
      body: "The hardest thing in production AI at a regulated institution isn\u2019t getting the answer right \u2014 it\u2019s getting the humans who own the decision to trust the system that produced it. Commodity Tax\u2019s Tableau transparency layer, Astraeus\u2019s permission entitlement modeling, PAR Assist\u2019s MCP-tool audit trail: at every stage the architecture has to survive stakeholder audit. That\u2019s the job.",
    },
  ],
  closer:
    'I\u2019m always open to conversations about building AI teams, shipping GenAI in regulated industries, and what "production-ready" actually means when the CFO is watching.',
} as const;
