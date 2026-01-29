import Link from 'next/link';

interface Service {
  id: string;
  name_de: string;
  slug: string;
  description_de?: string;
  icon?: string;
  price_min?: number;
  price_max?: number;
  category?: {
    name_de: string;
    slug: string;
  };
}

interface Props {
  services: Service[];
}

export default function ServiceGrid({ services }: Props) {
  return (
    <div className="row">
      {services.map((service, index) => (
        <div key={service.id} className="col-lg-4 col-md-6">
          <div className="service-item wow fadeInUp" data-wow-delay={`${index * 0.1}s`}>
            {/* Icon */}
            {service.icon && (
              <div className="service-icon">
                <i className={service.icon}></i>
              </div>
            )}

            {/* Content */}
            <div className="service-content">
              <h3>
                <Link href={`/services/${service.slug}`}>{service.name_de}</Link>
              </h3>
              <p>{service.description_de}</p>
            </div>

            {/* Price */}
            {service.price_min && service.price_max && (
              <div className="service-price">
                <span>
                  €{service.price_min} - €{service.price_max}
                </span>
              </div>
            )}

            {/* Category Badge */}
            {service.category && (
              <div className="service-category">
                <span className="badge">{service.category.name_de}</span>
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
  );
}
