/**
 * Lock root — `/blue-rose`.
 *
 * `BookhouseGate` (in app/blue-rose/layout.tsx) renders the LockScreen
 * when locked and redirects to /blue-rose/home on unlock. This page
 * file just exists so Next.js knows /blue-rose is a valid route; the
 * actual UI is owned by the gate. When unlocked + on this route, the
 * gate's redirect fires before this returns null hits the screen.
 */
export default function LockRoot() {
  return null;
}
