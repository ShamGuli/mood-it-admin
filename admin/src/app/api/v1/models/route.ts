import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/models - List all models
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Params
    const brand_id = searchParams.get('brand_id');
    const search = searchParams.get('search');
    const include_inactive = searchParams.get('include_inactive') === 'true';

    // Query
    let query = supabase
      .from('models')
      .select(`
        *,
        brand:brands(
          id,
          name,
          slug,
          category:service_categories(id, name_de, name_en, slug)
        )
      `, { count: 'exact' });

    // Filters
    if (brand_id) {
      query = query.eq('brand_id', brand_id);
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
      console.error('Models fetch error:', error);
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
// POST /api/v1/models - Create new model
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validation
    const modelSchema = z.object({
      brand_id: z.string().uuid('Marka ID yanlışdır'),
      name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
      release_year: z.number().int().min(2000).max(new Date().getFullYear() + 1).optional().nullable(),
      display_order: z.number().int().min(1, 'Sıralama ən azı 1 olmalıdır'),
      is_active: z.boolean().default(true),
    });

    const validatedData = modelSchema.parse(body);

    // Check slug uniqueness within brand
    const { data: existingModel } = await supabase
      .from('models')
      .select('id')
      .eq('brand_id', validatedData.brand_id)
      .eq('slug', validatedData.slug)
      .single();

    if (existingModel) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu slug artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Insert
    const { data, error } = await supabase
      .from('models')
      .insert([{
        brand_id: validatedData.brand_id,
        name: validatedData.name,
        slug: validatedData.slug,
        release_year: validatedData.release_year || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      }])
      .select()
      .single();

    if (error) {
      console.error('Model insert error:', error);
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
