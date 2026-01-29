import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import { generateLocalBusinessSchema } from '@/lib/seo/structuredData';
import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/public/Home/HeroSection';
import BrandSlider from '@/components/public/Home/BrandSlider';
import AboutSection from '@/components/public/Home/AboutSection';
import CounterSection from '@/components/public/Home/CounterSection';
import ServicesSection from '@/components/public/Home/ServicesSection';
import CTASection from '@/components/public/Home/CTASection';

// SEO Metadata
export const metadata = genMeta({
  title: 'Ana Səhifə',
  description: 'Mood IT - Bakıda peşəkar smartfon, PlayStation, noutbuk, GPU təmiri və texniki servis. Sürətli, etibarlı, keyfiyyətli.',
  keywords: ['təmir', 'servis', 'smartfon təmiri', 'playstation təmiri', 'noutbuk təmiri', 'gpu təmiri', 'bakı'],
  path: '/',
});

// Fetch data at build time
async function getHomePageData() {
  const supabase = createClient();

  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('is_active', true)
    .order('display_order')
    .limit(6);

  // Fetch settings
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['contact_phone', 'contact_email', 'address_street', 'address_city', 'business_hours']);

  const settingsObj = settings?.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    services: services || [],
    settings: settingsObj || {},
  };
}

export default async function HomePage() {
  const { services, settings } = await getHomePageData();

  // Generate structured data for SEO
  const structuredData = generateLocalBusinessSchema({
    name: 'Mood IT',
    description: 'Bakıda peşəkar texniki servis',
    url: 'https://moodit.at',
    telephone: settings.contact_phone,
    email: settings.contact_email,
    address: settings.address_street && settings.address_city ? {
      streetAddress: settings.address_street,
      addressLocality: settings.address_city,
      addressCountry: 'AZ',
    } : undefined,
    openingHours: settings.business_hours,
    priceRange: '€€',
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Brand Slider */}
      <BrandSlider />

      {/* About Section */}
      <AboutSection />

      {/* Counter/Stats Section */}
      <CounterSection />

      {/* Services Section */}
      <ServicesSection services={services} />

      {/* CTA Section */}
      <CTASection />
    </>
  );
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60;
