import type { Metadata } from 'next';
import { Linkedin, ChevronDown } from 'lucide-react';
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

const META_TITLE = 'Resume';
const META_DESCRIPTION =
  'Scrollytelling career arc with collapsible skills, education, awards, and writing links.';
const META_PATH = '/resume';

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
              financial-services AI. The scroll arc below compares four domains through
              a bounded observe → estimate → choose → act heuristic. Details live in the
              collapsed sections beneath — open what matters.
            </p>

            {/* External profile */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
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
              Different systems.
              <br />
              Four recurring questions.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
              Across these roles I reuse a bounded design heuristic:{' '}
              <strong className="text-text-primary">
                observe → estimate → choose → act.
              </strong>{' '}
              Starting from today&rsquo;s enterprise AI and tracing back through
              financial services, cloud ML, and industrial machine learning. The
              questions transfer; the guarantees do not. Scroll to trace the arc.
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
              The heuristic, stated
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold leading-snug text-text-primary sm:text-3xl md:text-4xl">
              Observe the system. Estimate what matters. Choose within constraints.
              Act, then reassess.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
              Across four substrates — physical plant, cloud document pipelines,
              enterprise finance, agentic AI — these questions recur, while the
              implementation and guarantees remain domain-specific.
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
      </div>
      <Footer />
    </main>
  );
}
