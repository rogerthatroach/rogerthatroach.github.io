'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RETURN_DESTINATION_LABELS } from '@/data/nav';
import { useInternalNavigation } from './InternalNavigationProvider';

interface PreviousPathLinkProps {
  fallbackHref: string;
  fallbackLabel: string;
  compact?: boolean;
  className?: string;
}

function describePath(path: string): string {
  if (path === '/') return RETURN_DESTINATION_LABELS.home;
  if (path === '/resume') return RETURN_DESTINATION_LABELS.resume;
  if (path === '/blog') return RETURN_DESTINATION_LABELS.writings;
  if (path.startsWith('/blog/')) return RETURN_DESTINATION_LABELS.previousArticle;
  if (path === '/projects') return RETURN_DESTINATION_LABELS.projects;
  if (path.startsWith('/projects/')) return RETURN_DESTINATION_LABELS.project;
  if (path === '/about') return RETURN_DESTINATION_LABELS.about;
  if (path === '/now') return RETURN_DESTINATION_LABELS.now;
  if (path === '/platform') return RETURN_DESTINATION_LABELS.platform;
  if (path === '/colophon') return RETURN_DESTINATION_LABELS.colophon;
  return RETURN_DESTINATION_LABELS.previousPage;
}

export default function PreviousPathLink({
  fallbackHref,
  fallbackLabel,
  compact = false,
  className,
}: PreviousPathLinkProps) {
  const { previousPath } = useInternalNavigation();
  const label = previousPath
    ? `Back to ${describePath(previousPath)}`
    : fallbackLabel;

  return (
    <Link
      href={previousPath ?? fallbackHref}
      aria-label={compact ? label : undefined}
      title={compact ? label : undefined}
      className={cn(
        compact
          ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle text-text-secondary transition-colors hover:border-accent/40 hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          : 'inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-text-tertiary transition-colors hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {!compact && <span>{label}</span>}
    </Link>
  );
}
