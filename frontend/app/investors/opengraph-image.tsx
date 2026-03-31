import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%)',
          color: 'white',
          padding: '72px',
        }}
      >
        <div style={{ fontSize: 18, letterSpacing: 6, textTransform: 'uppercase', color: '#67e8f9' }}>
          Liyana Healthcare
        </div>
        <div style={{ marginTop: 24, fontSize: 66, fontWeight: 700 }}>
          Investor Relations
        </div>
        <div style={{ marginTop: 20, maxWidth: 820, fontSize: 28, lineHeight: 1.4, color: '#cbd5e1' }}>
          Investing in the Future of Healthcare in East Africa
        </div>
      </div>
    ),
    { ...size }
  )
}
