import { getFileUrl } from '@/lib/api-client';
import { getDivisionBySlug } from '@/lib/api/services.api';
import { OG_IMAGE_CONFIG } from '@/lib/seo/og-image';
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type OGProps = {
  params: Promise<{ slug: string }>;
};

export default async function OGImage({ params }: OGProps) {
  const { slug } = await params;

  let divisionName = 'Healthcare Services';
  let divisionOverview = 'Subspecialized medical care at Liyana Healthcare';
  let divisionImage: string | null = null;

  try {
    const division = await getDivisionBySlug(slug);
    if (division) {
      divisionName = division.name;
      divisionOverview = division.overview;
      divisionImage = division.groupPhoto ? getFileUrl(division.groupPhoto) : null;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          background: divisionImage
            ? 'transparent'
            : 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {divisionImage && (
          <img
            src={divisionImage}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(15,23,42,0.75)',
            padding: '48px 60px',
            borderRadius: '12px',
          }}
        >
          <img
            src={`${OG_IMAGE_CONFIG.logoUrl}`}
            alt="Liyana Healthcare"
            width={160}
            height={80}
            style={{ objectFit: 'contain', marginBottom: '32px' }}
          />
          <div
            style={{
              fontSize: '52px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            {divisionName}
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.5,
            }}
          >
            {divisionOverview.length > 120
              ? `${divisionOverview.slice(0, 120)}...`
              : divisionOverview}
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '16px',
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
