'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Linkedin, ArrowRight, Download, FileText, LayoutList } from 'lucide-react';
import { ABOUT } from '@/data/about';
import { HERO } from '@/data/hero';

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="about" className="px-6 py-8 md:px-16 md:py-10">
      <div className="mx-auto max-w-content">
        <motion.h2
          // initial={false}: h2 is above the fold on mobile; letting it render
          // in its final state removes ~600ms from LCP since the mobile LCP
          // target on /about is this heading (portrait is below on narrow vw).
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-2xl font-bold text-text-primary sm:text-3xl"
        >
          About
        </motion.h2>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,42rem)_auto] lg:gap-14">
          {/* Text column */}
          <div>
            {/* Opener — the thesis. Also above-the-fold on mobile and a likely
                LCP candidate — render at final state immediately. */}
            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold leading-snug text-text-primary sm:text-xl"
            >
              {ABOUT.opener}
            </motion.p>

            {/* Hook paragraphs — render immediately for fast LCP */}
            <div className="mt-4 space-y-3">
              {ABOUT.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm leading-relaxed text-text-secondary"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Three beliefs — render immediately. The first belief paragraph
                is the mobile LCP target (portrait is below-the-fold on narrow
                viewports), so a ~900ms entrance animation was gating LCP. */}
            <ol className="mt-6 space-y-4">
              {ABOUT.beliefs.map((belief, i) => (
                <motion.li
                  key={i}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
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
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-sm leading-relaxed text-text-secondary"
            >
              {ABOUT.closer}
            </motion.p>
          </div>

          {/* Portrait + contact + resume aside.
              initial={false}: portrait is above-the-fold on /about and serves
              as the LCP candidate; render at final state immediately. Body
              text in the left column still fades paragraph-by-paragraph. */}
          <motion.aside
            initial={false}
            animate={{ opacity: 1, y: 0 }}
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
                {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
              />
            </div>

            {/* Contact + resume stack — parallel button treatment so the
                interactive resume, PDF download, and LinkedIn read as
                equally-weighted next steps. Interactive resume leads
                because it's the richest entry point. */}
            <div className="mt-5 space-y-2.5">
              <Link
                href="/resume"
                className="group flex items-center justify-between rounded-lg border border-accent/30 bg-accent-muted px-4 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background"
              >
                <span className="inline-flex items-center gap-2">
                  <LayoutList size={16} />
                  View interactive resume
                </span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>

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
                className="group flex items-center justify-between rounded-lg border border-border-subtle bg-surface/50 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent"
              >
                <span className="inline-flex items-center gap-2">
                  <Download size={16} />
                  Download PDF
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
                  Open PDF in browser
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
