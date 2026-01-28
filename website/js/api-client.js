/**
 * ============================================
 * MOOD IT - API CLIENT
 * ============================================
 * Client-side API integration for dynamic content
 * SEO-optimized with meta tags and structured data
 */

// Auto-detect API base URL (production vs local)
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/public'
  : '/api/public';

// ============================================
// API FETCH FUNCTIONS
// ============================================

/**
 * Fetch active categories
 */
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Categories fetch error:', error);
    return [];
  }
}

/**
 * Fetch services by category
 * @param {string} category - Category slug (optional)
 */
async function fetchServices(category = null) {
  try {
    const url = category 
      ? `${API_BASE}/services?category=${category}`
      : `${API_BASE}/services`;
    
    const response = await fetch(url);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Services fetch error:', error);
    return [];
  }
}

/**
 * Fetch page content
 * @param {string} page - Page slug
 */
async function fetchContent(page) {
  try {
    const response = await fetch(`${API_BASE}/content?page=${page}`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Content fetch error:', error);
    return [];
  }
}

/**
 * Fetch public settings
 */
async function fetchSettings() {
  try {
    const response = await fetch(`${API_BASE}/settings`);
    const result = await response.json();
    return result.success ? result.data : {};
  } catch (error) {
    console.error('Settings fetch error:', error);
    return {};
  }
}

/**
 * Fetch preisliste data (brands, models, services)
 */
async function fetchPreislisteData() {
  try {
    const response = await fetch(`${API_BASE}/preisliste`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Preisliste fetch error:', error);
    return null;
  }
}

/**
 * Submit contact form
 * @param {Object} formData - Form data object
 */
async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Contact form submit error:', error);
    return { success: false, error: { message: 'Göndərmə xətası' } };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get icon for service based on name
 * @param {Object} service - Service object
 */
function getServiceIcon(service) {
  const name = (service.name_de || '').toLowerCase();
  const slug = (service.slug || '').toLowerCase();
  
  // ========== SMARTPHONE ICONS ==========
  if (name.includes('display') || name.includes('bildschirm') || name.includes('screen') || slug.includes('display')) {
    return 'fa-solid fa-mobile-screen-button';
  }
  if (name.includes('akku') || name.includes('battery') || name.includes('batarya') || slug.includes('akku') || slug.includes('battery')) {
    return 'fa-solid fa-battery-full';
  }
  if (name.includes('kamera') || name.includes('camera') || slug.includes('camera')) {
    return 'fa-solid fa-camera';
  }
  if (name.includes('wasserschaden') || name.includes('water') || name.includes('su') || slug.includes('wasser') || slug.includes('water')) {
    return 'fa-solid fa-droplet';
  }
  if (name.includes('ladebuchse') || name.includes('charging port') || name.includes('şarj') || slug.includes('ladebuchse')) {
    return 'fa-solid fa-charging-station';
  }
  if (name.includes('lautsprecher') || name.includes('speaker') || slug.includes('speaker')) {
    return 'fa-solid fa-volume-high';
  }
  if (name.includes('mikrofon') || name.includes('microphone') || slug.includes('mikrofon')) {
    return 'fa-solid fa-microphone';
  }
  if (name.includes('backcover') || name.includes('rückseite') || name.includes('arka') || slug.includes('backcover')) {
    return 'fa-solid fa-mobile';
  }
  if (name.includes('homebutton') || name.includes('button') || slug.includes('button')) {
    return 'fa-regular fa-circle-dot';
  }
  if (name.includes('softwareupdate') || name.includes('software') || slug.includes('software')) {
    return 'fa-solid fa-download';
  }
  if (name.includes('datenrettung') || name.includes('data recovery') || slug.includes('daten')) {
    return 'fa-solid fa-cloud-arrow-up';
  }
  
  // ========== COMPUTER / NOTEBOOK ICONS ==========
  if (name.includes('windows') || slug.includes('windows')) {
    return 'fa-brands fa-windows';
  }
  if (name.includes('hardware') || name.includes('upgrade') || slug.includes('hardware') || slug.includes('upgrade')) {
    return 'fa-solid fa-memory';
  }
  if (name.includes('reinigung') || name.includes('cleaning') || name.includes('təmizlik') || slug.includes('reinigung')) {
    return 'fa-solid fa-broom';
  }
  if (name.includes('performance') || name.includes('tuning') || slug.includes('performance')) {
    return 'fa-solid fa-gauge-high';
  }
  if (name.includes('virenentfernung') || name.includes('virus') || slug.includes('virus')) {
    return 'fa-solid fa-shield-virus';
  }
  if (name.includes('ssd') || name.includes('hdd') || name.includes('festplatte') || slug.includes('ssd') || slug.includes('hdd')) {
    return 'fa-solid fa-hard-drive';
  }
  if (name.includes('ram') || name.includes('speicher') || slug.includes('ram')) {
    return 'fa-solid fa-memory';
  }
  if (name.includes('keyboard') || name.includes('tastatur') || slug.includes('keyboard')) {
    return 'fa-solid fa-keyboard';
  }
  if (name.includes('lüfter') || name.includes('cooling') || name.includes('fan') || slug.includes('luefter') || slug.includes('fan')) {
    return 'fa-solid fa-fan';
  }
  if (name.includes('netzteil') || name.includes('power supply') || slug.includes('netzteil')) {
    return 'fa-solid fa-plug';
  }
  if (name.includes('motherboard') || name.includes('mainboard') || slug.includes('motherboard')) {
    return 'fa-solid fa-microchip';
  }
  if (name.includes('zusammenbau') || name.includes('pc build') || slug.includes('zusammenbau')) {
    return 'fa-solid fa-screwdriver-wrench';
  }
  
  // ========== APPLE / MACOS ICONS ==========
  if (name.includes('macbook') || name.includes('imac') || name.includes('mac') || slug.includes('macbook') || slug.includes('imac') || slug.includes('macos')) {
    return 'fa-brands fa-apple';
  }
  if (name.includes('iphone') || slug.includes('iphone')) {
    return 'fa-solid fa-mobile-screen';
  }
  if (name.includes('ipad') || slug.includes('ipad')) {
    return 'fa-solid fa-tablet-screen-button';
  }
  
  // ========== GAMING ICONS ==========
  if (name.includes('ps5') || name.includes('ps4') || name.includes('playstation') || slug.includes('playstation')) {
    return 'fa-brands fa-playstation';
  }
  if (name.includes('xbox') || slug.includes('xbox')) {
    return 'fa-brands fa-xbox';
  }
  if (name.includes('nintendo') || name.includes('switch') || slug.includes('nintendo')) {
    return 'fa-solid fa-gamepad';
  }
  if (name.includes('controller') || slug.includes('controller')) {
    return 'fa-solid fa-gamepad';
  }
  if (name.includes('hdmi') || slug.includes('hdmi')) {
    return 'fa-solid fa-display';
  }
  
  // ========== GPU / GRAPHICS ICONS ==========
  if (name.includes('gpu') || name.includes('grafikkarte') || name.includes('graphics') || slug.includes('gpu')) {
    return 'fa-solid fa-microchip';
  }
  if (name.includes('reballing') || slug.includes('reballing')) {
    return 'fa-solid fa-fire';
  }
  if (name.includes('thermal paste') || name.includes('wärmeleitpaste') || slug.includes('thermal')) {
    return 'fa-solid fa-temperature-half';
  }
  
  // ========== GENERAL REPAIR ICONS ==========
  if (name.includes('diagnose') || name.includes('diagnostic') || slug.includes('diagnose')) {
    return 'fa-solid fa-stethoscope';
  }
  if (name.includes('garantie') || name.includes('warranty') || slug.includes('garantie')) {
    return 'fa-solid fa-certificate';
  }
  if (name.includes('beratung') || name.includes('consultation') || slug.includes('beratung')) {
    return 'fa-solid fa-user-tie';
  }
  
  // Default repair icon
  return 'fa-solid fa-wrench';
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render services list
 * @param {Array} services - Array of service objects
 * @param {HTMLElement} container - Container element or selector
 * @param {Object} options - Render options
 */
function renderServices(services, container, options = {}) {
  // Get container element
  const containerEl = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
    
  if (!containerEl) {
    console.error('Container not found');
    return;
  }

  if (!services || services.length === 0) {
    containerEl.innerHTML = '<div class="col-12 text-center"><p>Xidmət mövcud deyil</p></div>';
    return;
  }

  // Default options
  const {
    showPrice = true,
    showDuration = true,
    linkPrefix = '/service-',
    colClass = 'col-lg-4 col-md-6'
  } = options;

  // Render services
  const html = services.map((service, index) => {
    const delay = (index % 3) * 0.2; // Stagger animation
    const priceDisplay = service.price_display || 
                        (service.price_min && service.price_max 
                          ? `€${service.price_min}-${service.price_max}` 
                          : service.price_min ? `€${service.price_min}` : 'sorğu əsasında');
    
    // Get appropriate icon for this service
    const iconClass = service.icon || getServiceIcon(service);
    
    return `
      <div class="${colClass}">
        <div class="service-item wow fadeInUp" data-wow-delay="${delay}s">
          <div class="icon-box">
            <i class="${iconClass}" style="font-size: 50px; color: #4185DD;"></i>
          </div>
          <div class="service-item-content">
            <h3><a href="${linkPrefix}${service.category?.slug || 'all'}.html">${service.name_de}</a></h3>
            <p>${service.description_de || ''}</p>
            ${showPrice ? `<div class="service-price">${priceDisplay}</div>` : ''}
            ${showDuration ? `<div class="service-duration">${service.duration || ''}</div>` : ''}
          </div>
          <div class="service-btn">
            <a href="${linkPrefix}${service.category?.slug || 'all'}.html" class="readmore-btn">Ətraflı</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  containerEl.innerHTML = html;
}


/**
 * Update meta tags for SEO
 * @param {Object} meta - Meta data object
 */
function updateMetaTags(meta) {
  // Title
  if (meta.title) {
    document.title = meta.title;
    updateMetaTag('og:title', meta.title);
    updateMetaTag('twitter:title', meta.title);
  }

  // Description
  if (meta.description) {
    updateMetaTag('description', meta.description);
    updateMetaTag('og:description', meta.description);
    updateMetaTag('twitter:description', meta.description);
  }

  // Keywords
  if (meta.keywords) {
    updateMetaTag('keywords', meta.keywords);
  }

  // OG Image
  if (meta.image) {
    updateMetaTag('og:image', meta.image);
    updateMetaTag('twitter:image', meta.image);
  }

  // URL
  if (meta.url) {
    updateMetaTag('og:url', meta.url);
  }
}

/**
 * Update a single meta tag
 * @param {string} property - Meta property/name
 * @param {string} content - Meta content
 */
function updateMetaTag(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`) || 
            document.querySelector(`meta[name="${property}"]`);
  
  if (!tag) {
    tag = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      tag.setAttribute('property', property);
    } else {
      tag.setAttribute('name', property);
    }
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
}

/**
 * Add structured data (JSON-LD) for SEO
 * @param {Object} data - Structured data object
 */
function addStructuredData(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Mood IT API Client loaded');
  
  // Add Organization structured data
  addStructuredData({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mood IT",
    "description": "Professioneller Tech-Service in Wels, Österreich",
    "url": "https://moodit.at",
    "telephone": "+43-xxx-xxx-xxx",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Straße",
      "addressLocality": "Wels",
      "addressCountry": "AT"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "€€"
  });
});
