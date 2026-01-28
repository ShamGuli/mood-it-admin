import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// GET /api/public/services - Get active services (PUBLIC)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const supabase = await createClient();

    let query = supabase
      .from('services')
      .select(`
        *,
        category:service_categories(
          id,
          name_de,
          name_en,
          slug
        )
      `)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    // Filter by category if provided
    if (category) {
      // First get category ID
      const { data: categoryData } = await supabase
        .from('service_categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Public services fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: 'Xidmətlər yüklənə bilmədi' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Public services error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}

// Enable CORS for public API
export const dynamic = 'force-dynamic';
export const revalidate = 0;
