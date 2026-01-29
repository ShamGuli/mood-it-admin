'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Settings {
  contact_phone?: string;
  contact_email?: string;
  address_street?: string;
  address_city?: string;
  address_zip?: string;
  address_country?: string;
  social_facebook?: string;
  social_instagram?: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch settings from API
    fetch('/api/public/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load footer settings:', error);
        setLoading(false);
      });
  }, []);

  const fullAddress = settings.address_street && settings.address_city
    ? `${settings.address_street}, ${settings.address_city}${settings.address_zip ? ' ' + settings.address_zip : ''}, ${settings.address_country || 'Azerbaijan'}`
    : 'Yüklənir...';

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-about">
              <Link href="/" className="footer-logo">
                <img src="/images/logo.png" alt="Mood IT Logo" />
              </Link>
              <p>
                Smartfonlar, noutbuklar, PlayStation və daha çoxu üçün peşəkar təmir xidmətləri.
                Bakıda etibarlı və sürətli servis.
              </p>
              {/* Social Media */}
              <div className="footer-social">
                {settings.social_facebook && (
                  <a
                    href={settings.social_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {settings.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <div className="footer-links">
              <h3>Keçidlər</h3>
              <ul>
                <li><Link href="/">Ana Səhifə</Link></li>
                <li><Link href="/about">Haqqımızda</Link></li>
                <li><Link href="/services">Xidmətlər</Link></li>
                <li><Link href="/preisliste">Qiymət Kalkulyatoru</Link></li>
                <li><Link href="/contact">Əlaqə</Link></li>
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-links">
              <h3>Xidmətlər</h3>
              <ul>
                <li><Link href="/categories/smartphone">Smartfon Təmiri</Link></li>
                <li><Link href="/categories/playstation">PlayStation Servisi</Link></li>
                <li><Link href="/categories/macos">macOS Servisi</Link></li>
                <li><Link href="/categories/notebook">Noutbuk Təmiri</Link></li>
                <li><Link href="/categories/gpu">GPU & Xbox</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <div className="footer-links">
              <h3>Əlaqə</h3>
              <div className="footer-contact">
                {/* Address */}
                <div className="footer-contact-item">
                  <div className="icon-box">
                    <img src="/images/icon-location.svg" alt="Location" />
                  </div>
                  <div className="footer-contact-content">
                    <p>{loading ? 'Yüklənir...' : fullAddress}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="footer-contact-item">
                  <div className="icon-box">
                    <img src="/images/icon-phone.svg" alt="Phone" />
                  </div>
                  <div className="footer-contact-content">
                    <p>
                      {loading ? (
                        'Yüklənir...'
                      ) : (
                        <a href={`tel:${settings.contact_phone}`}>
                          {settings.contact_phone || '+994 50 555 55 55'}
                        </a>
                      )}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="footer-contact-item">
                  <div className="icon-box">
                    <img src="/images/icon-mail.svg" alt="Email" />
                  </div>
                  <div className="footer-contact-content">
                    <p>
                      {loading ? (
                        'Yüklənir...'
                      ) : (
                        <a href={`mailto:${settings.contact_email}`}>
                          {settings.contact_email || 'info@moodit.at'}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-lg-12">
            <div className="footer-copyright-text">
              <p>Copyright © {new Date().getFullYear()} Mood IT. Bütün hüquqlar qorunur.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
