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
  provider: {
    name: string;
    url: string;
  };
  serviceType?: string;
  areaServed?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    priceRange?: string;
  };
}

export function generateServiceSchema(data: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    description: data.description,
    ...(data.serviceType && { serviceType: data.serviceType }),
    ...(data.areaServed && { areaServed: data.areaServed }),
    provider: {
      '@type': 'LocalBusiness',
      ...data.provider,
    },
    ...(data.offers && {
      offers: {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.priceCurrency,
        ...(data.offers.priceRange && { priceSpecification: data.offers.priceRange }),
      },
    }),
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

export function generateOrganizationSchema(data: Partial<OrganizationData>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name || 'Mood IT',
    url: data.url || 'https://moodit.at',
    ...(data.logo && { logo: data.logo }),
    ...(data.description && { description: data.description }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...data.contactPoint,
      },
    }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// Website Schema
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mood IT',
    url: 'https://moodit.at',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://moodit.at/services?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}
