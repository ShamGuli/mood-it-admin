import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <div className="about-us">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="about-image-box">
              <div className="about-image">
                <Image
                  src="/images/about-img.jpg"
                  alt="Haqqımızda"
                  width={600}
                  height={400}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="about-content">
              <div className="section-title">
                <h3 className="wow fadeInUp">Haqqımızda</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s">
                  Texnologiya təmiri üzrə <span>mütəxəssislər</span>
                </h2>
              </div>

              <p className="wow fadeInUp" data-wow-delay="0.4s">
                Biz smartfonlar, MacBook-lar, noutbuklar, PlayStation konsolları və daha çoxunun 
                təmirində ixtisaslaşmışıq. Komandamız təcrübəli texniklər və mütəxəssislərdən ibarətdir.
              </p>

              <p className="wow fadeInUp" data-wow-delay="0.5s">
                Müasir avadanlıq və orijinal ehtiyat hissələri ilə işləyərək, 
                cihazlarınızın ən yüksək keyfiyyətdə təmir olunmasını təmin edirik.
              </p>

              <div className="about-btn wow fadeInUp" data-wow-delay="0.6s">
                <Link href="/about" className="btn-default">
                  Daha ətraflı
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
