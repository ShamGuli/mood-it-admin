'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  categoryId: string;
  onSelect: (brand: any) => void;
  onBack: () => void;
}

export default function StepBrand({ categoryId, onSelect, onBack }: Props) {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, [categoryId]);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`/api/public/brands?category_id=${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <h2 className="step-title">Brendini seçin</h2>
      <p className="step-description">Cihazınızın markası nədir?</p>

      <div
        className="brand-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginTop: '40px',
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="brand-card"
            onClick={() => onSelect(brand)}
            style={{
              background: 'var(--bg-color)',
              border: '2px solid var(--divider-color)',
              borderRadius: '15px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
            }}
              >
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    width={120}
                    height={50}
                    style={{ maxWidth: '100%', maxHeight: '50px', objectFit: 'contain', marginBottom: '15px' }}
                  />
                ) : (
              <h4 style={{ color: 'var(--primary-color)', fontSize: '18px', marginBottom: '10px' }}>
                {brand.name}
              </h4>
            )}
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button onClick={onBack} className="btn-default" style={{ minWidth: '150px' }}>
          <i className="fa-solid fa-arrow-left"></i> Geri
        </button>
      </div>
    </div>
  );
}
