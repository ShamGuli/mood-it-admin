import Image from 'next/image';

export default function AboutHero() {
  return (
    <div className="about-us">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-12">
            <div className="section-title section-title-center">
              <h3 className="wow fadeInUp">Haqqımızda</h3>
              <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">
                Fərdi və <span>keyfiyyətli xidmətlər.</span> Hər müştəri bizim üçün xüsusi yanaşmadır.
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <div className="about-counter-box">
              <h2>
                <span className="counter">12</span>+
              </h2>
              <p>İl peşəkar təcrübə</p>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="about-us-content">
              {/* Mission & Vision List */}
              <div className="about-us-list">
                <div className="about-list-item wow fadeInUp">
                  <Image src="/images/icon-about-item-1.svg" alt="Missiyamız" width={64} height={64} />
                  <h3>Missiyamız</h3>
                  <p>Müştərilərimizə etibarlı və keyfiyyətli texniki servis təqdim etmək</p>
                </div>

                <div className="about-list-item wow fadeInUp" data-wow-delay="0.2s">
                  <Image src="/images/icon-about-item-2.svg" alt="Vizyonumuz" width={64} height={64} />
                  <h3>Vizyonumuz</h3>
                  <p>Cihazların etibarlılığı və mükəmməlliyi üçün ilk seçim olmaq</p>
                </div>
              </div>

              {/* About Body */}
              <div className="about-us-body wow fadeInUp" data-wow-delay="0.4s">
                <p>
                  Biz müasir texnologiya dünyasında müştərilərimizə ən yüksək keyfiyyətli texniki 
                  xidmət təqdim edən peşəkar komandayıq. Noutbuk təmiri, PlayStation servisi və 
                  kompüter xidmətində geniş təcrübəyə malikik. Məqsədimiz cihazlarınızın problemsiz, 
                  sürətli və etibarlı işləməsini təmin etməkdir.
                </p>
                <p>
                  Bizimlə sürətli xidmət, ədalətli qiymətlər və peşəkar texniki dəstək əldə edəcəksiniz. 
                  Müştəri məmnuniyyəti bizim üçün ən vacibdir. Texnologiyanızla bağlı problemləriniz 
                  varsa, biz həmişə sizin üçün buradayıq.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
