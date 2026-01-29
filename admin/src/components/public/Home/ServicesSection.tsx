import Link from 'next/link';

interface Service {
  id: string;
  name_de: string;
  name_en: string;
  slug: string;
  description_de?: string;
  description_en?: string;
  price_display?: string;
  icon?: string;
  category?: {
    name_de: string;
    slug: string;
  };
}

interface Props {
  services: Service[];
}

export default function ServicesSection({ services }: Props) {
  // Show first 6 services
  const featuredServices = services.slice(0, 6);

  return (
    <div className="our-services">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title section-title-center">
              <h3 className="wow fadeInUp">Xidmətlərimiz</h3>
              <h2 className="wow fadeInUp" data-wow-delay="0.2s">
                Peşəkar təmir və <span>texniki dəstək</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          {featuredServices.map((service, index) => (
            <div key={service.id} className="col-lg-4 col-md-6">
              <div className="service-item wow fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                {/* Icon */}
                <div className="service-icon">
                  {service.icon && <i className={service.icon}></i>}
                </div>

                {/* Content */}
                <div className="service-content">
                  <h3>
                    <Link href={`/services/${service.slug}`}>
                      {service.name_de}
                    </Link>
                  </h3>
                  <p>{service.description_de}</p>
                </div>

                {/* Price */}
                {service.price_display && (
                  <div className="service-price">
                    <span>{service.price_display}</span>
                  </div>
                )}

                {/* Link */}
                <Link href={`/services/${service.slug}`} className="readmore-btn">
                  Ətraflı
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="row">
          <div className="col-lg-12">
            <div className="services-btn wow fadeInUp">
              <Link href="/services" className="btn-default">
                Bütün xidmətlər
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
