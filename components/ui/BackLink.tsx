'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-accent"
    >
      <ArrowLeft size={16} />
      Back to overview
    </Link>
  );
}
