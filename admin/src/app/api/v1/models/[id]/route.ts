import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// PATCH /api/v1/models/[id] - Partial update
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
      .from('models')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Model update error:', error);
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
// PUT /api/v1/models/[id] - Full update
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
    const modelSchema = z.object({
      brand_id: z.string().uuid('Marka ID yanlışdır'),
      name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
      release_year: z.number().int().min(2000).max(new Date().getFullYear() + 1).optional().nullable(),
      display_order: z.number().int().min(1, 'Sıralama ən azı 1 olmalıdır'),
      is_active: z.boolean(),
    });

    const validatedData = modelSchema.parse(body);

    // Check slug uniqueness (excluding current model)
    const { data: existingModel } = await supabase
      .from('models')
      .select('id')
      .eq('brand_id', validatedData.brand_id)
      .eq('slug', validatedData.slug)
      .neq('id', id)
      .single();

    if (existingModel) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu slug artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Update
    const { data, error } = await supabase
      .from('models')
      .update({
        brand_id: validatedData.brand_id,
        name: validatedData.name,
        slug: validatedData.slug,
        release_year: validatedData.release_year || null,
        display_order: validatedData.display_order,
        is_active: validatedData.is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Model update error:', error);
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
// DELETE /api/v1/models/[id] - Delete model
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Delete
    const { error } = await supabase.from('models').delete().eq('id', id);

    if (error) {
      console.error('Model delete error:', error);
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
