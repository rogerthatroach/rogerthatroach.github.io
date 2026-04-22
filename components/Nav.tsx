'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from '@/data/nav';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [menuOpen]);

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        // Always-on solid backdrop below md so the hero portrait doesn't
        // bleed through on mobile. Desktop keeps the transparent-until-
        // scroll pattern.
        'bg-background/80 border-b border-border-subtle backdrop-blur-lg',
        'md:border-transparent md:bg-transparent',
        scrolled &&
          'md:bg-background/80 md:border-border-subtle md:backdrop-blur-lg'
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-16">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-wider text-text-primary transition-colors hover:text-accent"
        >
          HSD
        </Link>

        {/* Desktop — inline links */}
        <div className="hidden items-center gap-3 md:flex md:gap-6">
          {NAV_LINKS.map((link) =>
            link.href.startsWith('/') && !link.href.startsWith('/#') ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-text-secondary transition-colors hover:text-text-primary md:text-sm"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-text-secondary transition-colors hover:text-text-primary md:text-sm"
              >
                {link.label}
              </a>
            )
          )}
          <ThemeToggle />
        </div>

        {/* Mobile — kebab (left) + theme toggle (right), dropdown holds links.
            Kebab shares the circular-chip design language of ThemeToggle; the
            dropdown panel mirrors RoleOverlay's frosted-glass treatment. */}
        <div ref={menuRef} className="relative flex items-center gap-2 md:hidden">
          <motion.button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            whileTap={{ scale: 0.9 }}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-menu"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-secondary backdrop-blur-sm transition-colors hover:bg-surface-hover hover:text-text-primary"
          >
            <motion.div
              key={menuOpen ? 'x' : 'menu'}
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {menuOpen ? <X size={18} /> : <MoreVertical size={18} />}
            </motion.div>
          </motion.button>
          <ThemeToggle />
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="nav-mobile-menu"
                role="menu"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[12rem] overflow-hidden rounded-xl border border-border-subtle bg-gradient-to-b from-surface-hover to-surface shadow-2xl"
              >
                <ul className="py-1">
                  {/* Search trigger — mobile equivalent of ⌘K. Fires the
                      same cmdk:open custom event that the footer hint
                      button uses. */}
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        document.dispatchEvent(new Event('cmdk:open'));
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-accent"
                    >
                      <Search size={14} aria-hidden="true" />
                      Search
                    </button>
                  </li>
                  <li role="none" aria-hidden="true">
                    <div className="mx-4 my-1 border-t border-border-subtle" />
                  </li>
                  {NAV_LINKS.map((link) => {
                    const isInternal =
                      link.href.startsWith('/') && !link.href.startsWith('/#');
                    const commonClass =
                      'block px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-accent';
                    return (
                      <li key={link.href} role="none">
                        {isInternal ? (
                          <Link
                            href={link.href}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className={commonClass}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            role="menuitem"
                            onClick={() => setMenuOpen(false)}
                            className={commonClass}
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
