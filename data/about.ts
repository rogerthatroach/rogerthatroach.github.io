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
      lead: 'Second, the best ideas come from everywhere.',
      body: "PAR Assist started as an intern's proof-of-concept during the Amplify program. I saw the shape of something bigger, resourced it, and scaled the vision. Today it's shipping as a bank-wide agentic AI platform. My job as a leader isn't to have the best ideas. It's to recognize them, clear the path to production, and make sure everyone knows where they started.",
    },
    {
      lead: 'Third, every system I\u2019ve built follows the same pattern.',
      body: "Sense the environment, model it, optimize against constraints, close the loop. At a power plant, that meant 90 sensors and Particle Swarm Optimization. In enterprise finance, it means LangGraph agents reasoning about policies while deterministic code enforces entitlements. The technology changes. The pattern doesn't.",
    },
  ],
  closer:
    'I\u2019m always open to conversations about building AI teams, shipping GenAI in regulated industries, and what "production-ready" actually means when the CFO is watching.',
} as const;
