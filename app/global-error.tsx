'use client';

// Root error boundary. This site is heavily client-hydrated (Three.js,
// ReactFlow, KaTeX, the blue-rose SPA); without this, an unhandled client
// render error shows React's blank screen with no recovery. global-error
// replaces the root layout, so it must render its own <html>/<body>.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0a0a',
          color: '#f8f5f2',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '32rem' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a8181' }}>
            § Error
          </p>
          <h1 style={{ marginTop: '1rem', fontSize: '1.25rem', lineHeight: 1.6, fontWeight: 400 }}>
            Something broke rendering this page.
            <br />
            <span style={{ color: '#b8b0ad' }}>Nothing&rsquo;s lost — try again.</span>
          </h1>
          <button
            onClick={() => reset()}
            style={{
              marginTop: '2rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #2a2625',
              background: 'transparent',
              color: '#e8b77a',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
          {' '}
          <a href="/" style={{ marginLeft: '0.75rem', color: '#e8b77a', fontSize: '0.875rem' }}>
            Start at the beginning
          </a>
        </div>
      </body>
    </html>
  );
}
