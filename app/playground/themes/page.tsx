import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ThemePreview from '@/components/playground/themes/ThemePreview';
import { THEMES } from '@/data/themes';

export const metadata: Metadata = {
  title: 'Playground · Themes — five register variants',
  description:
    'VSCode-style theme packs applied to the portfolio color system. Compare wabi-sabi (current) against Nord, Solarized Dark, Monokai, and Paper to see how register shifts change the read.',
  robots: { index: false, follow: false },
};

export default function ThemesPlaygroundPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto min-h-screen max-w-content px-6 pb-16 pt-28 md:px-16"
      >
        <Link
          href="/playground"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-tertiary transition-colors hover:text-accent"
        >
          <ArrowLeft size={16} />
          Playground
        </Link>

        <div className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-amber-500">
            Playground · private
          </p>
          <p>
            Five theme presets rendered side-by-side. Each preview scopes its own
            CSS vars (10 site tokens + 4 era-palette pairs) via inline style, so
            Nav + Footer stay on the site default for comparison. These are{' '}
            <strong className="text-text-primary">not</strong> shippable
            themes yet — this surface is about testing which register actually
            suits the site before any commitment.
          </p>
        </div>

        <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Theme register study
        </h1>
        <p className="mb-10 max-w-2xl text-base text-text-secondary">
          The site ships one theme (Sakura · wabi-sabi). Four alternatives here —
          Nord, Solarized Dark, Monokai, Paper — come from different design
          traditions. Scroll and compare: which register reads like a
          senior-engineer portfolio? Which feels off?
        </p>

        {/* Theme grid — stacked on mobile, 2-column on lg for side-by-side compare */}
        <div className="grid gap-6 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} />
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border-subtle bg-surface/30 p-5 text-sm text-text-secondary">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            How to decide
          </p>
          <ul className="ml-5 list-disc space-y-1.5 text-sm">
            <li>
              <strong className="text-text-primary">Sakura</strong> — warm
              paper + sakura rose. Quiet, craft-forward. Currently shipping.
            </li>
            <li>
              <strong className="text-text-primary">Nord</strong> — arctic
              blues, popular in code editors. Calm but could read generic.
            </li>
            <li>
              <strong className="text-text-primary">Solarized Dark</strong> —
              CIELAB-calibrated, strong legibility, classic programmer aesthetic.
              Signals "I&rsquo;ve thought about color science."
            </li>
            <li>
              <strong className="text-text-primary">Monokai</strong> — high-
              saturation magenta + lime on warm black. Playful but shouts.
              Probably too loud for long-form reading; could work for a single
              accent region.
            </li>
            <li>
              <strong className="text-text-primary">Paper</strong> — editorial
              cream + black ink. Counter-programs the "all tech portfolios are
              dark mode" default. Strongest if the site wants to signal
              writer-first over engineer-first.
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
