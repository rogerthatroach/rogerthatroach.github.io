import { ImageResponse } from 'next/og';

// Next 16 requires explicit force-static for ImageResponse metadata routes
// under output:'export' (was implicit in 14).
export const dynamic = 'force-static';

// 180×180 home-screen icon for iOS (and a high-res icon for Android via the
// manifest). Mirrors app/icon.tsx; opaque background since iOS masks corners.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 76,
          background: '#0c0a0a',
          color: '#e8b77a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        HSD
      </div>
    ),
    { ...size },
  );
}
