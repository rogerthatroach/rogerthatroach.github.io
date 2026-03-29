'use client';

import { motion } from 'framer-motion';
import { Bot, Layers, Shield, FileText, Workflow, Database } from 'lucide-react';
import dynamic from 'next/dynamic';
import PageTransition from '@/components/ui/PageTransition';
import BackLink from '@/components/ui/BackLink';
import Nav from '@/components/Nav';

const PARAssistFlow = dynamic(() => import('@/components/diagrams/PARAssistFlow'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[700px] w-full items-center justify-center rounded-xl border border-border-subtle bg-surface">
      <span className="text-sm text-text-tertiary">Loading architecture diagram...</span>
    </div>
  ),
});

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

const TECH_PILLARS = [
  {
    icon: Workflow,
    title: 'LangGraph Orchestration',
    description:
      'Stateful agent graph manages the entire PAR workflow — routing between MCP tools, maintaining conversation state, and handling multi-turn interactions without context loss.',
    color: 'text-blue-500',
  },
  {
    icon: Bot,
    title: 'MCP Tools',
    description:
      'Four specialized Model Context Protocol tools: template selection, field assignment, conflict resolution, and ambiguity checking. Each tool is deterministic and auditable.',
    color: 'text-amber-500',
  },
  {
    icon: Layers,
    title: 'Multi-Layer RAG',
    description:
      'Three independent retrieval layers — conversation history (no context loss), uploaded documents (PDF, PPTX, DOCX, TXT with chunking + embeddings), and field assignment prompts.',
    color: 'text-purple-500',
  },
  {
    icon: Database,
    title: 'PostgreSQL + Embeddings',
    description:
      'Persistent vector storage for semantic search across enterprise documents. Chunking pipeline processes uploaded files into searchable embeddings.',
    color: 'text-cyan-500',
  },
  {
    icon: FileText,
    title: 'Enterprise Document Processing',
    description:
      'Full pipeline for PDF, PPTX, DOCX, and TXT ingestion — extracting text, metadata, and structure for RAG retrieval and field population.',
    color: 'text-emerald-500',
  },
  {
    icon: Shield,
    title: 'Governance by Design',
    description:
      'PARs are a critical governance process. Every field assignment is traceable to a source — policy, historical example, or user input. No hallucinated content.',
    color: 'text-rose-500',
  },
];

export default function PARAssistContent() {
  return (
    <PageTransition>
      <Nav />
      <div className="px-6 pt-24 pb-12 md:px-16">
        <div className="mx-auto max-w-content">
          <BackLink />

          {/* Header */}
          <motion.div
            custom={0}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <p className="mb-2 font-mono text-sm tracking-widest text-accent">
              Enterprise Agentic AI Platform
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              PAR Assist
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              Enterprise-wide drafting tool for Project Approval Requests — powered by
              LangGraph agentic orchestration, MCP tools, and multi-layer RAG.
            </p>
          </motion.div>

          {/* Key stats */}
          <motion.div
            custom={1}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { value: 'Bank-wide', label: 'Target Scale' },
              { value: '4', label: 'MCP Tools' },
              { value: '3', label: 'RAG Layers' },
              { value: 'LangGraph', label: 'Orchestration' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border-subtle bg-surface p-4"
              >
                <span className="font-mono text-xl font-bold text-accent">
                  {stat.value}
                </span>
                <p className="mt-1 text-xs text-text-tertiary">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Origin story */}
          <motion.div
            custom={2}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-text-primary">The Story</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
              <p>
                PAR Assist started as an idea from the 2025 Amplify internship program. An
                intern proposed a tool to help with Project Approval Requests — the governance
                documents required for every major initiative at the bank.
              </p>
              <p>
                I saw the potential to scale it from a prototype into an enterprise-wide
                platform. I conceived the product vision, defined the strategic and technical
                requirements, and designed the agentic architecture that makes it work.
              </p>
              <p>
                The result: a personal AI assistant that guides users through each step of a
                PAR, utilizing metadata, rules, policies, historical examples, and best practices.
                No hallucinated content — every field assignment is traceable to a source.
              </p>
            </div>
          </motion.div>

          {/* Architecture diagram */}
          <motion.div
            custom={3}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-text-primary">Architecture</h2>
            <p className="mt-2 mb-6 text-sm text-text-tertiary">
              Interactive diagram — hover nodes for details, pan and zoom to explore
            </p>
            <PARAssistFlow />
          </motion.div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-tertiary">
            {[
              { color: 'bg-emerald-500', label: 'User' },
              { color: 'bg-blue-500', label: 'Orchestrator' },
              { color: 'bg-amber-500', label: 'MCP Tools' },
              { color: 'bg-purple-500', label: 'RAG Layers' },
              { color: 'bg-cyan-500', label: 'Storage & Output' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Technical pillars */}
          <motion.div
            custom={4}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-text-primary">Technical Deep Dive</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TECH_PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="rounded-lg border border-border-subtle bg-surface p-5 transition-colors hover:bg-surface-hover"
                >
                  <pillar.icon size={20} className={pillar.color} />
                  <h3 className="mt-3 text-sm font-semibold text-text-primary">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Role callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 mb-12 rounded-lg border border-accent/20 bg-accent-muted p-6"
          >
            <p className="text-sm font-medium text-text-primary">My Role</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Conceived the product vision. Defined strategic and technical requirements.
              Designed the LangGraph agentic architecture, MCP tool specifications, and
              multi-layer RAG strategy. Leading the productionization from intern POC to
              bank-wide enterprise platform.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
