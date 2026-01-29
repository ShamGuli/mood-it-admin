'use client';

import { useState, useEffect } from 'react';

interface Props {
  onSelect: (category: any) => void;
}

export default function StepCategory({ onSelect }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
      <h2 className="step-title">Cihazınızın kateqoriyasını seçin</h2>
      <p className="step-description">Hansı cihazı təmir etdirmək istəyirsiniz?</p>

      <div
        className="category-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '25px',
          marginTop: '40px',
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => onSelect(category)}
            style={{
              background: 'linear-gradient(135deg, rgba(65, 133, 221, 0.05), rgba(180, 45, 218, 0.05))',
              border: '2px solid var(--divider-color)',
              borderRadius: '20px',
              padding: '35px 25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {/* Icon */}
            {category.icon && (
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className={category.icon} style={{ fontSize: '36px', color: 'white' }}></i>
              </div>
            )}

            {/* Name */}
            <h3 style={{ color: 'var(--primary-color)', fontSize: '18px', marginBottom: '10px' }}>
              {category.name_de}
            </h3>

            {/* Description */}
            {category.description_de && (
              <p style={{ color: 'var(--text-color)', fontSize: '13px', margin: 0 }}>
                {category.description_de.substring(0, 60)}...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
