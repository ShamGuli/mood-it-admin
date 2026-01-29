interface Service {
  id: string;
  name_de: string;
  description_de?: string;
  description_long_de?: string;
  icon?: string;
  price_min?: number;
  price_max?: number;
  duration_days?: number;
  features?: string[];
  category?: {
    name_de: string;
  };
}

interface Props {
  service: Service;
}

export default function ServiceDetail({ service }: Props) {
  return (
    <div className="service-detail-content">
      {/* Hero Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          {service.icon && (
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className={service.icon} style={{ fontSize: '40px', color: 'white' }}></i>
            </div>
          )}
          <div>
            <h2 style={{ color: 'var(--primary-color)', fontSize: '32px', marginBottom: '10px' }}>
              Peşəkar {service.name_de}
            </h2>
            {service.category && (
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(180, 45, 218, 0.1)',
                  color: '#B42FDA',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                }}
              >
                {service.category.name_de}
              </span>
            )}
          </div>
        </div>

        <p style={{ color: 'var(--text-color)', fontSize: '16px', lineHeight: '1.8' }}>
          {service.description_de || service.description_long_de}
        </p>
      </div>

      {/* Features Grid */}
      {service.features && service.features.length > 0 && (
        <div style={{ marginBottom: '50px' }}>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: '25px' }}>
            Xidmət daxildir
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {service.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-color)',
                  border: '2px solid var(--divider-color)',
                  borderRadius: '15px',
                  padding: '25px',
                }}
              >
                <i
                  className="fa-solid fa-check-circle"
                  style={{ fontSize: '32px', color: '#4185DD', marginBottom: '15px' }}
                ></i>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>{feature}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Steps */}
      <div>
        <h3 style={{ color: 'var(--primary-color)', fontSize: '24px', marginBottom: '30px' }}>
          <i className="fa-solid fa-list-check" style={{ color: '#B42FDA', marginRight: '10px' }}></i>
          Prosesimiz
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Diaqnostika</h4>
              <p style={{ color: 'var(--text-color)', fontSize: '14px', lineHeight: '1.6' }}>
                Cihazınızı ətraflı yoxlayır və dəqiq qiymət təklifi təqdim edirik.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Təmir</h4>
              <p style={{ color: 'var(--text-color)', fontSize: '14px', lineHeight: '1.6' }}>
                Mütəxəssislərimiz keyfiyyətli ehtiyat hissələri ilə təmiri həyata keçirir.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Keyfiyyət nəzarəti</h4>
              <p style={{ color: 'var(--text-color)', fontSize: '14px', lineHeight: '1.6' }}>
                Bütün funksiyaları test edir və cihazınızın mükəmməl işlədiyindən əmin oluruq.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
