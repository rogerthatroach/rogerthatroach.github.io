'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Linkedin, ArrowRight, Download, FileText } from 'lucide-react';
import { ABOUT } from '@/data/about';
import { HERO } from '@/data/hero';

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="about" className="px-6 py-8 md:px-16 md:py-10">
      <div className="mx-auto max-w-content">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-2xl font-bold text-text-primary sm:text-3xl"
        >
          About
        </motion.h2>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,42rem)_auto] lg:gap-14">
          {/* Text column */}
          <div>
            {/* Opener — the thesis */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-lg font-semibold leading-snug text-text-primary sm:text-xl"
            >
              {ABOUT.opener}
            </motion.p>

            {/* Hook paragraphs */}
            <div className="mt-4 space-y-3">
              {ABOUT.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="text-sm leading-relaxed text-text-secondary"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Three beliefs */}
            <ol className="mt-6 space-y-4">
              {ABOUT.beliefs.map((belief, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="border-l-2 border-accent/40 pl-5"
                >
                  <p className="text-sm leading-relaxed text-text-secondary">
                    <span className="font-semibold text-text-primary">{belief.lead}</span>{' '}
                    {belief.body}
                  </p>
                </motion.li>
              ))}
            </ol>

            {/* Closer — CTA */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-6 text-sm leading-relaxed text-text-secondary"
            >
              {ABOUT.closer}
            </motion.p>
          </div>

          {/* Portrait + contact + resume aside */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:w-[280px]"
          >
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/portrait.webp"
                srcSet="/images/portrait-sm.webp 700w, /images/portrait.webp 1000w"
                sizes="280px"
                alt="Harmilap Singh Dhaliwal"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Contact + resume stack — parallel button treatment so LinkedIn
                and Resume read as equally-weighted next steps. */}
            <div className="mt-5 space-y-2.5">
              <a
                href={HERO.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-border-subtle bg-surface/50 px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
              >
                <span className="inline-flex items-center gap-2">
                  <Linkedin size={16} />
                  Connect on LinkedIn
                </span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group flex items-center justify-between rounded-lg border border-accent/30 bg-accent-muted px-4 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
              >
                <span className="inline-flex items-center gap-2">
                  <Download size={16} />
                  Download resume
                </span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-border-subtle bg-surface/50 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
              >
                <span className="inline-flex items-center gap-2">
                  <FileText size={16} />
                  Open resume in browser
                </span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
