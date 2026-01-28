import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/users/[id] - Get single user
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('User fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: { message: 'İstifadəçi tapılmadı' } },
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
// PATCH /api/v1/users/[id] - Partial update (e.g., toggle active)
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
      .from('users')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('User update error:', error);
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
// PUT /api/v1/users/[id] - Full update
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
    const userSchema = z.object({
      full_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      role: z.enum(['admin', 'technician']),
      phone: z.string().max(50).optional().or(z.literal('')),
      is_active: z.boolean(),
    });

    const validatedData = userSchema.parse(body);

    // Update in our users table
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: validatedData.full_name,
        role: validatedData.role,
        phone: validatedData.phone || null,
        is_active: validatedData.is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('User update error:', error);
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
// DELETE /api/v1/users/[id] - Delete user
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Get current user to prevent self-deletion
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser?.id === id) {
      return NextResponse.json(
        { success: false, error: { message: 'Özünüzü silə bilməzsiniz' } },
        { status: 400 }
      );
    }

    // 1. Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      console.error('Auth user delete error:', authError);
      return NextResponse.json(
        { success: false, error: { message: authError.message } },
        { status: 500 }
      );
    }

    // 2. Delete from our users table (should cascade automatically)
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      console.error('User delete error:', error);
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
