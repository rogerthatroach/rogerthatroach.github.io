import { HANDS_ON_PCT } from './canonical';

export const ABOUT = {
  opener: 'I lead best when I stay close to the work.',
  paragraphs: [
    `I remain ${HANDS_ON_PCT} hands-on: shaping architecture, writing and reviewing code, testing system behaviour, and following releases into production. I also lead cross-functional delivery, manage one Senior AI Scientist, oversee interns, and contribute to AI/ML hiring.`,
  ],
  beliefs: [
    {
      lead: 'Keep responsibility explicit.',
      body: 'I decide which work may be model-mediated, which must remain deterministic, what evidence is retained, and where a person must review or act. Those boundaries matter more than the novelty of any model or framework.',
    },
    {
      lead: 'Build the path to production, not only the architecture.',
      body: 'For the AI/LLM drafting platform, I carried the work from a one-page product vision through implementation, pilot, and full CFO Group launch. For the AI/LLM workforce analytics platform, I conceived, architected, and built the system while leading its cross-functional production delivery. Direct building and coordinated delivery are both part of the job.',
    },
    {
      lead: 'Treat trust as an operating requirement.',
      body: 'Accuracy is one input. Reviewable evidence, scoped access, clear failure paths, and follow-through after release determine whether people can use a system responsibly. Those controls differ by domain and remain subject to testing, monitoring, and human judgment.',
    },
  ],
  closer:
    'I\u2019m interested in conversations about hands-on AI leadership, production ML systems, and responsible deployment in complex organizations.',
} as const;
