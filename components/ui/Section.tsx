'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('px-6 py-24 md:px-16', className)}>
      <div className="mx-auto max-w-content">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
        >
          {title}
        </motion.h2>
        {children}
      </div>
    </section>
  );
}
