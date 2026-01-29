import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/public/Shared/PageHeader';
import ServiceGrid from '@/components/public/Services/ServiceGrid';

// SEO Metadata
export const metadata = genMeta({
  title: 'Bütün Xidmətlər',
  description: 'Mood IT-nin bütün xidmətləri - Smartphone, PlayStation, macOS, Notebook, Desktop və GPU servisi Bakıda.',
  keywords: ['təmir', 'servis', 'smartfon', 'playstation', 'noutbuk', 'gpu', 'bakı'],
  path: '/services',
});

// Fetch all services
async function getAllServices() {
  const supabase = createClient();

  const { data: services } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('is_active', true)
    .order('display_order');

  return services || [];
}

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Bütün Xidmətlər"
        breadcrumbs={[
          { label: 'Ana Səhifə', href: '/' },
          { label: 'Xidmətlər', href: '/services' },
        ]}
      />

      {/* Services Section */}
      <div className="our-services" style={{ padding: '120px 0 90px' }}>
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Xidmətlərimiz</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
                  Bütün cihazlar üçün peşəkar təmir və <span>texniki servis</span>
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  Smartfonlardan oyun konsollarına və yüksək performanslı PC-lərə qədər – geniş təmir və baxım xidmətləri təqdim edirik
                </p>
              </div>
            </div>
          </div>

          {/* Service Grid */}
          <ServiceGrid services={services} />
        </div>
      </div>
    </>
  );
}

// ISR - Revalidate every 5 minutes
export const revalidate = 300;
