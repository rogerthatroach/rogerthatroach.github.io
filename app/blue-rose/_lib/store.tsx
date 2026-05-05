'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ThemisSeed } from '@/data/themis/types';

/**
 * Themis runtime store — Tier 0 minimal version.
 *
 * Holds the decrypted seed + currentPersonaId. Future tiers expand this
 * into a full reducer with messages, drafts, simulation queue, etc.
 *
 * Persona choice persists in localStorage keyed under `themis:persona`.
 * The seed itself is *not* persisted — it must be decrypted each session.
 */

const PERSONA_KEY = 'themis:persona';

interface ThemisContextValue {
  seed: ThemisSeed;
  currentPersonaId: string;
  setCurrentPersonaId: (id: string) => void;
}

const ThemisContext = createContext<ThemisContextValue | null>(null);

interface ThemisProviderProps {
  seed: ThemisSeed;
  children: ReactNode;
}

export function ThemisProvider({ seed, children }: ThemisProviderProps) {
  const initialPersonaId = useMemo(() => {
    const submitter = seed.personas.find((p) => p.role === 'submitter');
    return (submitter ?? seed.personas[0]).id;
  }, [seed]);

  const [currentPersonaId, setCurrentPersonaIdRaw] = useState<string>(initialPersonaId);

  // Hydrate from localStorage after mount (avoids SSR mismatch on static export)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERSONA_KEY);
      if (stored && seed.personas.some((p) => p.id === stored)) {
        setCurrentPersonaIdRaw(stored);
      }
    } catch {
      /* localStorage blocked — stay on default */
    }
  }, [seed]);

  const setCurrentPersonaId = useCallback((id: string) => {
    setCurrentPersonaIdRaw(id);
    try {
      localStorage.setItem(PERSONA_KEY, id);
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo(
    () => ({ seed, currentPersonaId, setCurrentPersonaId }),
    [seed, currentPersonaId, setCurrentPersonaId],
  );

  return <ThemisContext.Provider value={value}>{children}</ThemisContext.Provider>;
}

export function useThemis(): ThemisContextValue {
  const ctx = useContext(ThemisContext);
  if (!ctx) throw new Error('useThemis must be used within ThemisProvider');
  return ctx;
}

export function useCurrentPersona() {
  const { seed, currentPersonaId } = useThemis();
  return seed.personas.find((p) => p.id === currentPersonaId) ?? seed.personas[0];
}
