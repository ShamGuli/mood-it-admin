import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/brands - List all brands
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Params
    const category_id = searchParams.get('category_id');
    const search = searchParams.get('search');
    const include_inactive = searchParams.get('include_inactive') === 'true';

    // Query
    let query = supabase
      .from('brands')
      .select(`
        *,
        category:service_categories(id, name_de, name_en, slug)
      `, { count: 'exact' });

    // Filters
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (search && search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    if (!include_inactive) {
      query = query.eq('is_active', true);
    }

    // Order
    query = query.order('display_order', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      console.error('Brands fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total: count || 0,
      },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/v1/brands - Create new brand
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validation
    const brandSchema = z.object({
      category_id: z.string().uuid('Kateqoriya ID yanlışdır'),
      name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
      logo_url: z.string().url('Logo URL yanlışdır').optional().or(z.literal('')),
      display_order: z.number().int().min(1, 'Sıralama ən azı 1 olmalıdır'),
      is_active: z.boolean().default(true),
    });

    const validatedData = brandSchema.parse(body);

    // Check slug uniqueness within category
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('id')
      .eq('category_id', validatedData.category_id)
      .eq('slug', validatedData.slug)
      .single();

    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu slug artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Insert
    const { data, error } = await supabase
      .from('brands')
      .insert([{
        category_id: validatedData.category_id,
        name: validatedData.name,
        slug: validatedData.slug,
        logo_url: validatedData.logo_url || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      }])
      .select()
      .single();

    if (error) {
      console.error('Brand insert error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { message: error.errors[0].message } },
        { status: 400 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}
