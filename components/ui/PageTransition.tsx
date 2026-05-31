'use client';

import { motion } from 'framer-motion';
import { useHasNavigated } from '@/lib/useHasNavigated';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // On cold load, render at the final state (initial=false) so the LCP title
  // paints immediately instead of waiting for framer to fade it in. On in-app
  // navigation, play the fade (LCP-free, reads nicely).
  const hasNavigated = useHasNavigated();
  return (
    <motion.div
      initial={hasNavigated ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
    >
      {children}
    </motion.div>
  );
}
