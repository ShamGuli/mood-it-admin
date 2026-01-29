/**
 * Generate Schema.org structured data for SEO
 */

interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  openingHours?: string;
  priceRange?: string;
}

export function generateLocalBusinessSchema(data: LocalBusinessData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.email && { email: data.email }),
    ...(data.address && { address: {
      '@type': 'PostalAddress',
      ...data.address,
    }}),
    ...(data.openingHours && { openingHours: data.openingHours }),
    ...(data.priceRange && { priceRange: data.priceRange }),
  };
}

interface ServiceData {
  name: string;
  description: string;
  url: string;
  price?: string;
  provider: {
    name: string;
    url: string;
  };
}

export function generateServiceSchema(data: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    url: data.url,
    ...(data.price && { offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'EUR',
    }}),
    provider: {
      '@type': 'LocalBusiness',
      ...data.provider,
    },
  };
}

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

export function generateOrganizationSchema(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    ...(data.contactPoint && { contactPoint: {
      '@type': 'ContactPoint',
      ...data.contactPoint,
    }}),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };
}
