import type { Metadata } from 'next';
import { Download, Linkedin, FileText, ChevronDown } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ResumeMetrics from '@/components/resume/ResumeMetrics';
import CurrentRoleCard from '@/components/resume/CurrentRoleCard';
import CollapsibleSection from '@/components/resume/CollapsibleSection';
import SkillGrid from '@/components/resume/SkillGrid';
import EducationList from '@/components/resume/EducationList';
import AwardsPanel from '@/components/resume/AwardsPanel';
import WritingLinks from '@/components/resume/WritingLinks';
import ArcProgress from '@/components/resume/arc/ArcProgress';
import EraChapter from '@/components/resume/arc/EraChapter';
import { HERO } from '@/data/hero';
import { TIMELINE } from '@/data/timeline';
import { YEARS_EXPERIENCE } from '@/data/canonical';
import { SKILLS, SKILL_CATEGORIES } from '@/data/skills';
import { AWARDS } from '@/data/awards';
import { EDUCATION, CREDENTIALS } from '@/data/education';

export const metadata: Metadata = {
  title: 'Resume — Harmilap Singh Dhaliwal',
  description:
    'Scrollytelling career arc across four abstraction levels — physical, cloud, financial, intelligent — bookended by current-role context and collapsible deep-dives on skills, education, awards, and writing.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'Resume — Harmilap Singh Dhaliwal',
    description:
      'Scrollytelling career arc with collapsible skills, education, awards, and writing links.',
    url: 'https://rogerthatroach.github.io/resume',
    type: 'profile',
  },
};

export default function ResumePage() {
  return (
    <main id="main-content" className="resume-page">
      <Nav />
      <ArcProgress eras={TIMELINE} />

      <div className="pt-20">
        {/* ─── TOP MATERIAL — hero + actions + metrics + current-role card ─── */}
        <section className="px-6 pb-10 pt-6 md:px-16 md:pb-14 md:pt-10">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Interactive Resume
            </p>
            <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {HERO.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              {HERO.title} · {YEARS_EXPERIENCE} years across industrial, cloud, and
              financial-services AI. The scroll arc below traces the same closed-loop
              pattern across four substrates. Details live in the collapsed sections
              beneath — open what matters.
            </p>

            {/* Actions — PDFs grouped together, LinkedIn separated */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background print:hidden"
              >
                <Download size={16} aria-hidden="true" />
                Download PDF
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-accent print:hidden"
              >
                <FileText size={16} aria-hidden="true" />
                Open in new tab
              </a>
              <span className="mx-1 hidden h-6 w-px bg-border-subtle sm:inline-block" />
              <a
                href={HERO.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent print:hidden"
              >
                <Linkedin size={16} aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* Headline metrics strip */}
        <section className="px-6 md:px-16">
          <div className="mx-auto max-w-content border-y border-border-subtle py-8 md:py-10">
            <ResumeMetrics />
          </div>
        </section>

        {/* Current role card */}
        <section className="px-6 pb-16 pt-10 md:px-16 md:pb-20 md:pt-14">
          <div className="mx-auto max-w-content">
            <CurrentRoleCard />
          </div>
        </section>

        {/* ─── SCROLLYTELLING MIDDLE — career arc ─── */}
        <section className="px-6 py-16 md:px-16 md:py-20 print:hidden">
          <div className="mx-auto max-w-content">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Career Arc
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              Same pattern.
              <br />
              Four abstraction levels.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
              Every role runs the same loop:{' '}
              <strong className="text-text-primary">
                sense → model → optimize → act.
              </strong>{' '}
              Starting from today — enterprise agentic AI — and tracing the pattern
              back through financial services, cloud ML, and the industrial machine
              learning where it was forged. Scroll to trace the arc.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-text-tertiary">
              <ChevronDown size={14} aria-hidden="true" />
              Scroll to begin
            </div>
          </div>
        </section>

        {TIMELINE.map((era, i) => (
          <EraChapter key={era.id} era={era} index={i} total={TIMELINE.length} />
        ))}

        {/* Pattern outro */}
        <section className="border-t border-border-subtle px-6 py-20 md:px-16 md:py-24 print:hidden">
          <div className="mx-auto max-w-content">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              The pattern, stated
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-snug text-text-primary sm:text-3xl md:text-4xl">
              Sense the state of the system. Model it. Optimize against a goal. Act —
              and close the loop.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
              Across four substrates — physical plant, cloud document pipelines,
              enterprise finance, agentic AI — the engineering discipline rhymes.
              That&rsquo;s the arc.
            </p>
          </div>
        </section>

        {/* ─── BOTTOM MATERIAL — collapsible deep-dives ─── */}
        <section className="px-6 pb-24 pt-10 md:px-16 md:pt-12">
          <div className="mx-auto max-w-content space-y-3">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Deep dives · open what matters
            </p>

            <CollapsibleSection
              title="Skills"
              summary={`${SKILLS.length} capabilities across ${SKILL_CATEGORIES.length} registers — filter or scan all`}
            >
              <SkillGrid />
            </CollapsibleSection>

            <CollapsibleSection
              title="Education & Credentials"
              summary={`${EDUCATION.length} degrees · ${CREDENTIALS.length} continuing-ed`}
            >
              <EducationList />
            </CollapsibleSection>

            <CollapsibleSection
              title="Awards & Recognition"
              summary={`${AWARDS.length} awards across RBC and TCS`}
            >
              <AwardsPanel />
            </CollapsibleSection>

            <CollapsibleSection title="Writing" summary="Blog + long-form papers (in progress)">
              <WritingLinks />
            </CollapsibleSection>
          </div>
        </section>

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
