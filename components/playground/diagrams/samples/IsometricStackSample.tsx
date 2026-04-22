'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Isometric stacked planes — layered architecture view using pure CSS 3D
 * transforms (no three.js). Four layers floating in space with dashed
 * vertical connectors.
 *
 * When to use: layered architecture where each layer is qualitatively
 * different. Good for infra / platform / application / UX stacks,
 * protocol stacks, abstraction-level walkthroughs. Reads at a glance;
 * less useful when relationships cross layers non-trivially.
 */

const LAYERS = [
  {
    id: 'ux',
    title: 'UX',
    subtitle: 'React · LLM chat · rich drafting surface',
    items: ['Chat UI', 'Draft editor', 'Diff viewer'],
    color: 'var(--color-accent)',
    y: 0,
  },
  {
    id: 'app',
    title: 'Application',
    subtitle: 'LangGraph agent · MCP tools · deterministic router',
    items: ['Parser', 'Router', 'Tools', 'Observer'],
    color: '#8b5cf6',
    y: 110,
  },
  {
    id: 'platform',
    title: 'Platform',
    subtitle: 'Retrieval · embeddings · eval harness · telemetry',
    items: ['3 RAG scopes', 'pgvector', 'Eval set'],
    color: '#f59e0b',
    y: 220,
  },
  {
    id: 'infra',
    title: 'Infra',
    subtitle: 'PostgreSQL · blob storage · managed compute',
    items: ['PostgreSQL', 'Blob store', 'Compute'],
    color: '#10b981',
    y: 330,
  },
];

export default function IsometricStackSample() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto h-[460px] w-full max-w-[720px]"
      style={{ perspective: '1400px' }}
      aria-label="Isometric stacked architecture diagram with 4 layers (UX, Application, Platform, Infra) viewed from above-right"
    >
      <div
        className="relative h-full w-full"
        style={{
          transform: 'rotateX(58deg) rotateZ(-38deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Vertical connectors (between layer centers) */}
        {[0, 1, 2].map((i) => (
          <div
            key={`conn-${i}`}
            className="absolute left-1/2 w-px"
            style={{
              top: LAYERS[i].y + 50,
              height: LAYERS[i + 1].y - LAYERS[i].y - 10,
              backgroundColor: 'var(--color-text-tertiary)',
              opacity: 0.5,
              transform: 'translateX(-50%)',
            }}
          />
        ))}

        {/* Layer planes */}
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.id}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: layer.y + 30 }}
            animate={{ opacity: 1, y: layer.y }}
            transition={{
              delay: 0.1 + (LAYERS.length - 1 - i) * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 26,
            }}
            className="absolute left-1/2 flex h-20 w-[480px] -translate-x-1/2 flex-col justify-center overflow-hidden rounded-lg border p-4 shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: layer.color,
              boxShadow: `0 20px 40px -10px ${layer.color}33, 0 4px 12px rgba(0,0,0,0.15)`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold" style={{ color: layer.color }}>
                  {layer.title}
                </h3>
                <p className="mt-0.5 text-[10px] leading-snug text-text-tertiary">
                  {layer.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="rounded border px-1.5 py-0.5 text-[9px] font-medium"
                    style={{
                      borderColor: layer.color,
                      color: layer.color,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flat label overlay (not transformed) */}
      <div className="pointer-events-none absolute bottom-2 right-2 text-right">
        <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
          isometric · CSS transforms
        </p>
        <p className="text-[10px] text-text-tertiary">rotateX(58°) rotateZ(-38°)</p>
      </div>
    </div>
  );
}
