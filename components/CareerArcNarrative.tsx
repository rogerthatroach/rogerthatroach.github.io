'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CareerArcNarrative() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="px-6 py-20 md:px-16 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-widest text-text-tertiary"
        >
          The through-line
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-base leading-relaxed text-text-secondary"
        >
          Every system I&apos;ve built follows the same pattern: sense the environment, model it,
          optimize against constraints, and close the loop. At a power plant, that meant sensors
          and Particle Swarm Optimization. In the cloud, document pipelines and Vertex AI.
          In enterprise finance, agentic frameworks where LLMs reason about intent and
          deterministic code handles truth.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 text-base leading-relaxed text-text-secondary"
        >
          The technology changes. The pattern doesn&apos;t.
        </motion.p>
      </div>
    </section>
  );
}
