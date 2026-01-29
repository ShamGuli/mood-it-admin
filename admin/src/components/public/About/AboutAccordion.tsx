'use client';

import { useState } from 'react';

const faqData = [
  {
    id: 'quality',
    question: 'Niyə Keyfiyyət Bizim Üçün Vacibdir?',
    answer: 'Hər bir cihazın təmiri zamanı ən yüksək keyfiyyət standartlarına riayət edirik. Orijinal ehtiyat hissələri və müasir avadanlıqlardan istifadə edərək, cihazlarınızın uzun müddət problemsiz işləməsini təmin edirik.',
  },
  {
    id: 'experience',
    question: 'Təcrübəmiz və Ekspertizamız',
    answer: '12+ il təcrübəyə malik komandamız smartfon, noutbuk, PlayStation və digər cihazların təmirində yüksək səviyyəli xidmət təqdim edir. Hər bir layihəyə peşəkar yanaşma və diqqətlə yanaşırıq.',
  },
  {
    id: 'support',
    question: 'Müştəri Dəstəyi və Zəmanət',
    answer: 'Təmir edilmiş cihazlar üçün zəmanət təqdim edir və 24/7 texniki dəstək ilə müştərilərimizin yanındayıq. Məmnuniyyətiniz bizim prioritetimizdir.',
  },
];

export default function AboutAccordion() {
  const [activeId, setActiveId] = useState('quality');

  return (
    <div className="our-faqs">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title section-title-center">
              <h3 className="wow fadeInUp">Tez-tez verilən suallar</h3>
              <h2 className="wow fadeInUp" data-wow-delay="0.2s">
                Bizim haqqımızda <span>daha çox məlumat</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="faq-accordion" id="faqAccordion">
              {faqData.map((item, index) => (
                <div key={item.id} className="accordion-item wow fadeInUp" data-wow-delay={`${index * 0.2}s`}>
                  <h2 className="accordion-header" id={`heading${item.id}`}>
                    <button
                      className={`accordion-button ${activeId === item.id ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-expanded={activeId === item.id}
                      aria-controls={`collapse${item.id}`}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${item.id}`}
                    className={`accordion-collapse collapse ${activeId === item.id ? 'show' : ''}`}
                    aria-labelledby={`heading${item.id}`}
                  >
                    <div className="accordion-body">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
