'use client';

import { motion } from 'framer-motion';
import Section from '@/components/ui/Section';
import { ABOUT } from '@/data/about';

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-2xl space-y-4">
        {ABOUT.paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.5,
              delay: i * 0.15,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="text-base leading-relaxed text-text-secondary"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </Section>
  );
}
