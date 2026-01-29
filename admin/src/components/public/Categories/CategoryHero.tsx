import Link from 'next/link';

interface Category {
  id: string;
  name_de: string;
  description_de?: string;
  icon?: string;
}

interface Props {
  category: Category;
  servicesCount: number;
}

export default function CategoryHero({ category, servicesCount }: Props) {
  return (
    <div className="category-hero" style={{ padding: '80px 0' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="category-hero-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                {category.icon && (
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                      borderRadius: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i className={category.icon} style={{ fontSize: '50px', color: 'white' }}></i>
                  </div>
                )}
                <div>
                  <h1 style={{ color: 'var(--primary-color)', fontSize: '42px', marginBottom: '10px' }}>
                    {category.name_de} Təmiri
                  </h1>
                  <p style={{ color: '#B42FDA', fontSize: '18px', marginBottom: '0' }}>
                    {servicesCount} xidmət mövcuddur
                  </p>
                </div>
              </div>

              <p style={{ color: 'var(--text-color)', fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}>
                {category.description_de ||
                  `Peşəkar ${category.name_de} təmiri və texniki servis. Sürətli, etibarlı və keyfiyyətli xidmət.`}
              </p>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <Link href="/preisliste" className="btn-default">
                  <i className="fa-solid fa-calculator"></i> Qiymət hesabla
                </Link>
                <Link href="/contact" className="btn-default btn-highlighted">
                  <i className="fa-solid fa-calendar"></i> Rezervasiya et
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(65, 133, 221, 0.1), rgba(180, 45, 218, 0.1))',
                border: '2px solid #4185DD',
                borderRadius: '25px',
                padding: '30px',
              }}
            >
              <h3 style={{ color: 'var(--primary-color)', fontSize: '20px', marginBottom: '20px' }}>
                <i className="fa-solid fa-shield-halved" style={{ color: '#4185DD', marginRight: '10px' }}></i>
                Niyə bizi seçməlisiniz?
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#B42FDA', fontSize: '20px' }}></i>
                  <span style={{ color: 'var(--text-color)' }}>Orijinal ehtiyat hissələri</span>
                </li>
                <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#B42FDA', fontSize: '20px' }}></i>
                  <span style={{ color: 'var(--text-color)' }}>12+ il təcrübə</span>
                </li>
                <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#B42FDA', fontSize: '20px' }}></i>
                  <span style={{ color: 'var(--text-color)' }}>Zəmanətli xidmət</span>
                </li>
                <li style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#B42FDA', fontSize: '20px' }}></i>
                  <span style={{ color: 'var(--text-color)' }}>Sürətli təmir</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#B42FDA', fontSize: '20px' }}></i>
                  <span style={{ color: 'var(--text-color)' }}>Ədalətli qiymətlər</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
