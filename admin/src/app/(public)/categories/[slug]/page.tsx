import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/seo/generateMetadata';
import { createClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@supabase/supabase-js';
import PageHeader from '@/components/public/Shared/PageHeader';
import CategoryHero from '@/components/public/Categories/CategoryHero';
import CategoryServices from '@/components/public/Categories/CategoryServices';
import CategoryBrands from '@/components/public/Categories/CategoryBrands';

interface Props {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!category) {
    return genMeta({
      title: 'Kateqoriya tapılmadı',
      description: 'Axtardığınız kateqoriya mövcud deyil',
      path: `/categories/${params.slug}`,
    });
  }

  return genMeta({
    title: category.name_de,
    description: category.description_de || `${category.name_de} - Peşəkar təmir və texniki servis`,
    keywords: [category.name_de, 'təmir', 'servis', 'bakı', 'mood it'],
    path: `/categories/${params.slug}`,
  });
}

// Generate static paths for all categories
export async function generateStaticParams() {
  // Use browser client for build-time generation (no cookies needed)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: categories } = await supabase
    .from('service_categories')
    .select('slug')
    .eq('is_active', true);

  return (categories || []).map((category) => ({
    slug: category.slug,
  }));
}

// Fetch category data
async function getCategoryData(slug: string) {
  const supabase = createClient();

  // Get category
  const { data: category } = await supabase
    .from('service_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!category) {
    return null;
  }

  // Get category services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('display_order');

  // Get brands for this category
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('name');

  return {
    category,
    services: services || [],
    brands: brands || [],
  };
}

export default async function CategoryPage({ params }: Props) {
  const data = await getCategoryData(params.slug);

  if (!data) {
    notFound();
  }

  const { category, services, brands } = data;

  // Generate structured data (CollectionPage schema)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name_de,
    description: category.description_de,
    url: `https://moodit.at/categories/${category.slug}`,
    about: {
      '@type': 'Service',
      serviceType: category.name_de,
      provider: {
        '@type': 'Organization',
        name: 'Mood IT',
        url: 'https://moodit.at',
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Page Header */}
      <PageHeader
        title={category.name_de}
        breadcrumbs={[
          { label: 'Ana Səhifə', href: '/' },
          { label: 'Xidmətlər', href: '/services' },
          { label: category.name_de, href: `/categories/${category.slug}` },
        ]}
      />

      {/* Category Hero */}
      <CategoryHero category={category} servicesCount={services.length} />

      {/* Category Services */}
      <CategoryServices services={services} categoryName={category.name_de} />

      {/* Category Brands */}
      {brands.length > 0 && <CategoryBrands brands={brands} categoryName={category.name_de} />}
    </>
  );
}

// ISR - Revalidate every 5 minutes
export const revalidate = 300;
