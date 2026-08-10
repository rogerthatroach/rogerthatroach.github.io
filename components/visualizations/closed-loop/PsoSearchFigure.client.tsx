'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import FigureHeader from '@/components/visualizations/FigureHeader';
import type { PsoSimulationContent } from '@/data/visualizations/closedLoop';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bestX: number;
  bestY: number;
  bestScore: number;
}

interface SearchState {
  iteration: number;
  particles: Particle[];
}

const PARTICLE_COUNT = 16;
const SEARCH_SEED = 20260809;

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function scorePosition(x: number, y: number): number {
  const broadRegion = ((x - 30) ** 2 + (y - 36) ** 2) / 520 + 3;
  const narrowRegion = ((x - 72) ** 2 + (y - 68) ** 2) / 360;
  const texture = Math.abs(Math.sin(x * 0.13) * Math.cos(y * 0.11)) * 0.45;
  return Math.min(broadRegion, narrowRegion) + texture;
}

function findBestParticle(particles: readonly Particle[]): Particle {
  return particles.reduce((best, candidate) =>
    candidate.bestScore < best.bestScore ? candidate : best,
  );
}

function createInitialState(): SearchState {
  const random = createSeededRandom(SEARCH_SEED);
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const x = 8 + random() * 84;
    const y = 8 + random() * 84;
    return {
      id,
      x,
      y,
      vx: (random() - 0.5) * 8,
      vy: (random() - 0.5) * 8,
      bestX: x,
      bestY: y,
      bestScore: scorePosition(x, y),
    };
  });

  return { iteration: 0, particles };
}

function advanceSearch(current: SearchState): SearchState {
  const retainedBest = findBestParticle(current.particles);
  const random = createSeededRandom(SEARCH_SEED + (current.iteration + 1) * 7919);

  const particles = current.particles.map((particle) => {
    const personalPull = 0.8 + random() * 0.5;
    const sharedPull = 0.9 + random() * 0.6;
    const explorationX = (random() - 0.5) * 2.4;
    const explorationY = (random() - 0.5) * 2.4;
    const vx = Math.max(
      -10,
      Math.min(
        10,
        0.58 * particle.vx +
          personalPull * (particle.bestX - particle.x) +
          sharedPull * (retainedBest.bestX - particle.x) +
          explorationX,
      ),
    );
    const vy = Math.max(
      -10,
      Math.min(
        10,
        0.58 * particle.vy +
          personalPull * (particle.bestY - particle.y) +
          sharedPull * (retainedBest.bestY - particle.y) +
          explorationY,
      ),
    );
    const x = Math.max(3, Math.min(97, particle.x + vx));
    const y = Math.max(3, Math.min(97, particle.y + vy));
    const score = scorePosition(x, y);
    const isBetter = score < particle.bestScore;

    return {
      ...particle,
      x,
      y,
      vx,
      vy,
      bestX: isBetter ? x : particle.bestX,
      bestY: isBetter ? y : particle.bestY,
      bestScore: isBetter ? score : particle.bestScore,
    };
  });

  return {
    iteration: current.iteration + 1,
    particles,
  };
}

function completeSearch(current: SearchState, maxIterations: number): SearchState {
  let next = current;
  while (next.iteration < maxIterations) next = advanceSearch(next);
  return next;
}

export default function PsoSearchFigure({ content }: { content: PsoSimulationContent }) {
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState<SearchState>(createInitialState);
  const [playing, setPlaying] = useState(false);
  const [inViewport, setInViewport] = useState(true);
  const headingId = `${content.id}-title`;
  const isComplete = search.iteration >= content.maxIterations;
  const retainedBest = useMemo(
    () => findBestParticle(search.particles),
    [search.particles],
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setSearch(createInitialState());
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
        if (!entry.isIntersecting) setPlaying(false);
      },
      { threshold: 0, rootMargin: '80px' },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!playing || !inViewport) return;
    if (search.iteration >= content.maxIterations) {
      setPlaying(false);
      return;
    }
    if (shouldReduceMotion) {
      setSearch((current) => completeSearch(current, content.maxIterations));
      setPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => setSearch((current) => advanceSearch(current)), 180);
    return () => window.clearTimeout(timer);
  }, [content.maxIterations, inViewport, playing, search.iteration, shouldReduceMotion]);

  const status = isComplete
    ? content.completeStatus
    : playing
      ? content.runningStatus
      : search.iteration === 0
        ? content.initialStatus
        : content.pausedStatus;

  return (
    <section ref={rootRef} aria-labelledby={headingId}>
      <FigureHeader
        headingId={headingId}
        title={content.title}
        thesis={content.thesis}
        headingLevel={content.headingLevel}
      />

      <div className="mt-6 border-y border-border-subtle py-4">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.fixtureLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{content.fixtureNote}</p>
      </div>

      <p className="mt-7 font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
        {content.processLabel}
      </p>
      <ol className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.processSteps.map((step) => (
          <li key={step.id} className="border-t-2 border-text-primary pt-3">
            <span className="font-mono text-sm font-bold text-text-primary">{step.number}</span>
            <p className="mt-2 text-sm font-semibold text-text-primary">{step.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{step.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
              {content.searchSpaceLabel}
            </p>
            <p className="font-mono text-xs text-text-tertiary">
              {content.iterationLabel} {search.iteration} / {content.maxIterations}
            </p>
          </div>

          <div
            role="img"
            aria-label={`${content.searchSpaceLabel}. ${content.searchSpaceDescription}`}
            className="relative mt-3 aspect-[4/3] overflow-hidden border-y border-border-subtle bg-surface/30"
          >
            <span aria-hidden="true" className="absolute left-[13%] top-[16%] h-[36%] w-[32%] rounded-full border border-border-subtle" />
            <span aria-hidden="true" className="absolute left-[20%] top-[23%] h-[22%] w-[20%] rounded-full border border-dotted border-text-tertiary" />
            <span aria-hidden="true" className="absolute left-[55%] top-[47%] h-[40%] w-[34%] rounded-full border border-border-subtle" />
            <span aria-hidden="true" className="absolute left-[63%] top-[55%] h-[23%] w-[19%] rounded-full border border-dotted border-text-tertiary" />

            {search.particles.map((particle) => (
              <span
                key={particle.id}
                aria-hidden="true"
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-secondary transition-[left,top] duration-150 motion-reduce:transition-none"
                style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              />
            ))}
            <span
              aria-hidden="true"
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background transition-[left,top] duration-150 motion-reduce:transition-none"
              style={{ left: `${retainedBest.bestX}%`, top: `${retainedBest.bestY}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-secondary" aria-label={content.legendLabel}>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-text-secondary" />
              {content.particleLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full border-2 border-accent bg-background" />
              {content.retainedLabel}
            </span>
          </div>
        </div>

        <div className="border-y-2 border-text-primary py-5">
          <output aria-live="polite" className="block text-sm font-semibold leading-relaxed text-text-primary">
            {status}
          </output>

          <div className="pso-controls mt-5 grid gap-2">
            <button
              type="button"
              disabled={playing || isComplete}
              onClick={() => setSearch((current) => advanceSearch(current))}
              className="min-h-11 border border-border-subtle px-4 py-2 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {content.controlLabels.step}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isComplete) setSearch(createInitialState());
                setPlaying((current) => !current);
              }}
              className="min-h-11 bg-text-primary px-4 py-2 text-left text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              {playing
                ? content.controlLabels.pause
                : isComplete
                  ? content.controlLabels.runAgain
                  : content.controlLabels.run}
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-11 border border-border-subtle px-4 py-2 text-left text-sm font-semibold text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
            >
              {content.controlLabels.reset}
            </button>
          </div>
          <noscript>
            <style>{'.pso-controls{display:none!important}'}</style>
          </noscript>
        </div>
      </div>

      <div className="mt-7 grid gap-2 border-l-4 border-text-primary pl-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-6">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-text-primary">
          {content.operatorBoundaryLabel}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-text-primary">{content.operatorBoundaryDetail}</p>
      </div>

      {content.caveat && <p className="mt-5 text-xs leading-relaxed text-text-tertiary">{content.caveat}</p>}
    </section>
  );
}
