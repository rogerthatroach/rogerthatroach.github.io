import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Playground · Hero — audit spec',
  description:
    'Preview of the audit P0-4 hero: name as eyebrow, thesis H1 with concrete number, role + proof subhead, two CTAs, no portrait.',
  robots: { index: false, follow: false },
};

/**
 * Preview of the audit's P0-4 hero spec, rendered as a sibling route to
 * the live hero. Content follows the audit handoff's P0-4 section
 * literally — eyebrow name, positioning thesis H1, role+proof subhead,
 * two CTAs, no portrait.
 *
 * Kept as /playground/hero-audit so the live / hero stays untouched.
 */
export default function HeroAuditPreviewPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen">
        {/* Private-preview banner */}
        <div className="border-b border-border-subtle bg-amber-500/5 px-6 py-3 md:px-16">
          <div className="mx-auto flex max-w-content items-start gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-500">
              Preview
            </p>
            <p className="text-xs text-text-secondary">
              Audit P0-4 hero spec, not live on{' '}
              <Link href="/" className="text-accent underline underline-offset-4 hover:text-text-primary">
                /
              </Link>
              . Pitch-first composition: name → eyebrow, H1 is the thesis with a concrete number, two explicit CTAs, no portrait.
            </p>
          </div>
        </div>

        {/* === AUDIT HERO === */}
        <section className="relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden">
          <div className="mx-auto max-w-[880px] px-6 pt-16 pb-16 md:px-16 md:pt-24 md:pb-24">
            {/* Eyebrow — name as 12px mono label */}
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-text-tertiary">
              § Harmilap Singh Dhaliwal
            </p>

            {/* H1 — positioning thesis, 48–72px (audit calls for clamp) */}
            <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-text-primary">
              I build AI systems for regulated finance — from physical
              combustion to agentic workflows on $600M+ allocations.
            </h1>

            {/* Subhead — role + proof */}
            <p className="mt-8 max-w-[640px] text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.5] text-text-secondary">
              AI &amp; Data Science Lead at RBC CFO Group. Previously
              Quantiphi, TCS. 7.5 years shipping ML in production.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-text-primary px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Read case studies
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/about"
                className="text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
              >
                Contact / CV
              </Link>
            </div>
          </div>
        </section>

        {/* Notes for comparison */}
        <section className="border-t border-border-subtle px-6 py-14 md:px-16">
          <div className="mx-auto max-w-content">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              What&rsquo;s different from the live hero
            </p>
            <h2 className="mb-6 text-xl font-bold text-text-primary">
              Pitch-first vs identity-first
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  This preview (audit spec)
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-text-secondary">
                  <li>
                    <strong className="text-text-primary">Name is a 12px eyebrow</strong> — tiny,
                    like a page number
                  </li>
                  <li>
                    <strong className="text-text-primary">H1 is the thesis</strong> — 48–72px,
                    one concrete number ($600M+)
                  </li>
                  <li>
                    <strong className="text-text-primary">Subhead is role + proof</strong> —
                    single line, resume-short
                  </li>
                  <li>
                    <strong className="text-text-primary">Two explicit CTAs</strong> — primary
                    filled, secondary text link
                  </li>
                  <li>
                    <strong className="text-text-primary">No portrait</strong> in the hero
                  </li>
                  <li>
                    <strong className="text-text-primary">No industries / experience / socials</strong>{' '}
                    in the hero (moved elsewhere)
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                  Live{' '}
                  <Link href="/" className="text-accent underline underline-offset-4 hover:text-text-primary">
                    /
                  </Link>{' '}
                  (current)
                </p>
                <ul className="space-y-2 text-sm leading-relaxed text-text-secondary">
                  <li>
                    <strong className="text-text-primary">Name is the H1</strong> — dominant
                    element
                  </li>
                  <li>
                    <strong className="text-text-primary">Role is a small eyebrow</strong> above
                    the name
                  </li>
                  <li>
                    <strong className="text-text-primary">Tagline (Fraunces serif)</strong> below
                    the name — arc and current seat
                  </li>
                  <li>
                    <strong className="text-text-primary">Bio line</strong> — journey in one
                    sentence
                  </li>
                  <li>
                    <strong className="text-text-primary">Portrait left, text right</strong> — face-first
                    mnemonic composition
                  </li>
                  <li>
                    <strong className="text-text-primary">Industries + experience + socials</strong>{' '}
                    in a bordered block below
                  </li>
                  <li>
                    <strong className="text-text-primary">No CTAs</strong> in the hero
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-text-secondary">
              <strong className="text-text-primary">Tradeoff.</strong> Audit&rsquo;s hero serves a
              cold recruiter landing from a search result — pitch in 4 seconds, CTA
              visible above the fold. The live hero serves a referral visitor who
              already knows the name — identity, warmth, register.
            </p>
          </div>
        </section>

        <div className="border-t border-border-subtle px-6 py-6 md:px-16">
          <div className="mx-auto max-w-content">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 text-xs text-text-tertiary transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} />
              Back to playground
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
