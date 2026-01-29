import Link from 'next/link';

interface Service {
  id: string;
  name_de: string;
  slug: string;
  description_de?: string;
  icon?: string;
  price_min?: number;
  price_max?: number;
  duration_days?: number;
}

interface Props {
  services: Service[];
  categoryName: string;
}

export default function CategoryServices({ services, categoryName }: Props) {
  if (services.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-color)' }}>Bu kateqoriyada hələ xidmət yoxdur.</p>
      </div>
    );
  }

  return (
    <div className="category-services" style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title section-title-center" style={{ marginBottom: '50px' }}>
              <h3 className="wow fadeInUp">{categoryName} Xidmətləri</h3>
              <h2 className="wow fadeInUp" data-wow-delay="0.2s">
                Mövcud <span>təmir xidmətləri</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          {services.map((service, index) => (
            <div key={service.id} className="col-lg-4 col-md-6">
              <div
                className="service-card wow fadeInUp"
                data-wow-delay={`${index * 0.1}s`}
                style={{
                  background: 'var(--bg-color)',
                  border: '2px solid var(--divider-color)',
                  borderRadius: '20px',
                  padding: '30px',
                  marginBottom: '30px',
                  transition: 'all 0.3s',
                }}
              >
                {/* Icon */}
                {service.icon && (
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <i className={service.icon} style={{ fontSize: '32px', color: 'white' }}></i>
                  </div>
                )}

                {/* Title */}
                <h3 style={{ color: 'var(--primary-color)', fontSize: '22px', marginBottom: '15px' }}>
                  <Link href={`/services/${service.slug}`}>{service.name_de}</Link>
                </h3>

                {/* Description */}
                {service.description_de && (
                  <p style={{ color: 'var(--text-color)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                    {service.description_de.length > 100
                      ? service.description_de.substring(0, 100) + '...'
                      : service.description_de}
                  </p>
                )}

                {/* Price & Duration */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  {service.price_min && service.price_max && (
                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--text-color)', marginBottom: '5px' }}>Qiymət</p>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#B42FDA', margin: 0 }}>
                        €{service.price_min} - €{service.price_max}
                      </p>
                    </div>
                  )}
                  {service.duration_days && (
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-color)', marginBottom: '5px' }}>Müddət</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-color)', margin: 0 }}>
                        {service.duration_days} gün
                      </p>
                    </div>
                  )}
                </div>

                {/* Link */}
                <Link
                  href={`/services/${service.slug}`}
                  className="btn-default"
                  style={{ width: '100%', textAlign: 'center', display: 'block' }}
                >
                  Ətraflı
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
