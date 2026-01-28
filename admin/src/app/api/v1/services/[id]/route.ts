import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// PATCH /api/v1/services/[id] - Update service (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    // Validate that at least one field is provided
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Heç bir yeniləmə sahəsi təqdim edilməyib' },
        },
        { status: 400 }
      );
    }

    // Update service
    const { data, error } = await supabase
      .from('services')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        category:service_categories(id, name_de, slug)
      `)
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
      message: 'Xidmət uğurla yeniləndi',
      data,
    });
  } catch (error) {
    console.error('PATCH /api/v1/services/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}

// PUT /api/v1/services/[id] - Full update service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;
    const body = await request.json();

    // Validation schema (same as POST)
    const serviceSchema = z.object({
      category_id: z.string().uuid(),
      name_de: z.string().min(3).max(255),
      name_en: z.string().max(255).optional().nullable(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      description_de: z.string().optional().nullable(),
      description_en: z.string().optional().nullable(),
      icon: z.string().min(1),
      duration: z.string().optional().nullable(),
      price_min: z.number().min(0).optional().nullable(),
      price_max: z.number().min(0).optional().nullable(),
      price_display: z.string().optional().nullable(),
      is_active: z.boolean(),
    });

    const validatedData = serviceSchema.parse(body);

    // Check if slug is unique (excluding current service)
    const { data: existingService } = await supabase
      .from('services')
      .select('id')
      .eq('slug', validatedData.slug)
      .neq('id', id)
      .single();

    if (existingService) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Bu slug artıq istifadə olunur' },
        },
        { status: 400 }
      );
    }

    // Update service
    const { data, error } = await supabase
      .from('services')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        category:service_categories(id, name_de, slug)
      `)
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
      message: 'Xidmət uğurla yeniləndi',
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

    console.error('PUT /api/v1/services/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/services/[id] - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { id } = params;

    // Check if service exists
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('id, name_de')
      .eq('id', id)
      .single();

    if (fetchError || !existingService) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Xidmət tapılmadı' },
        },
        { status: 404 }
      );
    }

    // Delete service
    const { error: deleteError } = await supabase
      .from('services')
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
      message: `"${existingService.name_de}" xidməti uğurla silindi`,
    });
  } catch (error) {
    console.error('DELETE /api/v1/services/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Daxili server xətası' },
      },
      { status: 500 }
    );
  }
}
