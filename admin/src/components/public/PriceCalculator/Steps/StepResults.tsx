'use client';

import Link from 'next/link';

interface Props {
  wizardData: any;
  onReset: () => void;
  onBack: () => void;
}

export default function StepResults({ wizardData, onReset, onBack }: Props) {
  const { category, brand, model, services } = wizardData;

  const totalMin = services?.reduce((sum: number, s: any) => sum + (s.price_min || 0), 0) || 0;
  const totalMax = services?.reduce((sum: number, s: any) => sum + (s.price_max || 0), 0) || 0;
  const avgPrice = Math.round((totalMin + totalMax) / 2);

  return (
    <div className="wizard-step active">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="fa-solid fa-check" style={{ fontSize: '40px', color: 'white' }}></i>
        </div>
        <h2 className="step-title">Qiymət Hesablandı!</h2>
        <p className="step-description">Cihazınızın təmir qiymətinə baxın</p>
      </div>

      {/* Summary Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(65, 133, 221, 0.1), rgba(180, 45, 218, 0.1))',
          border: '2px solid #4185DD',
          borderRadius: '25px',
          padding: '40px',
          marginBottom: '30px',
        }}
      >
        {/* Device Info */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '20px', marginBottom: '20px' }}>
            <i className="fa-solid fa-mobile-screen-button" style={{ marginRight: '10px', color: '#4185DD' }}></i>
            Cihaz məlumatları
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-color)', marginBottom: '5px' }}>Kateqoriya</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-color)', margin: 0 }}>
                {category?.name_de}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-color)', marginBottom: '5px' }}>Brend</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-color)', margin: 0 }}>
                {brand?.name}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-color)', marginBottom: '5px' }}>Model</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-color)', margin: 0 }}>
                {model?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'var(--primary-color)', fontSize: '20px', marginBottom: '20px' }}>
            <i className="fa-solid fa-list-check" style={{ marginRight: '10px', color: '#4185DD' }}></i>
            Seçilmiş xidmətlər
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {services?.map((service: any) => (
              <div
                key={service.id}
                style={{
                  background: 'var(--bg-color)',
                  padding: '20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {service.icon && <i className={service.icon} style={{ fontSize: '24px', color: '#4185DD' }}></i>}
                  <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>{service.name_de}</span>
                </div>
                <span style={{ color: '#B42FDA', fontWeight: '600' }}>
                  €{service.price_min} - €{service.price_max}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '10px' }}>
            Təxmini Qiymət
          </p>
          <h2 style={{ color: 'white', fontSize: '48px', fontWeight: '700', marginBottom: '5px' }}>
            €{avgPrice}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
            (€{totalMin} - €{totalMax} arası)
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <Link
          href="/contact"
          className="btn-default btn-highlighted"
          style={{ minWidth: '250px', textAlign: 'center' }}
        >
          <i className="fa-solid fa-calendar"></i> Rezervasiya et
        </Link>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={onBack} className="btn-default" style={{ minWidth: '150px' }}>
            <i className="fa-solid fa-arrow-left"></i> Geri
          </button>
          <button onClick={onReset} className="btn-default">
            <i className="fa-solid fa-rotate"></i> Yenidən hesabla
          </button>
        </div>
      </div>
    </div>
  );
}
