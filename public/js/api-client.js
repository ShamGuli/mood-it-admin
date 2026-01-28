/**
 * ============================================
 * MOOD IT - API CLIENT
 * ============================================
 * Client-side API integration for dynamic content
 * SEO-optimized with meta tags and structured data
 */

const API_BASE = 'http://localhost:3000/api/public';

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
// RENDER FUNCTIONS
// ============================================

/**
 * Render services list
 * @param {string} containerId - Container element ID
 * @param {string} category - Category slug (optional)
 */
async function renderServices(containerId, category = null) {
  const container = document.querySelector(containerId);
  if (!container) return;

  // Show loading
  container.innerHTML = '<div class="loading">Yüklənir...</div>';

  // Fetch services
  const services = await fetchServices(category);

  if (services.length === 0) {
    container.innerHTML = '<p class="no-data">Xidmət tapılmadı</p>';
    return;
  }

  // Render services
  const html = services.map(service => `
    <div class="service-item" data-aos="fade-up">
      <div class="service-icon">
        <i class="fa-solid fa-wrench"></i>
      </div>
      <h3>${service.name_de}</h3>
      <p>${service.description_de || ''}</p>
      <div class="service-meta">
        <span class="price">€${service.base_price.toFixed(2)}</span>
        <span class="duration">${formatDuration(service.duration_minutes)}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * Format duration from minutes
 * @param {number} minutes
 */
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
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
