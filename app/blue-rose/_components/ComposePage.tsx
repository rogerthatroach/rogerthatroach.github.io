'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, PenLine, Sparkles } from 'lucide-react';
import { useThemis, usePersonaMap } from '../_lib/store';
import RoutingPreviewCard from './RoutingPreviewCard';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * ComposePage — `/blue-rose/compose`.
 *
 * T1.9 fill: coming-soon copy for the multi-step compose flow (T2 builds
 * the full modal) + a live Routing Preview demo card driven by the two
 * hero submissions' `diane.routingPreview`. This is the credibility-floor
 * surface — a stakeholder who clicks Compose immediately sees what Diane
 * does at submit time, even though the form itself isn't built yet.
 */
export default function ComposePage() {
  const { seed } = useThemis();
  const personaMap = usePersonaMap();

  const previewable = useMemo(
    () => seed.submissions.filter((s) => !!s.diane?.routingPreview).slice(0, 2),
    [seed.submissions],
  );
  const [activeId, setActiveId] = useState(previewable[0]?.id ?? null);
  const active = previewable.find((s) => s.id === activeId) ?? previewable[0];

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14"
      >
        {/* Hero */}
        <motion.div variants={fadeUp} className="mb-8">
          <span
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--themis-glass-tint)] ring-1 ring-[var(--themis-glass-border)]"
            style={{ color: 'var(--themis-primary)' }}
            aria-hidden="true"
          >
            <PenLine size={18} />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
            Tier 2 · arriving next
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
            Compose a request
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-text-secondary">
            The multi-step submission flow ships in T2 — drop a document, watch
            Diane retrieve the relevant field-groups, draft the form fields with
            citations + confidence, and preview the routing chain before submit.
            Same architecture as PAR Assist Phase 1 (single-agent governance
            envelope · two-stage field-group retrieval · N parallel scoped
            extraction · coverage analyzer), applied to approval review instead
            of PAR drafting.
          </p>
        </motion.div>

        {/* Live routing-preview demo */}
        {active && active.diane && (
          <>
            <motion.div variants={fadeUp} className="mb-3 flex items-center gap-2">
              <Sparkles
                size={12}
                style={{ color: '#F59E0B' }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
                Live routing preview · driven by Diane payloads in seed
              </span>
            </motion.div>

            {previewable.length > 1 && (
              <motion.nav
                variants={fadeUp}
                role="tablist"
                aria-label="Hero scenarios"
                className="mb-3 flex gap-1"
              >
                {previewable.map((s) => {
                  const isActive = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
                        isActive
                          ? 'border-[var(--themis-primary)]/50 bg-[var(--themis-glass-tint)] text-text-primary'
                          : 'border-border-subtle bg-surface/40 text-text-secondary hover:border-[var(--themis-primary)]/40 hover:text-text-primary',
                      )}
                    >
                      <FileText size={10} aria-hidden="true" />
                      <span>{s.kind.replace(/-/g, ' ')}</span>
                    </button>
                  );
                })}
              </motion.nav>
            )}

            <motion.div variants={fadeUp}>
              <RoutingPreviewCard
                diane={active.diane}
                personaMap={personaMap}
                submissionTitle={active.title}
              />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-2xl text-[12.5px] leading-relaxed text-text-secondary"
            >
              The same façade renders pre-submit on the review step in T2.
              Submitters see the predicted chain (with rule-id provenance + MCP
              tool footprint + field-group coverage) before clicking submit, so
              there are no surprises about who gets the request next.
            </motion.p>
          </>
        )}

        <motion.div variants={fadeUp} className="mt-10">
          <Link
            href="/blue-rose/home"
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary transition-colors hover:text-text-primary"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
