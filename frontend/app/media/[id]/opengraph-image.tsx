import { getFileUrl } from '@/lib/api-client';
import { getMediaFolder } from '@/lib/api/media.api';
import { OG_IMAGE_CONFIG } from '@/lib/seo/og-image';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OGImage({ params }: Props) {
  const { id } = await params;

  let folderName = 'Media Gallery';
  let folderDescription = 'Visual stories from Liyana Healthcare';
  let coverImageUrl: string | null = null;
  let mediaCount = 0;
  let tagName = '';

  try {
    const folder = await getMediaFolder(id);
    folderName = folder.name;
    folderDescription = folder.description;
    coverImageUrl = getFileUrl(folder.coverImage);
    mediaCount = folder.mediaCount;
    tagName = folder.tag?.name ?? '';
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
        {coverImageUrl && (
          <img
            src={coverImageUrl}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <img
              src={`${OG_IMAGE_CONFIG.logoUrl}`}
              alt="Liyana Healthcare"
              width={120}
              height={60}
              style={{ objectFit: 'contain' }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {tagName && (
                <div
                  style={{
                    background: '#0880b9',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '700',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {tagName}
                </div>
              )}
              {mediaCount > 0 && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#94a3b8',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '6px 14px',
                    borderRadius: '999px',
                  }}
                >
                  {mediaCount} {mediaCount === 1 ? 'item' : 'items'}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '52px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {folderName.length > 60 ? `${folderName.slice(0, 60)}...` : folderName}
            </div>
            <div
              style={{
                fontSize: '22px',
                color: '#94a3b8',
                maxWidth: '800px',
                lineHeight: 1.5,
              }}
            >
              {folderDescription.length > 120
                ? `${folderDescription.slice(0, 120)}...`
                : folderDescription}
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
    { ...size }
  );
}
