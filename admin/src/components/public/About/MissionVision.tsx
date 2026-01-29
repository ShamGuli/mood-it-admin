'use client';

import { useState } from 'react';

const accordionData = [
  {
    id: 'mission',
    title: 'Şirkət Missiyamızı Kəşf Edin',
    content: {
      text: 'Cihazlarınızın uzun ömürlü, etibarlı və yüksək performansla işləməsi üçün peşəkar texniki həllər təqdim edirik. Həm fərdi istifadəçilərin, həm də işlətmələrin fasiləsiz texnologiya təcrübəsi yaşamasını hədəfləyirik.',
      list: [
        'Etibarlı və Keyfiyyətli Texniki Servis',
        'Cihazlarınızı Ən Yaxşı Şəkildə Qoruma',
        'Texnologiyada Davamlı Yenilik və İnkişaf',
      ],
    },
    image: '/images/potential-accordion-img.jpg',
  },
  {
    id: 'vision',
    title: 'Şirkət Vizyonumuz',
    content: {
      text: 'Məqsədimiz istifadəçilərin və müəssisələrin texnologiya ilə problemsiz və etibarlı işləməsini təmin etmək; cihaz performansını artıraraq uzun ömürlü istifadə təcrübəsi təqdim etməkdir.',
      list: [
        'Texnologiya dünyasında rəhbər mövqe',
        'Müştəri məmnuniyyətində daimi liderlik',
        'İnnovasiya və keyfiyyətdə nümunə',
      ],
    },
    image: '/images/potential-accordion-img.jpg',
  },
];

export default function MissionVision() {
  const [activeId, setActiveId] = useState('mission');

  return (
    <div className="our-potential">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="our-potential-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">Cihazlarınızın performansını ən üst səviyyəyə çıxarın</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
                  İşlərinizi fasiləsiz davam etdirməyiniz üçün <span>qabaqcıl texniki servis həlləri təqdim edirik</span>
                </h2>
              </div>

              <div className="potential-accordion" id="accordion">
                {accordionData.map((item, index) => (
                  <div key={item.id} className="accordion-item wow fadeInUp" data-wow-delay={`${0.4 + index * 0.2}s`}>
                    <h2 className="accordion-header" id={`pheading${item.id}`}>
                      <button
                        className={`accordion-button ${activeId === item.id ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        aria-expanded={activeId === item.id}
                        aria-controls={`pcollapse${item.id}`}
                      >
                        {item.title}
                      </button>
                    </h2>
                    <div
                      id={`pcollapse${item.id}`}
                      className={`accordion-collapse collapse ${activeId === item.id ? 'show' : ''}`}
                      aria-labelledby={`pheading${item.id}`}
                    >
                      <div className="accordion-body">
                        <div className="accordion-image">
                          <figure>
                            <img src={item.image} alt={item.title} />
                          </figure>
                        </div>
                        <div className="accordion-item-content">
                          <p>{item.content.text}</p>
                          <ul>
                            {item.content.list.map((listItem, idx) => (
                              <li key={idx}>{listItem}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="our-potential-image">
              <figure className="image-anime reveal">
                <img src="/images/our-potential-img.jpg" alt="Potensialımız" />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
