'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useThemis } from '../_lib/store';
import { cn } from '@/lib/utils';

const ROUTE_LABEL: Record<string, string> = {
  home: 'Home',
  inbox: 'Inbox',
  drafts: 'Drafts',
  compose: 'Compose',
  audit: 'Audit',
  workflows: 'Workflows',
  diane: 'Diane',
};

interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb — derived from `usePathname()` plus the active submission
 * title (when on /submission). Lives in the BookhouseLayout header.
 *
 * Hidden on the home route (no useful breadcrumb there). Hidden on
 * narrow screens to keep the header tight; users can always click the
 * Bookhouse wordmark to jump back to home.
 */
export default function Breadcrumb() {
  const pathname = usePathname();
  const { seed, selectedSubmissionId } = useThemis();

  const crumbs = useMemo<Crumb[]>(() => {
    const trimmed = pathname.replace(/^\/blue-rose\/?/, '');
    const parts = trimmed.split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'home') return [];

    const items: Crumb[] = [{ label: 'Home', href: '/blue-rose/home' }];

    if (parts[0] === 'submission' && selectedSubmissionId) {
      const sub = seed.submissions.find((s) => s.id === selectedSubmissionId);
      items.push({ label: 'Inbox', href: '/blue-rose/inbox' });
      items.push({ label: sub?.title ?? 'Submission' });
      return items;
    }

    const segLabel = ROUTE_LABEL[parts[0]] ?? parts[0];
    items.push({ label: segLabel });
    return items;
  }, [pathname, seed.submissions, selectedSubmissionId]);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 md:flex">
      {crumbs.map((c, i) => (
        <span key={i} className="flex min-w-0 items-center gap-1">
          {i > 0 && (
            <ChevronRight
              size={11}
              className="shrink-0 text-text-tertiary"
              aria-hidden="true"
            />
          )}
          {c.href ? (
            <Link
              href={c.href}
              className="text-[12px] text-text-secondary transition-colors hover:text-text-primary"
            >
              {c.label}
            </Link>
          ) : (
            <span
              className={cn(
                'truncate text-[12px] font-medium text-text-primary',
                'max-w-[280px]',
              )}
              aria-current="page"
            >
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
