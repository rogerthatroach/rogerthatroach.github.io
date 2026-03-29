'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Project } from '@/data/projects';

interface ProjectShowcaseProps {
  project: Project;
  diagram: React.ReactNode;
  index: number;
}

export default function ProjectShowcase({ project, diagram, index }: ProjectShowcaseProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      className={`relative min-h-screen overflow-hidden bg-gradient-to-b ${project.palette.bg} to-transparent`}
    >
      {/* Ghosted project number */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="select-none font-mono text-[20rem] font-bold leading-none opacity-[0.03] sm:text-[28rem]"
          style={{ color: project.palette.primary }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-content flex-col items-center justify-center gap-8 px-6 py-16 md:px-16 lg:flex-row lg:gap-12">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className={`w-full shrink-0 lg:w-[35%] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
        >
          {/* Title */}
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: project.palette.primary }}
          >
            {project.title}
          </h2>

          <p className="mt-1 text-sm text-text-secondary">{project.subtitle}</p>

          {/* Hero metric */}
          <div className="mt-6 flex items-baseline gap-3">
            <span
              className="font-mono text-3xl font-bold sm:text-4xl"
              style={{ color: project.palette.primary }}
            >
              {project.heroMetric.value}
            </span>
            <span className="text-xs text-text-tertiary">{project.heroMetric.label}</span>
          </div>

          {/* Caption */}
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {project.caption}
          </p>

          {/* Role */}
          <p className="mt-3 font-mono text-xs text-text-tertiary">
            {project.role}
          </p>

          {/* Tech stack */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border px-2.5 py-0.5 text-xs"
                style={{
                  borderColor: `${project.palette.primary}30`,
                  color: project.palette.primary,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Thin accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 h-px w-16 origin-left"
            style={{ backgroundColor: project.palette.primary }}
          />
        </motion.div>

        {/* Diagram side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className={`w-full lg:w-[65%] ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
        >
          {diagram}
        </motion.div>
      </div>
    </section>
  );
}
