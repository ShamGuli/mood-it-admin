import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/bookings/[id] - Get single booking
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        category:service_categories(id, name_de, name_en, slug),
        brand:brands(id, name),
        model:models(id, name),
        service:services(id, name_de, name_en, slug, price_display, duration),
        assigned_to:users(id, full_name, email, role)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Booking fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: { message: 'Sifariş tapılmadı' } },
        { status: 404 }
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
// PATCH /api/v1/bookings/[id] - Partial update
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id } = params;

    // If status is being changed to 'confirmed', set confirmed_date
    if (body.status === 'confirmed' && !body.confirmed_date) {
      body.confirmed_date = new Date().toISOString();
    }

    // If status is being changed to 'completed', set completion_date
    if (body.status === 'completed' && !body.completion_date) {
      body.completion_date = new Date().toISOString();
    }

    // Update
    const { data, error } = await supabase
      .from('bookings')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Booking update error:', error);
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
// PUT /api/v1/bookings/[id] - Full update
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
    const bookingSchema = z.object({
      customer_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      customer_email: z.string().email('Yanlış e-poçt').optional().or(z.literal('')),
      customer_phone: z.string().min(5, 'Telefon ən azı 5 simvol olmalıdır').max(50),
      customer_whatsapp: z.string().max(50).optional().or(z.literal('')),
      category_id: z.string().uuid().optional().nullable(),
      brand_id: z.string().uuid().optional().nullable(),
      model_id: z.string().uuid().optional().nullable(),
      service_id: z.string().uuid().optional().nullable(),
      status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
      estimated_price: z.string().max(50).optional().or(z.literal('')),
      final_price: z.number().optional().nullable(),
      booking_date: z.string().optional().nullable(),
      confirmed_date: z.string().optional().nullable(),
      completion_date: z.string().optional().nullable(),
      customer_notes: z.string().optional().or(z.literal('')),
      internal_notes: z.string().optional().or(z.literal('')),
      assigned_to: z.string().uuid().optional().nullable(),
      source: z.string().max(50).optional().or(z.literal('')),
    });

    const validatedData = bookingSchema.parse(body);

    // Auto-set dates based on status
    if (validatedData.status === 'confirmed' && !validatedData.confirmed_date) {
      validatedData.confirmed_date = new Date().toISOString();
    }
    if (validatedData.status === 'completed' && !validatedData.completion_date) {
      validatedData.completion_date = new Date().toISOString();
    }

    // Update
    const { data, error } = await supabase
      .from('bookings')
      .update({
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email || null,
        customer_phone: validatedData.customer_phone,
        customer_whatsapp: validatedData.customer_whatsapp || null,
        category_id: validatedData.category_id || null,
        brand_id: validatedData.brand_id || null,
        model_id: validatedData.model_id || null,
        service_id: validatedData.service_id || null,
        status: validatedData.status,
        estimated_price: validatedData.estimated_price || null,
        final_price: validatedData.final_price || null,
        booking_date: validatedData.booking_date || null,
        confirmed_date: validatedData.confirmed_date || null,
        completion_date: validatedData.completion_date || null,
        customer_notes: validatedData.customer_notes || null,
        internal_notes: validatedData.internal_notes || null,
        assigned_to: validatedData.assigned_to || null,
        source: validatedData.source || 'website',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Booking update error:', error);
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
// DELETE /api/v1/bookings/[id] - Delete booking
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Delete
    const { error } = await supabase.from('bookings').delete().eq('id', id);

    if (error) {
      console.error('Booking delete error:', error);
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
