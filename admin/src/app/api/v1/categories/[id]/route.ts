import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// PATCH /api/v1/categories/[id] - Partial update
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Heç bir yeniləmə sahəsi təqdim edilməyib' },
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('service_categories')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
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
      message: 'Kateqoriya uğurla yeniləndi',
      data,
    });
  } catch (error) {
    console.error('PATCH /api/v1/categories/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}

// PUT /api/v1/categories/[id] - Full update
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    const categorySchema = z.object({
      name_de: z.string().min(2).max(100),
      name_en: z.string().max(100).optional().nullable(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      icon: z.string().min(1),
      description_de: z.string().optional().nullable(),
      description_en: z.string().optional().nullable(),
      badge: z.string().max(50).optional().nullable(),
      display_order: z.number().int().min(0),
      is_active: z.boolean(),
    });

    const validatedData = categorySchema.parse(body);

    // Check slug uniqueness
    const { data: existingCategory } = await supabase
      .from('service_categories')
      .select('id')
      .eq('slug', validatedData.slug)
      .neq('id', id)
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

    const { data, error } = await supabase
      .from('service_categories')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
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
      message: 'Kateqoriya uğurla yeniləndi',
      data,
    });
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

    console.error('PUT /api/v1/categories/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Check if category exists
    const { data: existingCategory, error: fetchError } = await supabase
      .from('service_categories')
      .select('id, name_de')
      .eq('id', id)
      .single();

    if (fetchError || !existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Kateqoriya tapılmadı' },
        },
        { status: 404 }
      );
    }

    // Check if category has services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (servicesError) {
      console.error('Check services error:', servicesError);
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Xidmətləri yoxlama zamanı xəta' },
        },
        { status: 500 }
      );
    }

    if (services && services.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: { 
            message: 'Bu kateqoriyaya aid xidmətlər var. Əvvəlcə onları silin və ya başqa kateqoriyaya köçürün' 
          },
        },
        { status: 400 }
      );
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return NextResponse.json(
        {
          success: false,
          error: { message: deleteError.message },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `"${existingCategory.name_de}" kateqoriyası uğurla silindi`,
    });
  } catch (error) {
    console.error('DELETE /api/v1/categories/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}
