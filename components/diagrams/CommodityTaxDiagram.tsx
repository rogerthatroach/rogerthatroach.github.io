'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CommodityTaxDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <div
      ref={ref}
      className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface/50 backdrop-blur-sm sm:h-[500px]"
    >
      <div className="flex items-center gap-6 px-8 sm:gap-10">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Calendar stack — months of manual work */}
          <div className="mx-auto mb-4 flex flex-col items-center gap-1">
            {[0.2, 0.35, 0.5, 0.65, 0.8].map((opacity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity, scale: 1 } : {}}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="flex h-10 w-14 items-center justify-center rounded border border-red-500/30 bg-red-500/10 sm:h-12 sm:w-16"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-red-400">
                  <rect x="2" y="4" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="2" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="6" y1="2" x2="6" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="2" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            ))}
          </div>
          <span className="font-mono text-xl font-bold text-red-400 sm:text-2xl">Months</span>
          <span className="mt-1 block text-xs text-text-tertiary">Manual process</span>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="origin-left"
        >
          <svg width="60" height="24" viewBox="0 0 60 24" className="sm:w-20">
            <motion.line
              x1="0" y1="12" x2="48" y2="12"
              stroke="currentColor"
              strokeWidth="2"
              className="text-text-tertiary"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.4 }}
            />
            <motion.polygon
              points="46,6 58,12 46,18"
              fill="currentColor"
              className="text-text-tertiary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
            />
          </svg>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          {/* Clock */}
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/10 sm:h-28 sm:w-28">
            <svg width="48" height="48" viewBox="0 0 48 48" className="text-green-400">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
              <motion.line
                x1="24" y1="24" x2="24" y2="10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ rotate: 0 }}
                animate={isInView ? { rotate: 360 } : {}}
                transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                style={{ transformOrigin: '24px 24px' }}
              />
              <motion.line
                x1="24" y1="24" x2="34" y2="24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ rotate: 0 }}
                animate={isInView ? { rotate: 90 } : {}}
                transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                style={{ transformOrigin: '24px 24px' }}
              />
              <circle cx="24" cy="24" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="font-mono text-xl font-bold text-green-400 sm:text-2xl">90 min</span>
          <span className="mt-1 block text-xs text-text-tertiary">Automated pipeline</span>
        </motion.div>
      </div>
    </div>
  );
}
