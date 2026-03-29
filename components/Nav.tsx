'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 border-b border-border-subtle backdrop-blur-lg'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-16">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-wider text-text-primary transition-colors hover:text-accent"
        >
          HSD
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-sm text-text-secondary transition-colors hover:text-text-primary sm:block"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
