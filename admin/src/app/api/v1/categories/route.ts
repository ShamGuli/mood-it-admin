import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// GET /api/v1/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Admin panel görmək üçün bütün kateqoriyalar (aktiv və ya qeyri-aktiv)
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get('include_inactive') === 'true';
    
    let query = supabase
      .from('service_categories')
      .select('*', { count: 'exact' });
    
    // Public API üçün yalnız aktiv
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    query = query.order('display_order', { ascending: true });
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        items: data,
        pagination: {
          total: count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST /api/v1/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const categorySchema = z.object({
      name_de: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(100),
      name_en: z.string().max(100).optional().nullable(),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
      icon: z.string().min(1, 'İkon mütləqdir'),
      description_de: z.string().optional().nullable(),
      description_en: z.string().optional().nullable(),
      badge: z.string().max(50).optional().nullable(),
      display_order: z.number().int().min(1, 'Sıralama ən azı 1 olmalıdır'),
      is_active: z.boolean().optional(),
    });

    const validatedData = categorySchema.parse(body);

    // Check slug uniqueness
    const { data: existingCategory } = await supabase
      .from('service_categories')
      .select('id')
      .eq('slug', validatedData.slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Bu slug artıq istifadə olunur' },
        },
        { status: 400 }
      );
    }

    // display_order artıq required və validation-da təmin olunub
    const display_order = validatedData.display_order;

    // Insert
    const { data, error } = await supabase
      .from('service_categories')
      .insert({
        ...validatedData,
        display_order,
        is_active: validatedData.is_active ?? true,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        {
          success: false,
          error: { message: error.message },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kateqoriya uğurla yaradıldı',
      data,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Yoxlama xətası', details: error.errors },
        },
        { status: 400 }
      );
    }

    console.error('POST /api/v1/categories error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}
