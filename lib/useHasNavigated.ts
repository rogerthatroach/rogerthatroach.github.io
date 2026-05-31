import { useEffect, useState } from 'react';

// Module-scoped: false until the first client-side mount completes, then true
// for the rest of the session. Lets entrance animations distinguish a COLD load
// (don't animate — the content, incl. the LCP title, must paint immediately or
// LCP waits for JS hydration) from an IN-APP navigation (animate freely — LCP
// isn't measured the same way, and the transition reads nicely).
let navigated = false;

/**
 * Returns `true` only after the first page has mounted — i.e. the user has
 * navigated within the app. On the initial (cold) load it returns `false`, so
 * callers gate their entrance with `initial={hasNavigated ? {…} : false}`
 * (`initial={false}` renders at the target state with no animation → fast LCP).
 */
export function useHasNavigated(): boolean {
  // Read the module flag at mount time (stable for this component's life).
  const [value] = useState(() => navigated);
  useEffect(() => {
    navigated = true;
  }, []);
  return value;
}
