'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Section from '@/components/ui/Section';
import { AWARDS } from '@/data/awards';

export default function Awards() {
  return (
    <Section id="awards" title="Awards & Recognition">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AWARDS.map((award, i) => (
          <motion.div
            key={`${award.title}-${award.year}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="rounded-lg border border-border-subtle bg-surface p-5"
          >
            <div className="flex items-start gap-3">
              <Trophy size={18} className="mt-0.5 flex-shrink-0 text-accent" />
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {award.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-text-tertiary">
                  {award.org} · {award.year}
                </p>
                {award.detail && (
                  <p className="mt-2 text-xs text-text-secondary">{award.detail}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
