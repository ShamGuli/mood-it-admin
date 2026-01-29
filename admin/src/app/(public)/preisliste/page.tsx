import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import PageHeader from '@/components/public/Shared/PageHeader';
import PriceCalculatorWizard from '@/components/public/PriceCalculator/PriceCalculatorWizard';

// SEO Metadata
export const metadata = genMeta({
  title: 'Qiymət Kalkulyatoru',
  description: 'Cihazınızın təmiri üçün qiyməti hesablayın. Kateqoriya, brend və model seçərək dəqiq qiymət öyrənin.',
  keywords: ['qiymətlər', 'təmir', 'xərc', 'samsung', 'apple', 'noutbuk', 'playstation', 'gpu', 'hesablama'],
  path: '/preisliste',
});

export default function PreislistePage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Qiymət Kalkulyatoru"
        breadcrumbs={[
          { label: 'Ana Səhifə', href: '/' },
          { label: 'Qiymətlər', href: '/preisliste' },
        ]}
      />

      {/* Price Calculator */}
      <div className="preisliste-wizard" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title section-title-center" style={{ marginBottom: '50px' }}>
                <h3 className="wow fadeInUp">Qiymət Hesabla</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s">
                  Cihazınızın təmiri üçün <span>dəqiq qiymət</span> öyrənin
                </h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  Sadəcə 4 addımda cihazınızın təmir qiymətini hesablayın
                </p>
              </div>

              {/* Wizard */}
              <PriceCalculatorWizard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// SSR - Always fresh data
export const dynamic = 'force-dynamic';
