'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

const HISTORY_STATE_KEY = '__portfolioInternalNavigation';
const MAX_STACK_DEPTH = 24;

interface InternalHistoryMarker {
  path: string;
  stack: string[];
}

interface InternalNavigationContextValue {
  previousPath: string | null;
}

const InternalNavigationContext =
  createContext<InternalNavigationContextValue | null>(null);

function isInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');
}

function isMainPortfolioPath(path: string): boolean {
  return !path.startsWith('/blue-rose');
}

function readMarker(state: unknown): InternalHistoryMarker | null {
  if (!state || typeof state !== 'object') return null;

  const candidate = (state as Record<string, unknown>)[HISTORY_STATE_KEY];
  if (!candidate || typeof candidate !== 'object') return null;

  const { path, stack } = candidate as Record<string, unknown>;
  if (!isInternalPath(path) || !Array.isArray(stack)) return null;

  const safeStack = stack.filter(isInternalPath).slice(-MAX_STACK_DEPTH);
  if (safeStack.length === 0 || safeStack.at(-1) !== path) return null;

  return { path, stack: safeStack };
}

export default function InternalNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const stackRef = useRef<string[]>([]);
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isMainPortfolioPath(pathname)) {
      stackRef.current = [];
      setPreviousPath(null);
      return;
    }

    const currentState = window.history.state;
    const marker = readMarker(currentState);

    let stack: string[];
    if (marker?.path === pathname) {
      // Native browser back/forward and reload restore the stack attached to
      // that exact history entry.
      stack = marker.stack;
    } else if (stackRef.current.at(-2) === pathname) {
      // A rendered "Back to …" link points at the known prior pathname. Pop
      // that return instead of appending it and creating a two-page loop.
      stack = stackRef.current.slice(0, -1);
    } else {
      stack = [...stackRef.current, pathname]
        .filter((path, index, paths) => index === 0 || path !== paths[index - 1])
        .slice(-MAX_STACK_DEPTH);
    }

    const normalizedStack = stack.length > 0 ? stack : [pathname];
    stackRef.current = normalizedStack;
    setPreviousPath(normalizedStack.at(-2) ?? null);

    const stateRecord = currentState && typeof currentState === 'object'
      ? currentState as Record<string, unknown>
      : {};

    window.history.replaceState(
      {
        ...stateRecord,
        [HISTORY_STATE_KEY]: {
          path: pathname,
          stack: normalizedStack,
        } satisfies InternalHistoryMarker,
      },
      '',
    );
  }, [pathname]);

  const value = useMemo(() => ({ previousPath }), [previousPath]);

  return (
    <InternalNavigationContext.Provider value={value}>
      {children}
    </InternalNavigationContext.Provider>
  );
}

export function useInternalNavigation(): InternalNavigationContextValue {
  const context = useContext(InternalNavigationContext);
  if (!context) {
    throw new Error('useInternalNavigation must be used within InternalNavigationProvider');
  }
  return context;
}
