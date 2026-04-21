'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, LayoutList, ScrollText } from 'lucide-react';
import MobileFallback from './MobileFallback';

/**
 * Wraps the 3D career canvas. Checks for narrow viewport OR reduced-motion
 * preference at mount; routes to MobileFallback if either is set. Otherwise
 * dynamically imports the R3F canvas (ssr: false — Three.js doesn't SSR).
 */

const CareerCanvas = dynamic(() => import('./CareerCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="font-mono text-xs text-text-tertiary">
        Loading 3D scene…
      </div>
    </div>
  ),
});

export default function ExploreExperience() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const narrow = window.innerWidth < 900;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setSupported(!narrow && !reduced);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (supported === null) {
    // Render nothing while detecting; avoids flash of fallback
    return (
      <div
        aria-hidden="true"
        style={{ height: 'calc(100vh - 4rem)' }}
        className="w-full"
      />
    );
  }

  if (!supported) {
    return <MobileFallback />;
  }

  return (
    <div className="pt-16">
      {/* Scene container — fills viewport below nav */}
      <div
        className="relative w-full"
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        <CareerCanvas />

        {/* HUD — fixed overlay with variant cross-links and controls hint */}
        <div className="pointer-events-none absolute left-0 right-0 top-4 px-6 md:px-10">
          <div className="mx-auto flex max-w-content items-start justify-between gap-4">
            <div className="pointer-events-auto">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Career · Explore
              </p>
              <h1 className="mt-1 text-xl font-bold text-text-primary sm:text-2xl">
                Four eras, one pattern
              </h1>
              <p className="mt-1 font-mono text-[10px] text-text-tertiary">
                Drag to orbit · click a node to open · ESC to close
              </p>
            </div>

            <div className="pointer-events-auto flex flex-col items-end gap-1.5">
              <Link
                href="/resume"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/70 px-3 py-1 text-xs backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent"
              >
                <LayoutList size={12} />
                Structured
                <ArrowRight size={10} />
              </Link>
              <Link
                href="/resume/arc"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/70 px-3 py-1 text-xs backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent"
              >
                <ScrollText size={12} />
                Arc
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
