import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// PATCH /api/v1/brands/[id] - Partial update
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id } = params;

    // Update
    const { data, error } = await supabase
      .from('brands')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Brand update error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/v1/brands/[id] - Full update
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id } = params;

    // Validation
    const brandSchema = z.object({
      category_id: z.string().uuid('Kateqoriya ID yanlışdır'),
      name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
      logo_url: z.string().url('Logo URL yanlışdır').optional().or(z.literal('')),
      display_order: z.number().int().min(1, 'Sıralama ən azı 1 olmalıdır'),
      is_active: z.boolean(),
    });

    const validatedData = brandSchema.parse(body);

    // Check slug uniqueness (excluding current brand)
    const { data: existingBrand } = await supabase
      .from('brands')
      .select('id')
      .eq('category_id', validatedData.category_id)
      .eq('slug', validatedData.slug)
      .neq('id', id)
      .single();

    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu slug artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Update
    const { data, error } = await supabase
      .from('brands')
      .update({
        category_id: validatedData.category_id,
        name: validatedData.name,
        slug: validatedData.slug,
        logo_url: validatedData.logo_url || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Brand update error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
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

// ============================================
// DELETE /api/v1/brands/[id] - Delete brand
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Check for associated models
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('id')
      .eq('brand_id', id);

    if (modelsError) {
      console.error('Models check error:', modelsError);
      return NextResponse.json(
        { success: false, error: { message: modelsError.message } },
        { status: 500 }
      );
    }

    if (models && models.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Bu markaya aid modellər var. Əvvəlcə onları silin və ya başqa markaya köçürün',
          },
        },
        { status: 400 }
      );
    }

    // Delete
    const { error } = await supabase.from('brands').delete().eq('id', id);

    if (error) {
      console.error('Brand delete error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}
