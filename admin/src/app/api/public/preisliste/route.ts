import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// GET /api/public/preisliste - Get brands, models, and services for price calculator (PUBLIC)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('service_categories')
      .select('id, name_de, name_en, slug')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (categoriesError) throw categoriesError;

    // Fetch brands with their categories
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select(`
        id,
        name,
        slug,
        category_id,
        display_order,
        service_categories!inner(
          id,
          name_de,
          slug
        )
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (brandsError) throw brandsError;

    // Fetch models with their brands
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select(`
        id,
        name,
        slug,
        brand_id,
        release_year,
        display_order,
        brands!inner(
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (modelsError) throw modelsError;

    // Fetch services with prices
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        id,
        name_de,
        name_en,
        slug,
        price_min,
        price_max,
        price_display,
        duration,
        category_id,
        service_categories!inner(
          id,
          name_de,
          slug
        )
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (servicesError) throw servicesError;

    // Format response (rename nested relations)
    const formattedBrands = brands?.map(b => ({
      ...b,
      category: b.service_categories,
    })) || [];

    const formattedModels = models?.map(m => ({
      ...m,
      brand: m.brands,
    })) || [];

    const formattedServices = services?.map(s => ({
      ...s,
      category: s.service_categories,
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        categories: categories || [],
        brands: formattedBrands,
        models: formattedModels,
        services: formattedServices,
      },
    });
  } catch (error) {
    console.error('Public preisliste error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Qiymət məlumatları yüklənə bilmədi' } },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
