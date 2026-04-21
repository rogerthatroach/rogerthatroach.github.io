'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Scroll-driven 2D layer-by-layer reveal — the core scrollytelling
 * primitive for blog posts.
 *
 * Layers stack vertically. As the reader scrolls through the container,
 * each layer fades in + elevates (y translation) within its scroll
 * segment. The effect: architecture (or any layered concept) "unfolds"
 * as the reader progresses, instead of landing all at once.
 *
 * Respects prefers-reduced-motion — all transforms become no-ops and
 * layers render at rest.
 *
 * Usage:
 *
 *   <LayeredReveal
 *     label="Architecture unfolds"
 *     layers={[
 *       { label: 'Orchestration', content: <>...</> },
 *       { label: 'Tools', content: <>...</> },
 *       { label: 'Retrieval', content: <>...</> },
 *       { label: 'Storage', content: <>...</> },
 *     ]}
 *   />
 */
export interface Layer {
  label: string;
  content: React.ReactNode;
  /** Optional accent color hex (defaults to site accent). */
  accent?: string;
}

export default function LayeredReveal({
  layers,
  label,
}: {
  layers: Layer[];
  label?: string;
}) {
  return (
    <figure className="my-10 not-prose">
      {label && (
        <p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-accent">
          {label}
        </p>
      )}
      <div className="space-y-6">
        {layers.map((layer, i) => (
          <LayerPanel
            key={i}
            layer={layer}
            index={i}
            total={layers.length}
          />
        ))}
      </div>
    </figure>
  );
}

function LayerPanel({
  layer,
  index,
  total,
}: {
  layer: Layer;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'center 60%'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  const style = reduceMotion ? {} : { opacity, y, scale };

  return (
    <motion.div
      ref={ref}
      style={style}
      className={cn(
        'rounded-xl border border-border-subtle bg-surface/60 p-5 shadow-sm backdrop-blur-sm md:p-6'
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-primary">
          {layer.label}
        </h3>
        <span
          aria-hidden="true"
          className="font-mono text-[10px] text-text-tertiary"
          style={layer.accent ? { color: layer.accent } : undefined}
        >
          Layer {index + 1} / {total}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-text-secondary">
        {layer.content}
      </div>
    </motion.div>
  );
}
