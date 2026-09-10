import type { TimelineNode } from '@/data/timeline';
import ProjectReveal from './ProjectReveal';
import { paletteStyle } from '@/lib/palette';

const ERA_PALETTES: Record<string, { primary: string; primaryLight: string }> = {
  Foundation: { primary: '#fca5a5', primaryLight: '#991b1b' },
  'Cloud ML': { primary: '#67e8f9', primaryLight: '#155e75' },
  'Enterprise Analytics': { primary: '#fcd34d', primaryLight: '#92400e' },
  'Intelligent Systems': { primary: '#93c5fd', primaryLight: '#1e40af' },
};

/** A static, server-rendered resume chapter designed for recruiter scanning. */
export default function EraChapter({
  era,
  index,
}: {
  era: TimelineNode;
  index: number;
}) {
  const palette = ERA_PALETTES[era.era];
  const style = palette ? paletteStyle(palette) : undefined;
  const [roleTitle = era.role, ...roleContextParts] = era.role.split(' · ');
  const roleContext = roleContextParts.join(' · ');
  const contextLine = [
    era.org,
    roleContext || null,
    era.period,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <section
      id={`era-${era.id}`}
      data-era={era.id}
      aria-label={`${roleTitle} at ${era.org}, ${era.period}`}
      style={style}
      className={`${
        index === 0
          ? 'px-6 pb-14 pt-8 md:px-16 md:pb-20 md:pt-10'
          : 'border-t border-border-subtle px-6 py-14 md:px-16 md:py-20'
      }`}
    >
      <div className="mx-auto max-w-content">
        <p className="palette-text font-mono text-xs uppercase tracking-widest">
          {era.era}
        </p>

        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {roleTitle}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          {era.logoPath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={era.logoPath}
              alt=""
              aria-hidden="true"
              className={
                era.logoClass ??
                'h-6 w-auto max-w-[108px] shrink-0 object-contain'
              }
              loading="lazy"
            />
          )}
          <p className="text-sm font-medium text-text-secondary sm:text-base">
            {contextLine}
          </p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
          {era.description}
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-5">
            {era.headlineMetric && (
              <div className="palette-border rounded-lg border-2 bg-surface/60 p-4">
                <div className="font-mono text-2xl font-bold text-text-primary sm:text-3xl">
                  {era.headlineMetric.value}
                </div>
                <div className="mt-1 text-xs text-text-tertiary">
                  {era.headlineMetric.label}
                </div>
              </div>
            )}

            {era.transitionStory && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Career context
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {era.transitionStory}
                </p>
              </div>
            )}

            {era.teamContext && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Team and collaboration
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {era.teamContext}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {era.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {era.projects && era.projects.length > 0 ? (
              era.projects.map((project) => (
                <ProjectReveal key={`${era.id}-${project.name}`} project={project} />
              ))
            ) : (
              <p className="text-sm italic text-text-tertiary">{era.description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
