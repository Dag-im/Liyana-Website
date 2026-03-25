import { getFileUrl } from '@/lib/api-client';
import { getNewsEvent } from '@/lib/api/news-events.api';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let title = 'News & Events';
  let summary = 'Latest updates from Liyana Healthcare';
  let type = 'news';
  let imageUrl: string | null = null;
  let date = '';

  try {
    const item = await getNewsEvent(id);
    title = item.title;
    summary = item.summary;
    type = item.type;
    imageUrl = getFileUrl(item.mainImage);
    date = new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '48px 60px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`}
              alt="Liyana Healthcare"
              width={120}
              height={60}
              style={{ objectFit: 'contain' }}
            />
            <div
              style={{
                background: type === 'event' ? '#0880b9' : '#0e7490',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                padding: '6px 16px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {type === 'event' ? 'Event' : 'News'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {date && <div style={{ fontSize: '16px', color: '#009ad6' }}>{date}</div>}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {title.length > 70 ? `${title.slice(0, 70)}...` : title}
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#94a3b8',
                maxWidth: '800px',
                lineHeight: 1.5,
              }}
            >
              {summary.length > 120 ? `${summary.slice(0, 120)}...` : summary}
            </div>
          </div>

          <div
            style={{
              fontSize: '16px',
              color: '#009ad6',
              fontWeight: '600',
            }}
          >
            liyanahealthcare.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
