'use client';

const stats = [
  { number: 5000, suffix: '+', label: 'Təmir edilmiş cihaz' },
  { number: 98, suffix: '%', label: 'Müştəri məmnuniyyəti' },
  { number: 10, suffix: '+', label: 'İl təcrübə' },
  { number: 24, suffix: 'saat', label: 'Texniki dəstək' },
];

export default function CounterSection() {
  return (
    <div className="counter-section">
      <div className="container">
        <div className="row">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="counter-item wow fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                <div className="counter-number">
                  <span className="counter">{stat.number}</span>
                  <span className="suffix">{stat.suffix}</span>
                </div>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
