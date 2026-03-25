import { getFileUrl } from '@/lib/api-client';
import { getBlogBySlug } from '@/lib/api/blog.api';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title = 'Blog Post';
  let excerpt = 'Insights from Liyana Healthcare';
  let authorName = 'Liyana Healthcare';
  let authorRole = '';
  let category = '';
  let imageUrl: string | null = null;
  let publishedAt = '';

  try {
    const blog = await getBlogBySlug(slug);
    if (blog) {
      title = blog.title;
      excerpt = blog.excerpt;
      authorName = blog.authorName?.trim() || 'Liyana Healthcare';
      authorRole = blog.authorRole?.trim() || '';
      category = blog.category.name;
      imageUrl = getFileUrl(blog.image);
      publishedAt = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';
    }
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
              opacity: 0.2,
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
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`}
              alt="Liyana Healthcare"
              width={120}
              height={60}
              style={{ objectFit: 'contain' }}
            />
            {category && (
              <div
                style={{
                  background: '#0880b9',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {category}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                fontSize: '46px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
              }}
            >
              {title.length > 72 ? `${title.slice(0, 72)}...` : title}
            </div>
            <div
              style={{
                fontSize: '20px',
                color: '#94a3b8',
                maxWidth: '800px',
                lineHeight: 1.5,
              }}
            >
              {excerpt.length > 120 ? `${excerpt.slice(0, 120)}...` : excerpt}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  color: 'white',
                  fontWeight: '600',
                }}
              >
                {authorName}
              </div>
              {authorRole && (
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                  {authorRole}
                </div>
              )}
            </div>
            {publishedAt && (
              <div style={{ fontSize: '14px', color: '#009ad6' }}>
                {publishedAt}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
