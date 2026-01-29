import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/public/Shared/PageHeader';
import ServiceDetail from '@/components/public/Services/ServiceDetail';
import ServiceSidebar from '@/components/public/Services/ServiceSidebar';

interface Props {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data: service } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!service) {
    return genMeta({
      title: 'Xidmət tapılmadı',
      description: 'Axtardığınız xidmət mövcud deyil',
      path: `/services/${params.slug}`,
    });
  }

  return genMeta({
    title: service.name_de,
    description: service.description_de || service.name_de,
    keywords: [service.name_de, service.category?.name_de || '', 'təmir', 'servis', 'bakı'],
    path: `/services/${params.slug}`,
  });
}

// Generate static paths for all services
export async function generateStaticParams() {
  const supabase = createClient();
  const { data: services } = await supabase
    .from('services')
    .select('slug')
    .eq('is_active', true);

  return (services || []).map((service) => ({
    slug: service.slug,
  }));
}

// Fetch single service
async function getService(slug: string) {
  const supabase = createClient();

  const { data: service } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  return service;
}

// Fetch related services
async function getRelatedServices(categoryId: string, currentServiceId: string) {
  const supabase = createClient();

  const { data: services } = await supabase
    .from('services')
    .select('id, name_de, slug, icon, price_min, price_max')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentServiceId)
    .order('display_order')
    .limit(5);

  return services || [];
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedServices(service.category_id, service.id);

  // Generate structured data
  const structuredData = generateServiceSchema({
    name: service.name_de,
    description: service.description_de || service.name_de,
    provider: {
      name: 'Mood IT',
      url: 'https://moodit.at',
    },
    serviceType: service.category?.name_de || 'Texniki Servis',
    areaServed: 'Bakı, Azərbaycan',
    offers: service.price_min && service.price_max ? {
      price: service.price_min,
      priceCurrency: 'EUR',
      priceRange: `€${service.price_min}-€${service.price_max}`,
    } : undefined,
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
        title={service.name_de}
        breadcrumbs={[
          { label: 'Ana Səhifə', href: '/' },
          { label: 'Xidmətlər', href: '/services' },
          { label: service.name_de, href: `/services/${service.slug}` },
        ]}
      />

      {/* Service Content */}
      <div className="service-detail-page" style={{ padding: '120px 0 90px' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* Service Detail */}
              <ServiceDetail service={service} />
            </div>

            <div className="col-lg-4">
              {/* Sidebar */}
              <ServiceSidebar service={service} relatedServices={relatedServices} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ISR - Revalidate every 5 minutes
export const revalidate = 300;
