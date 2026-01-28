import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/users - List users (admins/technicians)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Params
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const include_inactive = searchParams.get('include_inactive') === 'true';

    // Query
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Filters
    if (role) {
      query = query.eq('role', role);
    }

    if (search && search.trim()) {
      query = query.or(`full_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`);
    }

    if (!include_inactive) {
      query = query.eq('is_active', true);
    }

    // Order
    query = query.order('full_name', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      console.error('Users fetch error:', error);
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
// POST /api/v1/users - Create new user
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validation
    const userSchema = z.object({
      email: z.string().email('Yanlış e-poçt ünvanı'),
      password: z.string().min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
      full_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
      role: z.enum(['admin', 'technician']),
      phone: z.string().max(50).optional().or(z.literal('')),
      is_active: z.boolean().default(true),
    });

    const validatedData = userSchema.parse(body);

    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError || !authUser.user) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json(
        { success: false, error: { message: authError?.message || 'İstifadəçi yaratma xətası' } },
        { status: 500 }
      );
    }

    // 2. Insert into our users table
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: authUser.user.id,
        email: validatedData.email,
        password_hash: 'managed_by_supabase_auth', // Placeholder
        full_name: validatedData.full_name,
        role: validatedData.role,
        phone: validatedData.phone || null,
        is_active: validatedData.is_active,
      }])
      .select()
      .single();

    if (error) {
      console.error('User insert error:', error);
      // Rollback: Delete auth user
      await supabase.auth.admin.deleteUser(authUser.user.id);
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
