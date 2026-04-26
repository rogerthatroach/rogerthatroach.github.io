import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import MultiLevelDiagram from '@/components/playground/diagrams/MultiLevelDiagram';
import { PAR_ASSIST_LEVELS } from '@/data/playgroundDiagrams';

export const metadata: Metadata = {
  title: 'Playground · Diagrams — multi-level architecture',
  description:
    'Click-to-drill architecture of PAR Drafting Assistant across four abstraction levels: Overview → System → Orchestration → Tool contract. Test bed for the diagrams-within-diagrams pattern before promoting to the formal blog post.',
  robots: { index: false, follow: false },
};

export default function DiagramsPlaygroundPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/playground"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Playground
        </Link>

        <div className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Playground · private
          </p>
          <p>
            The experiment: can a single architecture be read usefully at
            multiple abstraction levels, with click-to-drill between them? If
            the pattern holds, the best level(s) get promoted to the formal
            agentic blog post. PAR Drafting Assistant is the test subject because it has
            the most surface area (LangGraph + MCP + 3 RAG scopes) and a
            working single-level baseline in{' '}
            <code className="font-mono text-xs">components/diagrams/PARAssistDiagram.tsx</code>.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/playground/diagrams/samples"
            className="group inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
          >
            See 6 diagram paradigms → samples
          </Link>
          <span className="text-xs text-text-tertiary">
            Sankey · force-directed · swim-lanes · sequence · sunburst · isometric
          </span>
        </div>

        <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          PAR Drafting Assistant · multi-level
        </h1>
        <p className="mb-10 max-w-2xl text-base text-text-secondary">
          Four levels, one system. Start at the Overview (L0) and drill by
          clicking the orchestrator. Or jump directly via the level tabs. Every
          node has hover-reveal description; leaf nodes (no drill) open a
          detail panel with schema or rationale.
        </p>

        <MultiLevelDiagram levels={PAR_ASSIST_LEVELS} />

        {/* How-to-read sidebar */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border-subtle bg-surface/30 p-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              Why four levels
            </p>
            <ul className="ml-5 list-disc space-y-2 text-sm text-text-secondary">
              <li>
                <strong className="text-text-primary">L0 Overview</strong> —
                what the system is in one sentence (four nodes). The answer to
                "what does PAR Drafting Assistant do?"
              </li>
              <li>
                <strong className="text-text-primary">L1 System</strong> — the
                real architecture. Parser · Orchestrator · 4 tools · 3 RAG
                scopes · Responder. The answer to "how is it built?"
              </li>
              <li>
                <strong className="text-text-primary">L2 Orchestration</strong>{' '}
                — LangGraph state machine. Where the decisions happen. The
                answer to "how does it stay deterministic?"
              </li>
              <li>
                <strong className="text-text-primary">L3 Tool contract</strong>{' '}
                — input / logic / output of a single MCP tool. The answer to
                "what does the LLM actually hand off?"
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface/30 p-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              What to evaluate
            </p>
            <ul className="ml-5 list-disc space-y-2 text-sm text-text-secondary">
              <li>
                Does the drill feel natural, or forced? A good drill reveals
                more detail; a bad one just shows a different diagram.
              </li>
              <li>
                Is L2 (state machine) the right level to expose publicly, or
                too internal? Detaching it into its own sub-page might be
                cleaner than drilling.
              </li>
              <li>
                Does the L3 tool contract earn its space? Or is pseudo-code in
                prose sufficient?
              </li>
              <li>
                How does this compare to the current single-level{' '}
                <code className="font-mono text-xs">PARAssistDiagram</code> on
                the formal blog post? Which reads faster for a skimmer?
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-accent/20 bg-accent-muted/40 p-5 text-sm text-text-secondary">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            Next experiments
          </p>
          <ul className="ml-5 list-disc space-y-1 text-sm">
            <li>Add L2 drill to the Responder node (formatting + citation pipeline)</li>
            <li>Apply the multi-level treatment to CFO Analytics Engine (3 parallel sub-agents — cleaner drill shape)</li>
            <li>Scrollytelling variant: scroll-through L0 → L1 → L2 → L3 instead of click-drill</li>
            <li>3D variant: isometric stacked planes per level (opt-in, lazy-loaded)</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
