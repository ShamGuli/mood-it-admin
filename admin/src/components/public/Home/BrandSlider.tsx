'use client';

const brands = [
  { name: 'Apple', logo: '/images/company-logo-1.png' },
  { name: 'Samsung', logo: '/images/company-logo-2.png' },
  { name: 'Sony', logo: '/images/company-logo-3.png' },
  { name: 'Microsoft', logo: '/images/company-logo-4.png' },
];

export default function BrandSlider() {
  return (
    <div className="hero-company-slider">
      <p>Bu brendlərlə işləyirik</p>

      <div className="swiper">
        <div className="swiper-wrapper">
          {brands.map((brand, index) => (
            <div key={index} className="swiper-slide">
              <div className="company-logo">
                <img src={brand.logo} alt={brand.name} />
              </div>
            </div>
          ))}
          {/* Duplicate for smooth scroll */}
          {brands.map((brand, index) => (
            <div key={`dup-${index}`} className="swiper-slide">
              <div className="company-logo">
                <img src={brand.logo} alt={brand.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
