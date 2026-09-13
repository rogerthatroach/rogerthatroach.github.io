/**
 * Short definitions for unfamiliar terms in the resume story view.
 *
 * The glossary explains concepts and organizational shorthand that actually
 * appear in the story. Product summaries, achievement claims, and career
 * history stay in their visible sections so a popover is never the only
 * source of evidence.
 */

export const GLOSSARY: Record<string, string> = {
  'CFO Group':
    'The bank\'s enterprise finance organization and the operating group for the finance systems described here.',
  'Mitsubishi Hitachi Power Systems':
    'The engineering and equipment partner for the Maizuru work. Kansai Electric owns and operates the power station.',

  LangGraph:
    'A graph-based workflow orchestration library. In the AI/LLM drafting platform, one graph retains control of the reviewed session path while registered routines perform bounded work.',
  MCP:
    'Model Context Protocol, a standard for exposing tools and context through declared interfaces. The AI/LLM drafting platform uses typed MCP routines for bounded work while its graph retains workflow control.',
  'semantic retrieval':
    'Retrieval that uses embeddings to rank candidates by meaning. The candidate remains evidence to evaluate, not an automatically accepted answer.',
  Entitlement:
    'The current access rules that determine which governed records a caller is authorized to use. The workforce analytics platform resolves that scope before calculation.',
  'cost centre':
    'A lowest-level organizational and accounting unit used in finance reporting. Hierarchy and entitlement rules determine which units may contribute to a calculation.',
  PySpark:
    'The Python interface to Apache Spark. The Commodity Tax Dataiku scenario combined Python and Spark processing, with partitioned data for retrieval and inspection.',
  OCR:
    'Optical character recognition, which turns document images into text and layout information. Small visual controls such as checkboxes may need a separate image path.',
  OpenCV:
    'An open-source computer-vision library. The document workflow used it to localize checkbox regions before classification.',
  'Random Forest':
    'An ensemble of decision trees. In the document workflow it classified checked-versus-unchecked state inside the specialized checkbox component, not the complete document pipeline.',
  'particle swarm optimisation':
    'A population-based search method. The combustion project used it to propose bounded candidate settings for operator review.',
};
