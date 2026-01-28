/**
 * Preisliste API Integration
 * Fetches dynamic price calculator data from backend
 */

// Global preisliste data (will be populated from API)
let preislisteData = {
    categories: [],
    brands: [],
    models: [],
    services: []
};

/**
 * Initialize preisliste data from API
 */
async function initPreislisteData() {
    try {
        const data = await fetchPreisliste();
        
        if (!data || !data.categories) {
            console.error('Invalid preisliste data received');
            return false;
        }
        
        // Transform API data to preisliste format
        preislisteData = {
            categories: transformCategories(data.categories),
            brands: transformBrands(data.brands, data.categories),
            models: transformModels(data.models, data.brands),
            services: transformServices(data.services)
        };
        
        console.log('Preisliste data loaded:', preislisteData);
        return true;
    } catch (error) {
        console.error('Error initializing preisliste data:', error);
        return false;
    }
}

/**
 * Transform categories from API format
 */
function transformCategories(categories) {
    return categories.map((cat, index) => ({
        id: cat.slug,
        name: cat.name_de,
        icon: cat.icon || `fa-solid fa-${getIconForCategory(cat.slug)}`,
        iconType: cat.icon && cat.icon.includes('/') ? 'image' : 'class',
        description: cat.description_de || '',
        badge: index === 0 ? 'Beliebt' : null
    }));
}

/**
 * Transform brands from API format
 */
function transformBrands(brands, categories) {
    const result = {};
    
    brands.forEach(brand => {
        const categorySlug = brand.category?.slug || getCategorySlugById(brand.category_id, categories);
        
        if (!result[categorySlug]) {
            result[categorySlug] = [];
        }
        
        result[categorySlug].push({
            id: brand.slug,
            name: brand.name,
            logo: brand.logo_url || null,
            popular: false // Can be enhanced with backend flag
        });
    });
    
    return result;
}

/**
 * Transform models from API format
 */
function transformModels(models, brands) {
    const result = {};
    
    models.forEach(model => {
        const brandSlug = model.brand?.slug || getBrandSlugById(model.brand_id, brands);
        
        if (!result[brandSlug]) {
            result[brandSlug] = [];
        }
        
        result[brandSlug].push({
            id: model.slug,
            name: model.name,
            year: model.release_year || null,
            image: model.image_url || null
        });
    });
    
    return result;
}

/**
 * Transform services from API format
 */
function transformServices(services) {
    const result = {};
    
    services.forEach(service => {
        const categorySlug = service.category?.slug || 'other';
        
        if (!result[categorySlug]) {
            result[categorySlug] = [];
        }
        
        result[categorySlug].push({
            id: service.slug,
            name: service.name_de,
            description: service.description_de || '',
            price: service.price_display || formatPriceRange(service.price_min, service.price_max),
            priceMin: service.price_min,
            priceMax: service.price_max,
            duration: service.duration || '1-2 Stunden',
            warranty: '12 Monate', // Default warranty
            popular: false // Can be enhanced
        });
    });
    
    return result;
}

/**
 * Helper: Get category slug by ID
 */
function getCategorySlugById(categoryId, categories) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.slug : 'other';
}

/**
 * Helper: Get brand slug by ID
 */
function getBrandSlugById(brandId, brandsObj) {
    for (const categoryKey in brandsObj) {
        const brands = brandsObj[categoryKey];
        const brand = brands.find(b => b.id === brandId);
        if (brand) return brand.id;
    }
    return 'unknown';
}

/**
 * Helper: Format price range
 */
function formatPriceRange(min, max) {
    if (!min && !max) return 'auf Anfrage';
    if (min && max && min !== max) {
        return `€${min}-${max}`;
    }
    return `ab €${min || max}`;
}

/**
 * Helper: Get icon class for category
 */
function getIconForCategory(slug) {
    const icons = {
        'smartphone': 'mobile-screen-button',
        'playstation': 'gamepad',
        'macos': 'apple',
        'notebook': 'laptop',
        'desktop': 'desktop',
        'gpu': 'microchip'
    };
    return icons[slug] || 'wrench';
}

/**
 * Get brands by category
 */
function getBrandsByCategory(categorySlug) {
    return preislisteData.brands[categorySlug] || [];
}

/**
 * Get models by brand
 */
function getModelsByBrand(brandSlug) {
    return preislisteData.models[brandSlug] || [];
}

/**
 * Get services by category and optional model
 */
function getServicesByCategory(categorySlug, modelSlug = null) {
    const services = preislisteData.services[categorySlug] || [];
    
    // If model is specified, filter services
    if (modelSlug) {
        // For now, return all services (can be enhanced with model-specific services)
        return services;
    }
    
    return services;
}

/**
 * Calculate final price with optional custom pricing logic
 */
function calculateFinalPrice(service) {
    if (service.priceMin && service.priceMax) {
        // Return average price
        return Math.round((service.priceMin + service.priceMax) / 2);
    }
    return service.priceMin || service.priceMax || 0;
}
