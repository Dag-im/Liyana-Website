const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://liyanahealthcare.com';
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? 'Liyana Healthcare';
const LOGO_URL = `${SITE_URL}/images/logo.png`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description:
      'Liyana Healthcare delivers subspecialized medical care, advanced diagnostics, and integrated healthcare solutions across Ethiopia and East Africa.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Amharic'],
    },
    sameAs: [],
  };
}

export function medicalOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    medicalSpecialty: [
      'Orthopedic',
      'Neurology',
      'Oncology',
      'Diagnostics',
      'Internal Medicine',
      'Ophthalmology',
      'Dental',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
  };
}

export function blogPostingSchema(blog: {
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  publishedAt: string | null;
  image: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.image,
    url: `${SITE_URL}/blog/${blog.slug}`,
    datePublished: blog.publishedAt,
    author: {
      '@type': 'Person',
      name: blog.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    articleSection: blog.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${blog.slug}`,
    },
  };
}

export function articleSchema(newsEvent: {
  title: string;
  summary: string;
  id: string;
  mainImage: string;
  createdByName: string;
  publishedAt: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: newsEvent.title,
    description: newsEvent.summary,
    image: newsEvent.mainImage,
    url: `${SITE_URL}/news-events/${newsEvent.id}`,
    datePublished: newsEvent.publishedAt,
    author: {
      '@type': 'Person',
      name: newsEvent.createdByName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };
}

export function eventSchema(newsEvent: {
  title: string;
  summary: string;
  id: string;
  mainImage: string;
  date: string;
  location: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: newsEvent.title,
    description: newsEvent.summary,
    image: newsEvent.mainImage,
    url: `${SITE_URL}/news-events/${newsEvent.id}`,
    startDate: newsEvent.date,
    location: newsEvent.location
      ? {
          '@type': 'Place',
          name: newsEvent.location,
          address: {
            '@type': 'PostalAddress',
            addressLocality: newsEvent.location,
          },
        }
      : {
          '@type': 'Place',
          name: 'Addis Ababa, Ethiopia',
        },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function divisionSchema(division: {
  name: string;
  slug: string;
  overview: string;
  location: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: division.name,
    description: division.overview,
    url: `${SITE_URL}/services/${division.slug}`,
    address: division.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: division.location,
          addressCountry: 'ET',
        }
      : {
          '@type': 'PostalAddress',
          addressLocality: 'Addis Ababa',
          addressCountry: 'ET',
        },
    parentOrganization: {
      '@type': 'MedicalOrganization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
