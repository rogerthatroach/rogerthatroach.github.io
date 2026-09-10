import type { Metadata } from 'next';
import { Download, Linkedin } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ResumeMetrics from '@/components/resume/ResumeMetrics';
import CollapsibleSection from '@/components/resume/CollapsibleSection';
import SkillGrid from '@/components/resume/SkillGrid';
import EducationList from '@/components/resume/EducationList';
import AwardsPanel from '@/components/resume/AwardsPanel';
import WritingLinks from '@/components/resume/WritingLinks';
import EraChapter from '@/components/resume/arc/EraChapter';
import { HERO } from '@/data/hero';
import { CAREER_SCOPE, TIMELINE } from '@/data/timeline';
import { YEARS_EXPERIENCE } from '@/data/canonical';
import { SKILLS, SKILL_CATEGORIES } from '@/data/skills';
import { AWARDS } from '@/data/awards';
import { EDUCATION, CREDENTIALS } from '@/data/education';

const META_TITLE = 'Resume';
const META_DESCRIPTION =
  'Career chronology, selected production work, skills, education, awards, and public writing.';
const META_PATH = '/resume';
const BANK_PRODUCTION_SYSTEMS = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
}).format([...CAREER_SCOPE.bankProductionSystems]);

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: META_PATH },
  openGraph: {
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    url: META_PATH,
    siteName: 'Harmilap Singh Dhaliwal',
    locale: 'en_US',
    type: 'profile',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${META_TITLE} | Harmilap Singh Dhaliwal`,
    description: META_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function ResumePage() {
  return (
    <div className="resume-page">
      <Nav />

      <main id="main-content" className="pt-20">
        <section className="px-6 pb-10 pt-6 md:px-16 md:pb-14 md:pt-10">
          <div className="mx-auto max-w-content">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Résumé
            </p>
            <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {HERO.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              <span className="block font-medium text-text-primary">{HERO.title}</span>
              <span className="mt-1 block">
                {`${YEARS_EXPERIENCE} years in applied AI and machine learning, including ~4 years building production AI in regulated finance; the past 18 months have focused on agentic and LLM systems. Three production AI systems at the bank: ${BANK_PRODUCTION_SYSTEMS}.`}
              </span>
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/resume.pdf"
                download="Harmilap-Singh-Dhaliwal-Resume.pdf"
                className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-4 py-2 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent hover:text-background print:hidden"
              >
                <Download size={16} aria-hidden="true" />
                Download résumé PDF (2 pages)
              </a>
              <a
                href={HERO.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-surface/50 px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-accent print:hidden"
              >
                <Linkedin size={16} aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-16">
          <div className="mx-auto max-w-content border-y border-border-subtle py-8 md:py-10">
            <ResumeMetrics />
          </div>
        </section>

        <section className="px-6 pt-10 md:px-16 md:pt-14">
          <div className="mx-auto max-w-content border-b border-border-subtle pb-4 md:pb-5">
            <h2 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Professional experience
            </h2>
          </div>
        </section>

        {TIMELINE.map((era, i) => (
          <EraChapter key={era.id} era={era} index={i} />
        ))}

        <section className="px-6 pb-24 pt-10 md:px-16 md:pt-12">
          <div className="mx-auto max-w-content space-y-3">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Supporting details
            </p>

            <CollapsibleSection
              title="Skills"
              summary={`${SKILLS.length} capabilities across ${SKILL_CATEGORIES.length} evidence categories`}
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

            <CollapsibleSection
              title="Writing"
              summary="Published technical notes, decision guides, and builder stories"
            >
              <WritingLinks />
            </CollapsibleSection>
          </div>
        </section>

        {/* JSON-LD: ProfilePage referencing the single Person entity
            (@id defined in app/layout.tsx) — avoids a second, conflicting
            Person node, and intentionally does NOT expose a machine-readable
            email (scraper-harvestable; the rest of the site doesn't either). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              url: 'https://rogerthatroach.github.io/resume',
              name: `Resume — ${HERO.name}`,
              mainEntity: {
                '@type': 'Person',
                '@id': 'https://rogerthatroach.github.io/#person',
                name: HERO.name,
              },
            }),
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
