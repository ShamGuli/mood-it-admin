import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/settings/[key] - Get single setting
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const supabase = await createClient();
    const { key } = params;

    const { data, error } = await supabase
      .from('settings')
      .select(`
        *,
        updated_by_user:users(id, full_name, email)
      `)
      .eq('key', key)
      .single();

    if (error) {
      console.error('Setting fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: { message: 'Parametr tapılmadı' } },
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
// PUT /api/v1/settings/[key] - Update setting
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { key } = params;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Validation
    const settingSchema = z.object({
      value: z.string().optional().or(z.literal('')),
      value_type: z.enum(['string', 'number', 'boolean', 'json']),
      description: z.string().optional().or(z.literal('')),
      is_public: z.boolean(),
    });

    const validatedData = settingSchema.parse(body);

    // Update
    const { data, error } = await supabase
      .from('settings')
      .update({
        value: validatedData.value || null,
        value_type: validatedData.value_type,
        description: validatedData.description || null,
        is_public: validatedData.is_public,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)
      .select()
      .single();

    if (error) {
      console.error('Setting update error:', error);
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
// DELETE /api/v1/settings/[key] - Delete setting
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const supabase = await createClient();
    const { key } = params;

    // Delete
    const { error } = await supabase.from('settings').delete().eq('key', key);

    if (error) {
      console.error('Setting delete error:', error);
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
