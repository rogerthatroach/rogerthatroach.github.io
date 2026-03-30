'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface EraTransitionProps {
  label: string;
  years: string;
}

export default function EraTransition({ label, years }: EraTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-4 px-6 py-12 md:py-16"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="hidden h-px w-16 origin-right bg-border-subtle sm:block"
      />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <p className="font-mono text-xs tracking-wider text-text-tertiary">
          {label}
        </p>
        <p className="mt-1 font-mono text-[10px] text-text-tertiary/60">
          {years}
        </p>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="hidden h-px w-16 origin-left bg-border-subtle sm:block"
      />
    </div>
  );
}
