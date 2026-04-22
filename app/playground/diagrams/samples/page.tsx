import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SankeySample from '@/components/playground/diagrams/samples/SankeySample';
import ForceDirectedSample from '@/components/playground/diagrams/samples/ForceDirectedSample';
import SwimLanesSample from '@/components/playground/diagrams/samples/SwimLanesSample';
import SequenceDiagramSample from '@/components/playground/diagrams/samples/SequenceDiagramSample';
import SunburstSample from '@/components/playground/diagrams/samples/SunburstSample';
import IsometricStackSample from '@/components/playground/diagrams/samples/IsometricStackSample';

export const metadata: Metadata = {
  title: 'Playground · Diagram samples — 6 paradigms with synthetic data',
  description:
    'Six diagram paradigms rendered with synthetic data: Sankey, force-directed, swim-lanes, sequence, sunburst, isometric stack. Each shows what the shape is good for so we can pick the right one per blog post.',
  robots: { index: false, follow: false },
};

interface Sample {
  title: string;
  kind: string;
  whenToUse: string;
  component: React.ReactNode;
}

const SAMPLES: Sample[] = [
  {
    title: 'Sankey',
    kind: 'flow · volume',
    whenToUse:
      'Volume-weighted flow: show how quantity X moves through stages A → B → C. Band widths proportional to throughput. Good for funnels, data pipelines, budget flows.',
    component: <SankeySample />,
  },
  {
    title: 'Force-directed',
    kind: 'relationship · cluster',
    whenToUse:
      'Relationship networks where the overall shape matters more than any specific edge. Natural clustering exposes communities. Good for dependency graphs, agent × tool networks, data lineage.',
    component: <ForceDirectedSample />,
  },
  {
    title: 'Swim lanes',
    kind: 'actor × time',
    whenToUse:
      'Multi-actor orchestration over time. Each row is an actor; each column is a time step. Good for "who did what when" stories, distributed request flows, multi-agent handoffs.',
    component: <SwimLanesSample />,
  },
  {
    title: 'Sequence diagram',
    kind: 'messages × lifelines',
    whenToUse:
      'Temporal message flow with precise ordering. Vertical lifelines + horizontal arrows. Good for API walk-throughs, protocol descriptions, distributed-system call graphs. UML classic.',
    component: <SequenceDiagramSample />,
  },
  {
    title: 'Sunburst',
    kind: 'proportional hierarchy',
    whenToUse:
      'Hierarchical proportions where both the top-level split AND the sub-splits matter. Inner ring = parents; outer ring = children. Good for volume-across-systems breakdowns, budget-by-team.',
    component: <SunburstSample />,
  },
  {
    title: 'Isometric stack',
    kind: 'layered architecture',
    whenToUse:
      'Layered architecture where each layer is qualitatively different. Reads at a glance. Good for infra/platform/app/UX stacks, protocol stacks, abstraction walkthroughs. Less useful when relationships cross layers non-trivially.',
    component: <IsometricStackSample />,
  },
];

export default function DiagramSamplesPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/playground/diagrams"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Diagrams playground
        </Link>

        <div className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Playground · private
          </p>
          <p>
            Six diagram paradigms rendered with synthetic data so we can see
            what each shape is <em>good for</em> before committing any of them
            to real posts. Each sample is self-contained SVG / CSS (no
            library beyond what&rsquo;s already installed) so swapping in real
            data is a single data-object rewrite.
          </p>
        </div>

        <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Diagram paradigms — sample set
        </h1>
        <p className="mb-12 max-w-2xl text-base text-text-secondary">
          One diagram type per section. The caption under each explains{' '}
          <strong className="text-text-primary">when</strong> it&rsquo;s the
          right tool. None of these are the PAR Assist architecture — this is
          about the <em>shape</em> of the diagram, not the system it describes.
        </p>

        <div className="space-y-12">
          {SAMPLES.map((sample, i) => (
            <section
              key={sample.title}
              className="rounded-2xl border border-border-subtle bg-surface/30 p-6 md:p-8"
            >
              <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border-subtle pb-4">
                <div>
                  <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
                    Paradigm {i + 1} of {SAMPLES.length} · {sample.kind}
                  </p>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
                    {sample.title}
                  </h2>
                </div>
              </header>

              <div className="rounded-xl border border-border-subtle bg-background/40 p-4 md:p-6">
                {sample.component}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                <span className="mr-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent">
                  When to use
                </span>
                {sample.whenToUse}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border-subtle bg-surface/30 p-5 text-sm text-text-secondary">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            Picking the right paradigm
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong className="text-text-primary">Flow with volume?</strong>{' '}
              Sankey.
            </li>
            <li>
              <strong className="text-text-primary">Cluster / relationship
              shape?</strong> Force-directed.
            </li>
            <li>
              <strong className="text-text-primary">Multi-actor handoff
              over time?</strong> Swim lanes.
            </li>
            <li>
              <strong className="text-text-primary">Message exchange with
              precise ordering?</strong> Sequence.
            </li>
            <li>
              <strong className="text-text-primary">Proportional
              hierarchy?</strong> Sunburst (or treemap for space efficiency).
            </li>
            <li>
              <strong className="text-text-primary">Layered
              architecture?</strong> Isometric stack.
            </li>
          </ul>
          <p className="mt-3 text-xs text-text-tertiary">
            None of these replace the existing ReactFlow agent diagrams — they
            expand the vocabulary for future posts. Pick per story.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
