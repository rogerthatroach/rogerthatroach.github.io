'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Briefcase, CheckCircle2, XCircle } from 'lucide-react';
import type { Project } from '@/data/projects';
import type { CaseStudy } from '@/data/projectCaseStudies';
import PageTransition from '@/components/ui/PageTransition';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

interface CaseStudyLayoutProps {
  project: Project;
  caseStudy: CaseStudy;
  diagram: React.ReactNode;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="mt-16"
    >
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </motion.div>
  );
}

export default function CaseStudyLayout({ project, caseStudy, diagram }: CaseStudyLayoutProps) {
  const { sections } = caseStudy;

  return (
    <PageTransition>
      <Nav />
      <div className="px-6 pt-24 pb-12 md:px-16">
        <div className="mx-auto max-w-content">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
            <span className="text-text-tertiary/40">/</span>
            <Link
              href="/projects"
              className="text-sm text-text-tertiary transition-colors hover:text-accent"
            >
              Projects
            </Link>
          </div>

          {/* Header */}
          <motion.div
            custom={0}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 font-mono text-xs font-medium"
                style={{
                  color: project.palette.primary,
                  backgroundColor: `${project.palette.primary}15`,
                  border: `1px solid ${project.palette.primary}30`,
                }}
              >
                {caseStudy.era}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <Calendar size={12} />
                {caseStudy.timeline}
              </span>
              {caseStudy.status === 'in-progress' && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                  In Productionization
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-2 font-mono text-sm tracking-widest text-accent">
              {project.subtitle}
            </p>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              {project.caption}
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
            <div className="rounded-lg border border-border-subtle bg-surface p-4">
              <span className="font-mono text-xl font-bold text-accent">
                {project.heroMetric.value}
              </span>
              <p className="mt-1 text-xs text-text-tertiary">{project.heroMetric.label}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-surface p-4">
              <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-accent">
                <Briefcase size={14} />
                Role
              </span>
              <p className="mt-1 text-xs text-text-tertiary">{project.role}</p>
            </div>
            {project.stack.slice(0, 2).map((tech) => (
              <div key={tech} className="rounded-lg border border-border-subtle bg-surface p-4">
                <span className="font-mono text-sm font-bold text-accent">{tech}</span>
                <p className="mt-1 text-xs text-text-tertiary">Core Technology</p>
              </div>
            ))}
          </motion.div>

          {/* Context */}
          <Section title="Context">
            <p>{sections.context}</p>
          </Section>

          {/* My Role */}
          <Section title="My Role">
            <p>{sections.myRole}</p>
          </Section>

          {/* Stakeholders */}
          <Section title="Stakeholders">
            <p>{sections.stakeholders}</p>
          </Section>

          {/* The Challenge */}
          <Section title="The Challenge">
            <p>{sections.challenge}</p>
          </Section>

          {/* Options Considered */}
          <Section title="Options Considered">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sections.optionsConsidered.map((opt) => (
                <div
                  key={opt.option}
                  className={`rounded-lg border p-4 transition-colors ${
                    opt.chosen
                      ? 'border-accent/40 bg-accent-muted'
                      : 'border-border-subtle bg-surface'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {opt.chosen ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
                    ) : (
                      <XCircle size={16} className="mt-0.5 shrink-0 text-text-tertiary" />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        {opt.option}
                        {opt.chosen && (
                          <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
                            Chosen
                          </span>
                        )}
                      </p>
                      <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
                        {opt.prosAndCons}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* The Decision */}
          <Section title="The Decision">
            <p>{sections.decision}</p>
          </Section>

          {/* Architecture Diagram */}
          <Section title="Architecture">
            <p className="mb-4 text-xs text-text-tertiary">
              Interactive diagram — hover nodes for details, pan and zoom to explore
            </p>
            {diagram}
          </Section>

          {/* Implementation */}
          <Section title="Implementation">
            <p>{sections.implementation}</p>
          </Section>

          {/* Impact */}
          <Section title="Impact">
            <p>{sections.impact}</p>
          </Section>

          {/* In Production */}
          <Section title="In Production">
            <p>{sections.inProduction}</p>
          </Section>

          {/* Lessons Learned */}
          <Section title="Lessons Learned">
            <p>{sections.lessonsLearned}</p>
          </Section>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-xl font-bold text-text-primary">Tech Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Blog Post CTA */}
          {caseStudy.blogPostSlug && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16 mb-12 rounded-lg border border-accent/20 bg-accent-muted p-6"
            >
              <p className="text-sm font-medium text-text-primary">Technical Deep Dive</p>
              <p className="mt-2 text-sm text-text-secondary">
                For the formal architecture, proofs, and implementation details — read the full technical write-up.
              </p>
              <Link
                href={`/blog/${caseStudy.blogPostSlug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-text-primary"
              >
                Read the technical paper
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}
