import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  is_active: boolean;
}

interface Props {
  brands: Brand[];
  categoryName: string;
}

export default function CategoryBrands({ brands, categoryName }: Props) {
  return (
    <div className="category-brands" style={{ padding: '80px 0', background: 'var(--secondary-color)' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title section-title-center" style={{ marginBottom: '50px' }}>
              <h3 className="wow fadeInUp">Dəstəklənən Brendlər</h3>
              <h2 className="wow fadeInUp" data-wow-delay="0.2s">
                {categoryName} üçün <span>təmir edirik</span>
              </h2>
              <p className="wow fadeInUp" data-wow-delay="0.4s">
                Bütün populyar brendlər üçün peşəkar təmir xidməti təqdim edirik
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {brands.map((brand, index) => (
            <div key={brand.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
              <div
                className="brand-item wow fadeInUp"
                data-wow-delay={`${index * 0.05}s`}
                style={{
                  background: 'var(--bg-color)',
                  border: '2px solid var(--divider-color)',
                  borderRadius: '15px',
                  padding: '25px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
              >
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    width={120}
                    height={50}
                    style={{ maxWidth: '100%', maxHeight: '50px', objectFit: 'contain' }}
                  />
                ) : (
                  <span
                    style={{
                      color: 'var(--primary-color)',
                      fontSize: '16px',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    {brand.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="row" style={{ marginTop: '40px' }}>
          <div className="col-lg-12">
            <div
              style={{
                background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                borderRadius: '25px',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: 'white', fontSize: '28px', marginBottom: '15px' }}>
                Brendinizi görmədiniz?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '25px' }}>
                Bir çox digər brendləri də təmir edirik. Bizimlə əlaqə saxlayın və brendinizi yoxlayaq!
              </p>
              <a
                href="/contact"
                className="btn-default"
                style={{ background: 'white', color: '#4185DD', border: 'none' }}
              >
                <i className="fa-solid fa-phone"></i> Bizimlə əlaqə
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
