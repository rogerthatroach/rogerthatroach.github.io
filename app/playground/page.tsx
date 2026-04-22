import type { Metadata } from 'next';
import { Inter_Tight, Fraunces, Instrument_Serif } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import PaletteSection from '@/components/playground/PaletteSection';
import FontCard from '@/components/playground/FontCard';
import HeroVariant from '@/components/playground/HeroVariant';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Playground — design testing',
  description: 'Private design surface. Not linked from the site.',
  robots: { index: false, follow: false },
};

// ─── Palette definitions (dark mode values) ───────────────────────────────
// Each entry sets the CSS variables that components read via Tailwind's
// bg-{surface|background|accent} utilities. Scoped per column via style.
const PALETTES = [
  {
    name: 'Current — Sakura / Wabi-Sabi',
    description:
      'Ships today. Warm-dark foreground, muted rose accent. Distinctive without being loud. Reviewed Apr 2026 vs oxblood/algae alternatives — sakura kept as the chosen palette.',
    base: 'dark' as const,
    vars: {
      '--color-bg': '#0c0a0a',
      '--color-surface': '#151212',
      '--color-surface-hover': '#1c1818',
      '--color-border': '#2a2424',
      '--color-accent': '#d4a0a7',
      '--color-accent-muted': '#3d2a2e',
      '--color-text-primary': '#f0ebe8',
      '--color-text-secondary': '#a89e9b',
      '--color-text-tertiary': '#8a8181',
    },
  },
];

interface FontSpec {
  name: string;
  note: string;
  sansClass: string;
  monoClass: string;
  displayClass?: string;
}

const FONTS: FontSpec[] = [
  {
    name: 'Current — Inter + JetBrains Mono',
    note: 'Shipping today. Familiar, crisp, widely tested. Body prose in Inter, tech chips and eyebrows in JetBrains.',
    sansClass: 'font-body',
    monoClass: 'font-mono',
  },
  {
    name: 'Audit A — Geist Sans + Geist Mono',
    note: 'Vercel pair. Slightly tighter spacing than Inter; mono is distinctive without being noisy. Safe modern swap.',
    sansClass: GeistSans.className,
    monoClass: GeistMono.className,
  },
  {
    name: 'Audit B — Inter Tight + JetBrains Mono',
    note: 'Inter Tight is a tighter optical variant of Inter. Cheapest change — same mono, denser body.',
    sansClass: interTight.className,
    monoClass: 'font-mono',
  },
  {
    name: 'Editorial — Inter + Fraunces (serif display)',
    note: 'Keeps Inter body; Fraunces warm serif only on the headline. Pairs well with wabi-sabi palette — Japanese craft/editorial sites use this register.',
    sansClass: 'font-body',
    monoClass: 'font-mono',
    displayClass: fraunces.className,
  },
  {
    name: 'Literary — Inter + Instrument Serif',
    note: 'Thin-strokes display serif on the headline; body stays Inter. Signals "long-form writing" — good fit for blog H1s if you want that register shift.',
    sansClass: 'font-body',
    monoClass: 'font-mono',
    displayClass: instrumentSerif.className,
  },
];

const HERO_VARIANTS = [
  {
    key: 'current',
    label: 'Current — name-dominant + portrait',
    caption:
      'Name as H1 (large), tagline below, portrait right-column. Ships today.',
  },
  {
    key: 'audit',
    label: 'Audit — type-only thesis hero',
    caption:
      'Name becomes a 12px mono eyebrow. 48–72px positioning H1 with one concrete number. Two CTAs. No portrait.',
  },
  {
    key: 'hybrid',
    label: 'Hybrid — thesis H1 + small portrait tile',
    caption:
      'Audit hero structure, but keeps a 96×96 portrait as a signature tile in the top-right, not as the dominant visual.',
  },
] as const;

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto max-w-content px-6 pb-24 pt-28 md:px-16"
      >
        {/* Banner — make the purpose of the page obvious */}
        <div className="mb-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-500">
            Playground · private
          </p>
          <p>
            Design surface for comparing palettes, fonts, and hero treatments
            before committing any change to the live site. Not linked from
            nav; not in sitemap; not indexed.
          </p>
        </div>

        <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Design playground
        </h1>
        <p className="mb-10 max-w-2xl text-base text-text-secondary">
          Three comparisons below. Each renders the same content with a
          different treatment so differences aren&rsquo;t about content — only
          about typography, colour, and composition.
        </p>

        {/* Experimental sub-pages — preview routes not promoted to production */}
        <div className="mb-16 rounded-xl border border-border-subtle bg-surface/30 p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">
            Preview routes
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/playground/hero-audit"
                className="group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
              >
                <span className="font-medium">Hero — audit P0-4 spec</span>
                <span className="text-text-tertiary group-hover:text-accent">
                  — pitch-first thesis hero with CTAs, no portrait
                </span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="/playground/home-projects-v2"
                className="group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
              >
                <span className="font-medium">Projects v2 — filmography + palette</span>
                <span className="text-text-tertiary group-hover:text-accent">
                  — Year / Era / Role columns with palette era pills retained
                </span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="/playground/diagrams"
                className="group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
              >
                <span className="font-medium">Diagrams — PAR Assist × 4 levels, click-to-drill</span>
                <span className="text-text-tertiary group-hover:text-accent">
                  — Overview / System / Orchestration / Tool contract
                </span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="/playground/themes"
                className="group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
              >
                <span className="font-medium">Themes — 5 VSCode-style register presets</span>
                <span className="text-text-tertiary group-hover:text-accent">
                  — Sakura vs Nord vs Solarized Dark vs Monokai vs Paper
                </span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
            <li>
              <Link
                href="/playground/projects-filmography"
                className="group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-accent"
              >
                <span className="font-medium">/projects as filmography table (pure)</span>
                <span className="text-text-tertiary group-hover:text-accent">
                  — audit P1-5 alternative without palette colors
                </span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Section 1: Palette comparison ─────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-6">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              1 · Colour palettes
            </p>
            <h2 className="text-2xl font-bold text-text-primary">
              Same components, three palettes
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Each column scopes its own CSS variables, so all three render
              simultaneously. Look at button+card+progress-dot interactions,
              not just accent hex.
            </p>
          </div>

          <PaletteSection palettes={PALETTES} />
        </section>

        {/* ── Section 2: Font pairings ──────────────────────────────────── */}
        <section className="mb-20">
          <div className="mb-6">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              2 · Font pairings
            </p>
            <h2 className="text-2xl font-bold text-text-primary">
              Same prose, three pairings
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Body + heading + mono chip rendered identically. Berkeley Mono
              (audit recommendation) is a paid license, so Inter Tight +
              JetBrains is the pragmatic swap if the choice is &ldquo;tighter
              body, same mono.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {FONTS.map((f) => (
              <FontCard
                key={f.name}
                name={f.name}
                note={f.note}
                sansClass={f.sansClass}
                monoClass={f.monoClass}
                displayClass={f.displayClass}
              />
            ))}
          </div>
        </section>

        {/* ── Section 3: Hero variants ──────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
              3 · Hero composition
            </p>
            <h2 className="text-2xl font-bold text-text-primary">
              Name-dominant vs thesis-dominant
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              The audit&rsquo;s central layout change. Same information, three
              hierarchies. Watch what your eye lands on first in each.
            </p>
          </div>

          <div className="space-y-6">
            {HERO_VARIANTS.map((v) => (
              <HeroVariant key={v.key} variant={v.key} label={v.label} caption={v.caption} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
