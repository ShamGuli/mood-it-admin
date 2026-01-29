'use client';

import { useState, useEffect } from 'react';

interface Props {
  categoryId: string;
  selectedServices: any[];
  onSelect: (services: any[]) => void;
  onBack: () => void;
  onFinish: () => void;
}

export default function StepService({ categoryId, selectedServices, onSelect, onBack, onFinish }: Props) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any[]>(selectedServices);

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/public/services?category_id=${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: any) => {
    const isSelected = selected.find((s) => s.id === service.id);
    let newSelected;

    if (isSelected) {
      newSelected = selected.filter((s) => s.id !== service.id);
    } else {
      newSelected = [...selected, service];
    }

    setSelected(newSelected);
    onSelect(newSelected);
  };

  const totalPrice = selected.reduce((sum, service) => {
    return sum + (service.price_min || 0) + (service.price_max || 0);
  }, 0) / 2;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yüklənir...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-step active">
      <h2 className="step-title">Xidmətləri seçin</h2>
      <p className="step-description">Hansı təmir xidmətlərinə ehtiyacınız var? (Çoxlu seçim)</p>

      <div
        className="service-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '40px',
        }}
      >
        {services.map((service) => {
          const isSelected = selected.find((s) => s.id === service.id);
          return (
            <div
              key={service.id}
              className={`service-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleService(service)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(65, 133, 221, 0.15), rgba(180, 45, 218, 0.15))'
                  : 'var(--bg-color)',
                border: `2px solid ${isSelected ? '#4185DD' : 'var(--divider-color)'}`,
                borderRadius: '15px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${isSelected ? '#4185DD' : 'var(--divider-color)'}`,
                  background: isSelected ? '#4185DD' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                {isSelected && '✓'}
              </div>

              {/* Icon */}
              {service.icon && (
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                  }}
                >
                  <i className={service.icon} style={{ fontSize: '24px', color: 'white' }}></i>
                </div>
              )}

              {/* Name */}
              <h4 style={{ color: 'var(--primary-color)', fontSize: '16px', marginBottom: '10px' }}>
                {service.name_de}
              </h4>

              {/* Description */}
              {service.description_de && (
                <p style={{ color: 'var(--text-color)', fontSize: '13px', marginBottom: '15px' }}>
                  {service.description_de.substring(0, 60)}...
                </p>
              )}

              {/* Price */}
              {service.price_min && service.price_max && (
                <div>
                  <span style={{ color: '#B42FDA', fontWeight: '600', fontSize: '16px' }}>
                    €{service.price_min} - €{service.price_max}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Summary */}
      {selected.length > 0 && (
        <div
          style={{
            marginTop: '40px',
            padding: '25px',
            background: 'linear-gradient(135deg, rgba(65, 133, 221, 0.1), rgba(180, 45, 218, 0.1))',
            borderRadius: '15px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--text-color)', marginBottom: '10px' }}>
            {selected.length} xidmət seçildi
          </p>
          <h3 style={{ color: '#B42FDA', fontSize: '28px', marginBottom: '0' }}>
            Təxmini: €{Math.round(totalPrice)}
          </h3>
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button onClick={onBack} className="btn-default" style={{ minWidth: '150px' }}>
          <i className="fa-solid fa-arrow-left"></i> Geri
        </button>
        <button
          onClick={onFinish}
          className="btn-default btn-highlighted"
          style={{ minWidth: '150px' }}
          disabled={selected.length === 0}
        >
          Nəticəni gör <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
