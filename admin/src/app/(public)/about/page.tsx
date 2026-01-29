import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import { generateOrganizationSchema } from '@/lib/seo/structuredData';
import PageHeader from '@/components/public/Shared/PageHeader';
import AboutHero from '@/components/public/About/AboutHero';
import MissionVision from '@/components/public/About/MissionVision';
import AboutAccordion from '@/components/public/About/AboutAccordion';

// SEO Metadata
export const metadata = genMeta({
  title: 'Haqqımızda',
  description: 'Mood IT haqqında - Bakıda 12+ il təcrübəyə malik peşəkar texniki servis komandası. Etibarlı, sürətli, keyfiyyətli.',
  keywords: ['mood it haqqında', 'texniki servis bakı', 'təmir komandası', 'peşəkar servis azərbaycan'],
  path: '/about',
});

export default function AboutPage() {
  // Structured data for Organization
  const structuredData = generateOrganizationSchema({
    name: 'Mood IT',
    description: 'Bakıda peşəkar texniki servis',
    url: 'https://moodit.at',
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Header */}
      <PageHeader
        title="Haqqımızda"
        breadcrumbs={[
          { label: 'Ana Səhifə', href: '/' },
          { label: 'Haqqımızda', href: '/about' },
        ]}
      />

      {/* About Hero Section */}
      <AboutHero />

      {/* Mission & Vision Accordion */}
      <MissionVision />

      {/* About Accordion Section */}
      <AboutAccordion />
    </>
  );
}

// Static Site Generation
export const revalidate = 3600; // Revalidate every hour
