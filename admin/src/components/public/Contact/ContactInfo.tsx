import Link from 'next/link';

interface Props {
  settings: Record<string, string>;
}

export default function ContactInfo({ settings }: Props) {
  const fullAddress =
    settings.address_street && settings.address_city
      ? `${settings.address_street}, ${settings.address_city}${
          settings.address_zip ? ' ' + settings.address_zip : ''
        }, ${settings.address_country || 'Azerbaijan'}`
      : 'Ünvan yüklənir...';

  return (
    <div className="contact-us-content wow fadeInUp" data-wow-delay="0.75s">
      <div className="section-title">
        <h3>Əlaqə məlumatları</h3>
        <p>Həmçinin aşağıdakı kanallar vasitəsilə də bizimlə əlaqə saxlaya bilərsiniz</p>
      </div>

      {/* Address */}
      <div className="contact-info-item">
        <div className="icon-box">
          <img src="/images/icon-location.svg" alt="Ünvan" />
        </div>
        <div className="contact-item-content">
          <p>Ünvan</p>
          <h3>{fullAddress}</h3>
        </div>
      </div>

      {/* Phone */}
      <div className="contact-info-item">
        <div className="icon-box">
          <img src="/images/icon-phone.svg" alt="Telefon" />
        </div>
        <div className="contact-item-content">
          <p>Telefon</p>
          <h3>
            <a href={`tel:${settings.contact_phone}`}>
              {settings.contact_phone || '+994 50 555 55 55'}
            </a>
          </h3>
        </div>
      </div>

      {/* Email */}
      <div className="contact-info-item">
        <div className="icon-box">
          <img src="/images/icon-mail.svg" alt="E-mail" />
        </div>
        <div className="contact-item-content">
          <p>E-mail</p>
          <h3>
            <a href={`mailto:${settings.contact_email}`}>
              {settings.contact_email || 'info@moodit.at'}
            </a>
          </h3>
        </div>
      </div>

      {/* Business Hours */}
      <div className="contact-info-item">
        <div className="icon-box">
          <img src="/images/icon-specialties-item-1.svg" alt="İş saatları" />
        </div>
        <div className="contact-item-content">
          <p>İş saatları</p>
          <h3>{settings.business_hours || 'B.e - Cümə: 09:00 - 18:00'}</h3>
        </div>
      </div>

      {/* WhatsApp Button */}
      {settings.contact_whatsapp && (
        <div className="contact-whatsapp">
          <Link
            href={`https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-default btn-whatsapp"
          >
            <i className="fab fa-whatsapp"></i> WhatsApp ilə yaz
          </Link>
        </div>
      )}
    </div>
  );
}
