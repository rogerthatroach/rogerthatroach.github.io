import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Linkedin, ArrowRight, ScrollText, Waypoints } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SkillGrid from '@/components/resume/SkillGrid';
import { HERO } from '@/data/hero';
import { YEARS_EXPERIENCE } from '@/data/canonical';

export const metadata: Metadata = {
  title: 'Resume — Harmilap Singh Dhaliwal',
  description:
    'Filterable skills grid with first-shipped year and anchor project per capability. Static PDF + LinkedIn + scrollytelling and interactive-timeline variants linked.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'Resume — Harmilap Singh Dhaliwal',
    description:
      'Skills organized by register, anchored to shipped projects. Interactive career timeline lives on the homepage.',
    url: 'https://rogerthatroach.github.io/resume',
    type: 'profile',
  },
};

export default function ResumePage() {
  return (
    <main id="main-content" className="resume-page">
      <Nav />
      <div className="pt-20">
        {/* Hero intro */}
        <section className="px-6 pb-8 pt-4 md:px-16 md:pb-12 md:pt-8">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Interactive Resume
            </p>
            <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {HERO.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              {YEARS_EXPERIENCE} years across industrial, cloud, and financial-services AI.
              Skills below group by register; the interactive career timeline with
              per-role narrative lives on the homepage.
            </p>

            {/* Static PDF + LinkedIn — always available, in the hero area */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background print:hidden"
              >
                <Download size={16} />
                Download PDF
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={HERO.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent print:hidden"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-accent print:hidden"
              >
                Open PDF in new tab
              </a>
            </div>

            {/* Alternative variants */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border-subtle pt-5 print:hidden">
              <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Also try
              </span>
              <Link
                href="/#journey"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/50 px-3 py-1 text-xs transition-colors hover:border-accent/40 hover:text-accent"
              >
                <Waypoints size={12} />
                Interactive timeline (on homepage)
                <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/resume/arc"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/50 px-3 py-1 text-xs transition-colors hover:border-accent/40 hover:text-accent"
              >
                <ScrollText size={12} />
                Scrollytelling variant
                <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Skill grid */}
        <SkillGrid />

        {/* JSON-LD Person schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: HERO.name,
              jobTitle: HERO.title,
              url: 'https://rogerthatroach.github.io/resume',
              sameAs: [HERO.links.linkedin, HERO.links.github],
              email: `mailto:${HERO.links.email}`,
            }),
          }}
        />
      </div>
      <Footer />
    </main>
  );
}
