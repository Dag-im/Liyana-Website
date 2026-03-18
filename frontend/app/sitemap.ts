import type { MetadataRoute } from 'next';

import { getBlogs } from '@/lib/api/blog.api';
import { getNewsEvents } from '@/lib/api/news-events.api';
import { getDivisions } from '@/lib/api/services.api';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/about/who-we-are`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about/mission-vision`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about/leadership`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about/awards`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about/quality-policy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/news-events`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/media`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/testimonials`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/esg/csr`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/esg/sustainability`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  let divisionRoutes: MetadataRoute.Sitemap = [];
  let newsEventRoutes: MetadataRoute.Sitemap = [];

  try {
    const blogs = await getBlogs({ perPage: 200 });
    blogRoutes = blogs.data.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch {}

  try {
    const divisions = await getDivisions({ isActive: true });
    divisionRoutes = divisions.map((division) => ({
      url: `${SITE_URL}/services/${division.slug}`,
      lastModified: new Date(division.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {}

  try {
    const newsEvents = await getNewsEvents({ perPage: 200 });
    newsEventRoutes = newsEvents.data.map((item) => ({
      url: `${SITE_URL}/news-events/${item.id}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...blogRoutes, ...divisionRoutes, ...newsEventRoutes];
}
