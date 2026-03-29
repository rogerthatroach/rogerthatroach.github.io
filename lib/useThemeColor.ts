'use client';

import { useState, useEffect } from 'react';

/**
 * Returns a CSS variable's computed value, updating when theme changes.
 * Useful for passing theme-aware colors to components that need string values
 * (e.g., ReactFlow Background, Three.js materials).
 */
export function useThemeColor(varName: string, fallback: string): string {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const update = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      setColor(value || fallback);
    };

    update();

    // Watch for class changes on <html> (theme toggle)
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [varName, fallback]);

  return color;
}
