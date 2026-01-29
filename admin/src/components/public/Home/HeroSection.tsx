'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="hero hero-bg-image hero-video">
      {/* Background Video */}
      <div className="hero-bg-video">
        <video autoPlay muted loop id="myvideo">
          <source src="/images/bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            {/* Hero Content */}
            <div className="hero-content">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">
                  Texnologiya üçün etibarlı servis mərkəziniz
                </h3>
                <h1 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
                  Texnologiyanızı bizə etibar edin - <span>sürətli və peşəkar servis</span>
                </h1>
                <p className="wow fadeInUp" data-wow-delay="0.4s">
                  Noutbukunuz, PlayStation və kompüteriniz ən yaxşı servisi layiqdir. 
                  Biz müasir texnologiya ilə peşəkar dəstək təqdim edirik.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="hero-btn wow fadeInUp" data-wow-delay="0.6s">
                <Link href="/preisliste" className="btn-default btn-highlighted">
                  Pulsuz qiymətləndirmə
                </Link>
                <Link href="/services" className="btn-default">
                  Xidmətlərimizə baxın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
