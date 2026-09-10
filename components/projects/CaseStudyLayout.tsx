import Link from 'next/link';
import { ArrowRight, Calendar, Briefcase } from 'lucide-react';
import type { Project } from '@/data/projects';
import type { CaseStudy } from '@/data/projectCaseStudies';
import PageTransition from '@/components/ui/PageTransition';
import ScrollProgressRail from '@/components/ui/ScrollProgressRail';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { paletteStyle } from '@/lib/palette';
import CaseStudyToc, { type TocSection } from './CaseStudyToc';
import PreviousPathLink from '@/components/navigation/PreviousPathLink';
import { DETAIL_RETURN_FALLBACKS } from '@/data/nav';

interface CaseStudyLayoutProps {
  project: Project;
  caseStudy: CaseStudy;
  diagram: React.ReactNode;
  showTechnicalBlogCta: boolean;
  showCompanionBlogCta: boolean;
}

function Section({
  id,
  title,
  aliases = [],
  children,
}: {
  id: string;
  title: string;
  aliases?: string[];
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mt-16 scroll-mt-24"
    >
      {aliases.map((alias) => (
        <span key={alias} id={alias} className="block scroll-mt-24" aria-hidden="true" />
      ))}
      <h2 className="font-display text-xl font-bold tracking-tight text-text-primary">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

function CaseStudyTOCMobile({ sections }: { sections: TocSection[] }) {
  return (
    <details className="mt-8 rounded-lg border border-border-subtle bg-surface/50 xl:hidden">
      <summary className="min-h-11 cursor-pointer px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-text-tertiary">
        On this page
      </summary>
      <ul className="border-t border-border-subtle px-2 py-2">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="flex min-h-11 items-center rounded-sm px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-accent"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default function CaseStudyLayout({
  project,
  caseStudy,
  diagram,
  showTechnicalBlogCta,
  showCompanionBlogCta,
}: CaseStudyLayoutProps) {
  const { narrative } = caseStudy;
  const tocSections = [
    narrative.problem ? { id: 'problem', label: 'Problem' } : undefined,
    narrative.contribution ? { id: 'contribution', label: 'Contribution' } : undefined,
    narrative.decision ? { id: 'decision', label: 'Decision' } : undefined,
    { id: 'how-it-works', label: caseStudy.figureHeading ?? 'How it works' },
    narrative.outcomeAndState ? { id: 'outcome', label: 'Outcome and state' } : undefined,
    narrative.limits ? { id: 'limits', label: 'Limits' } : undefined,
  ].filter((section): section is TocSection => Boolean(section));

  return (
    <PageTransition>
      <ScrollProgressRail />
      <Nav />
      <main id="main-content" className="px-6 pt-24 pb-12 md:px-16">
        <div className="mx-auto max-w-content xl:flex xl:max-w-312 xl:gap-12">
          <CaseStudyToc sections={tocSections} />
          <div className="min-w-0 xl:max-w-content xl:flex-1">
            <div>
              <PreviousPathLink
                fallbackHref={DETAIL_RETURN_FALLBACKS.projects.href}
                fallbackLabel={DETAIL_RETURN_FALLBACKS.projects.label}
              />
            </div>

            <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="palette-pill rounded-full border px-3 py-1 font-mono text-xs font-medium"
                style={paletteStyle(project.palette)}
              >
                {caseStudy.era}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <Calendar size={12} aria-hidden="true" />
                {caseStudy.timeline}
              </span>
              {caseStudy.status === 'in-progress' && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  {caseStudy.statusLabel ?? 'In Productionization'}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-2 font-mono text-sm tracking-widest text-accent">
              {project.subtitle}
            </p>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              {project.caption}
            </p>
          </div>

          <CaseStudyTOCMobile sections={tocSections} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border-subtle bg-surface p-4">
              <span className="font-mono text-xl font-bold text-accent">
                {project.heroMetric.value}
              </span>
              <p className="mt-1 text-xs text-text-tertiary">{project.heroMetric.label}</p>
            </div>
            <div className="rounded-lg border border-border-subtle bg-surface p-4">
              <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-accent">
                <Briefcase size={14} aria-hidden="true" />
                Role
              </span>
              <p className="mt-1 text-xs text-text-tertiary">{project.role}</p>
            </div>
          </div>

          {narrative.problem && (
            <Section id="problem" title="Problem and context" aliases={['context', 'challenge']}>
              <p>{narrative.problem}</p>
            </Section>
          )}

          {narrative.contribution && (
            <Section id="contribution" title="Contribution and collaborators" aliases={['my-role', 'stakeholders']}>
              <p>{narrative.contribution}</p>
            </Section>
          )}

          {narrative.decision && (
            <Section id="decision" title="Decision and trade-off" aliases={['options']}>
              <p>{narrative.decision.selectedApproach}</p>
              {narrative.decision.strongestAlternative && (
                <p>
                  <span className="font-medium text-text-primary">Strongest alternative: </span>
                  {narrative.decision.strongestAlternative}
                </p>
              )}
              {narrative.decision.crux && (
                <p>
                  <span className="font-medium text-text-primary">Why this boundary: </span>
                  {narrative.decision.crux}
                </p>
              )}
              {narrative.decision.residualRisk && (
                <p>
                  <span className="font-medium text-text-primary">Residual risk: </span>
                  {narrative.decision.residualRisk}
                </p>
              )}
            </Section>
          )}

          <Section id="how-it-works" title={caseStudy.figureHeading ?? 'How it works'} aliases={['architecture', 'implementation']}>
            {narrative.mechanism && <p>{narrative.mechanism}</p>}
            {diagram}
          </Section>

          {narrative.outcomeAndState && (
            <Section id="outcome" title="Outcome and operating state" aliases={['impact', 'in-production']}>
              <p>{narrative.outcomeAndState}</p>
            </Section>
          )}

          {narrative.limits && (
            <Section id="limits" title="What remains bounded" aliases={['lessons']}>
              <p>{narrative.limits}</p>
            </Section>
          )}

          <section className="mt-16">
            <h2 className="text-xl font-bold text-text-primary">Selected tools</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {(showTechnicalBlogCta || showCompanionBlogCta) && (
            <div className="mt-16 mb-12 grid gap-4 sm:grid-cols-2">
              {showTechnicalBlogCta && caseStudy.blogPostSlug && (
                <div className="rounded-lg border border-accent/20 bg-accent-muted p-6">
                  <p className="text-sm font-medium text-text-primary">Mechanism and failure paths</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    How the system works, what evidence supports it, and where its controls can fail.
                  </p>
                  <Link
                    href={`/blog/${caseStudy.blogPostSlug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-text-primary"
                  >
                    Read the technical note
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              )}
              {showCompanionBlogCta && caseStudy.companionBlogPostSlug && (
                <div className="rounded-lg border border-border-subtle bg-surface/50 p-6">
                  <p className="text-sm font-medium text-text-primary">Build story</p>
                  <p className="mt-2 text-sm text-text-secondary">
                    How the work took shape through its sequence, contributors, turning points, and route to production.
                  </p>
                  <Link
                    href={`/blog/${caseStudy.companionBlogPostSlug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-text-primary"
                  >
                    Read the builder story
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
