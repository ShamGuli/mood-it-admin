'use client';

import { useState, useEffect } from 'react';

interface Props {
  brandId: string;
  onSelect: (model: any) => void;
  onBack: () => void;
}

export default function StepModel({ brandId, onSelect, onBack }: Props) {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchModels();
  }, [brandId]);

  const fetchModels = async () => {
    try {
      const response = await fetch(`/api/public/models?brand_id=${brandId}`);
      const data = await response.json();
      if (data.success) {
        setModels(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <h2 className="step-title">Modelini seçin</h2>
      <p className="step-description">Cihazınızın dəqiq modeli nədir?</p>

      {/* Search */}
      <div style={{ maxWidth: '500px', margin: '30px auto' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Model axtar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ fontSize: '16px', padding: '15px 20px' }}
        />
      </div>

      <div
        className="model-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px',
          marginTop: '30px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="model-card"
            onClick={() => onSelect(model)}
            style={{
              background: 'var(--bg-color)',
              border: '2px solid var(--divider-color)',
              borderRadius: '12px',
              padding: '20px 15px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <h4 style={{ color: 'var(--primary-color)', fontSize: '16px', margin: 0 }}>
              {model.name}
            </h4>
          </div>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-color)' }}>
          <p>Model tapılmadı</p>
        </div>
      )}

      {/* Back Button */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button onClick={onBack} className="btn-default" style={{ minWidth: '150px' }}>
          <i className="fa-solid fa-arrow-left"></i> Geri
        </button>
      </div>
    </div>
  );
}
