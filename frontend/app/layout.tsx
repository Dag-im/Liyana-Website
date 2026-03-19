import Footer from '@/components/shared/footer';
import { JsonLd } from '@/components/shared/JsonLd';
import NavBar from '@/components/shared/navBar';
import { getWhoWeAre } from '@/lib/api/cms.api';
import { getServiceCategories } from '@/lib/api/services.api';
import { DEFAULT_METADATA } from '@/lib/seo/metadata';
import {
  medicalOrganizationSchema,
  organizationSchema,
} from '@/lib/seo/structured-data';
import type { ServiceCategory } from '@/types/services.types';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = DEFAULT_METADATA;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: ServiceCategory[] = [];
  let footerDescription: string | undefined;

  await Promise.allSettled([
    getServiceCategories().then((data) => {
      categories = data;
    }),
    getWhoWeAre().then((data) => {
      footerDescription = data.content;
    }),
  ]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={[organizationSchema(), medicalOrganizationSchema()]} />
        <NavBar categories={categories} />
        {children}
        <Footer description={footerDescription} />
      </body>
    </html>
  );
}
