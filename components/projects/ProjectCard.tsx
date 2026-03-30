'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import type { CaseStudy } from '@/data/projectCaseStudies';
import { useTilt } from '@/lib/useTilt';

interface ProjectCardProps {
  project: Project;
  caseStudy: CaseStudy;
  index: number;
}

export default function ProjectCard({ project, caseStudy, index }: ProjectCardProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt<HTMLDivElement>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out' }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block rounded-xl border border-border-subtle bg-surface/50 p-6 transition-colors hover:bg-surface-hover"
      >
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
            style={{
              color: project.palette.primary,
              backgroundColor: `${project.palette.primary}15`,
              border: `1px solid ${project.palette.primary}30`,
            }}
          >
            {caseStudy.era}
          </span>
          <span className="font-mono text-[10px] text-text-tertiary">
            {caseStudy.timeline}
          </span>
          {caseStudy.status === 'in-progress' && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              In Progress
            </span>
          )}
        </div>

        <h2 className="mt-3 text-lg font-semibold text-text-primary transition-colors group-hover:text-accent">
          {project.title}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{project.subtitle}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="font-mono text-lg font-bold"
            style={{ color: project.palette.primary }}
          >
            {project.heroMetric.value}
          </span>
          <span className="text-xs text-text-tertiary">{project.heroMetric.label}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border px-2 py-0.5 text-[10px]"
              style={{
                borderColor: `${project.palette.primary}30`,
                color: project.palette.primary,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-text-tertiary">
          <span className="font-mono">{project.role}</span>
          <span className="flex items-center gap-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Case study <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
