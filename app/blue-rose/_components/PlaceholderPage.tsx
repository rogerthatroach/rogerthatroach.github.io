'use client';

import Link from 'next/link';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

interface PlaceholderPageProps {
  icon: LucideIcon;
  label: string;
  tier: string;
  description: string;
}

/**
 * PlaceholderPage — tier-N future surfaces (compose, audit, workflows,
 * diane) get this until they're built. Calm, not apologetic.
 */
export default function PlaceholderPage({
  icon: Icon,
  label,
  tier,
  description,
}: PlaceholderPageProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex h-full items-center justify-center px-6 py-12"
    >
      <motion.div
        variants={fadeUp}
        className="flex max-w-md flex-col items-center gap-5 text-center"
      >
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--themis-glass-tint)] ring-1 ring-[var(--themis-glass-border)]"
          style={{ color: 'var(--themis-primary)' }}
          aria-hidden="true"
        >
          <Icon size={20} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-text-primary">
            {label}
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
            {tier}
          </p>
        </div>
        <p className="text-[13px] leading-relaxed text-text-secondary">{description}</p>
        <Link
          href="/blue-rose/home"
          className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <ArrowLeft size={11} aria-hidden="true" />
          <span>Back to home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
