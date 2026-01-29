import Link from 'next/link';

export default function CTASection() {
  return (
    <div className="cta-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="cta-content">
              <h2 className="wow fadeInUp">
                Cihazınızı təmir etdirmək istəyirsiniz?
              </h2>
              <p className="wow fadeInUp" data-wow-delay="0.2s">
                Pulsuz qiymətləndirmə alın və ya bizimlə əlaqə saxlayın. 
                Komandamız sizə kömək etməyə hazırdır!
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="cta-btn wow fadeInUp" data-wow-delay="0.4s">
              <Link href="/contact" className="btn-default btn-highlighted">
                Bizimlə əlaqə
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
