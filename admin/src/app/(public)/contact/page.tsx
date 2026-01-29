import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/public/Shared/PageHeader';
import ContactForm from '@/components/public/Contact/ContactForm';
import ContactInfo from '@/components/public/Contact/ContactInfo';
import ContactMap from '@/components/public/Contact/ContactMap';

// SEO Metadata
export const metadata = genMeta({
  title: 'Əlaqə',
  description: 'Mood IT - Bizimlə əlaqə saxlayın. Notebook, PlayStation və kompüter servisi üçün peşəkar texniki dəstək.',
  keywords: ['əlaqə', 'texniki dəstək', 'servis', 'notebook təmiri', 'PlayStation', 'kompüter'],
  path: '/contact',
});

// Fetch settings for contact info
async function getContactSettings() {
  const supabase = createClient();

  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', [
      'contact_phone',
      'contact_email',
      'contact_whatsapp',
      'address_street',
      'address_city',
      'address_zip',
      'address_country',
      'business_hours',
      'google_maps_embed',
    ]);

  const settingsObj = settings?.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return settingsObj || {};
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Əlaqə"
        breadcrumbs={[
          { label: 'Ana Səhifə', href: '/' },
          { label: 'Əlaqə', href: '/contact' },
        ]}
      />

      {/* Contact Section */}
      <div className="page-contact-us">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Bizimlə əlaqə</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
                  Suallarınızı göndərin və <span>peşəkar dəstək</span> alın
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  Texniki problemləriniz və ya suallarınız varsa, komandamız sizə kömək etməyə hazırdır. 
                  Formu doldurun və ya birbaşa bizimlə əlaqə saxlayın.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-7">
              {/* Contact Form */}
              <ContactForm />
            </div>

            <div className="col-lg-5">
              {/* Contact Info */}
              <ContactInfo settings={settings} />
            </div>
          </div>

          {/* Google Map */}
          <ContactMap embedUrl={settings.google_maps_embed} />
        </div>
      </div>
    </>
  );
}

// Server-side rendering (dynamic data)
export const dynamic = 'force-dynamic';
