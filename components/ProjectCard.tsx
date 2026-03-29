'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDeepDive = !!project.deepDivePath;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div
        className={cn(
          'group rounded-lg border border-border-subtle bg-surface p-6 transition-all duration-300',
          hasDeepDive
            ? 'cursor-pointer hover:bg-surface-hover hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5'
            : 'cursor-pointer hover:bg-surface-hover',
          !hasDeepDive && isExpanded && 'bg-surface-hover'
        )}
        onClick={() => {
          if (!hasDeepDive) setIsExpanded(!isExpanded);
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-zinc-50 sm:text-xl">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">{project.subtitle}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="font-mono text-xl font-bold text-accent sm:text-2xl">
                {project.heroMetric.value}
              </span>
              <p className="text-xs text-zinc-500">{project.heroMetric.label}</p>
            </div>
            {hasDeepDive ? (
              <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-md group-hover:shadow-accent/10">
                See in action <ArrowRight size={12} />
              </span>
            ) : (
              <ChevronDown
                size={18}
                className={cn(
                  'text-zinc-500 transition-transform duration-300',
                  isExpanded && 'rotate-180'
                )}
              />
            )}
          </div>
        </div>

        {/* Tech tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-accent-muted/50 px-3 py-1 font-mono text-xs text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Brief description always visible for deep dive cards */}
        {hasDeepDive && (
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {project.description}
          </p>
        )}

        {/* Expandable content for non-deep-dive cards */}
        {!hasDeepDive && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-6 border-t border-border-subtle pt-6">
                  <p className="text-sm font-medium text-zinc-300">
                    {project.role}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                    {project.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {project.highlights.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 border-l-2 border-accent/30 pl-4 text-sm italic text-zinc-500">
                    {project.narrative}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );

  if (hasDeepDive) {
    return <Link href={project.deepDivePath!}>{card}</Link>;
  }

  return card;
}
