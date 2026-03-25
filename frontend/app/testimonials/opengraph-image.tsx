import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`}
          alt="Liyana Healthcare"
          width={180}
          height={90}
          style={{ objectFit: 'contain', marginBottom: '40px' }}
        />
        <div
          style={{
            fontSize: '52px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Testimonials
        </div>
        <div
          style={{
            fontSize: '22px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
          }}
        >
          Trusted by leading healthcare organizations across East Africa
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '18px',
            color: '#009ad6',
            fontWeight: '600',
          }}
        >
          liyanahealthcare.com
        </div>
      </div>
    ),
    { ...size }
  );
}
