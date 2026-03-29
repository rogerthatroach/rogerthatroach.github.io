'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { METRICS } from '@/data/metrics';

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);

    const end = value;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, hasAnimated, value, duration]);

  return (
    <span ref={ref} className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
      {value === 3 && '$'}
      {hasAnimated ? count : 0}
      {suffix}
    </span>
  );
}

export default function MetricsRibbon() {
  return (
    <div className="border-y border-border-subtle bg-surface/30 py-12 sm:py-16">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-8 px-6 sm:grid-cols-3 md:px-16 lg:grid-cols-6">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col"
          >
            {metric.numericValue !== undefined ? (
              <AnimatedCounter value={metric.numericValue} suffix={metric.suffix} />
            ) : (
              <span className="font-mono text-2xl font-bold text-text-primary sm:text-3xl md:text-4xl">
                {metric.value}
              </span>
            )}
            <span className="mt-2 text-xs font-medium text-text-primary">{metric.label}</span>
            <span className="mt-0.5 text-[10px] text-text-tertiary">{metric.context}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
