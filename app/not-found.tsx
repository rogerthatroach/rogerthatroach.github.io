import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// Two-line mono acknowledgement + one re-entry link. No "oops!",
// no illustration, no 404 stencil. If someone lands here, they already
// know they're lost; the page's job is to get them out cleanly.
export default function NotFound() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="mx-auto flex min-h-[calc(100vh-160px)] max-w-content items-center px-6 py-28 md:px-16"
      >
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            § 404
          </p>

          <h1 className="mt-4 font-mono text-xl leading-relaxed text-text-primary sm:text-2xl">
            <span className="block">
              This page doesn&rsquo;t exist, or it moved.
            </span>
            <span className="block text-text-secondary">
              Nothing&rsquo;s broken &mdash; just the URL.
            </span>
          </h1>

          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-text-primary"
          >
            Start at the beginning
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
