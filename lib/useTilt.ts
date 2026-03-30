'use client';

import { useRef, useCallback } from 'react';

const MAX_TILT = 8; // degrees

export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tiltX = (y - 0.5) * -MAX_TILT;
    const tiltY = (x - 0.5) * MAX_TILT;

    el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}
