import Link from 'next/link';

interface Service {
  id: string;
  name_de: string;
  price_min?: number;
  price_max?: number;
  duration_days?: number;
}

interface RelatedService {
  id: string;
  name_de: string;
  slug: string;
  icon?: string;
  price_min?: number;
  price_max?: number;
}

interface Props {
  service: Service;
  relatedServices: RelatedService[];
}

export default function ServiceSidebar({ service, relatedServices }: Props) {
  return (
    <>
      {/* Quick Contact Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(65, 133, 221, 0.1), rgba(180, 45, 218, 0.1))',
          border: '2px solid #4185DD',
          borderRadius: '25px',
          padding: '35px',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ color: 'var(--primary-color)', fontSize: '20px', marginBottom: '20px' }}>
          <i className="fa-solid fa-circle-info" style={{ color: '#4185DD', marginRight: '10px' }}></i>
          Xidmət məlumatları
        </h3>

        {/* Price */}
        {service.price_min && service.price_max && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-color)', fontSize: '14px', marginBottom: '5px' }}>Qiymət aralığı</p>
            <h4 style={{ color: '#B42FDA', fontSize: '28px', fontWeight: '700' }}>
              €{service.price_min} - €{service.price_max}
            </h4>
          </div>
        )}

        {/* Duration */}
        {service.duration_days && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: 'var(--text-color)', fontSize: '14px', marginBottom: '5px' }}>Təmir müddəti</p>
            <h4 style={{ color: 'var(--primary-color)', fontSize: '20px' }}>
              {service.duration_days} gün
            </h4>
          </div>
        )}

        {/* CTA Buttons */}
        <div style={{ marginBottom: '15px' }}>
          <Link
            href="/preisliste"
            className="btn-default"
            style={{ width: '100%', textAlign: 'center', marginBottom: '15px', display: 'block' }}
          >
            <i className="fa-solid fa-calculator"></i> Qiymət hesabla
          </Link>
          <Link
            href="/contact"
            className="btn-default btn-highlighted"
            style={{ width: '100%', textAlign: 'center', display: 'block' }}
          >
            <i className="fa-solid fa-calendar"></i> Rezervasiya et
          </Link>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div
          style={{
            background: 'var(--secondary-color)',
            border: '1px solid var(--divider-color)',
            borderRadius: '25px',
            padding: '30px',
          }}
        >
          <h3 style={{ color: 'var(--primary-color)', fontSize: '20px', marginBottom: '20px' }}>
            <i className="fa-solid fa-list" style={{ color: '#B42FDA', marginRight: '10px' }}></i>
            Digər xidmətlər
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.id}
                href={`/services/${relatedService.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--divider-color)',
                  borderRadius: '12px',
                  color: 'var(--primary-color)',
                  transition: 'all 0.3s',
                }}
              >
                {relatedService.icon && (
                  <i className={relatedService.icon} style={{ fontSize: '24px', color: '#4185DD' }}></i>
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', marginBottom: '5px' }}>{relatedService.name_de}</span>
                  {relatedService.price_min && relatedService.price_max && (
                    <span style={{ fontSize: '12px', color: '#B42FDA' }}>
                      €{relatedService.price_min} - €{relatedService.price_max}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
