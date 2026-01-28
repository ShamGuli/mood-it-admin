import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/settings - List all settings
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Params
    const search = searchParams.get('search');
    const is_public = searchParams.get('is_public');

    // Query
    let query = supabase
      .from('settings')
      .select(`
        *,
        updated_by_user:users(id, full_name, email)
      `, { count: 'exact' });

    // Filters
    if (search && search.trim()) {
      query = query.or(`key.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%,value.ilike.%${search.trim()}%`);
    }

    if (is_public !== null && is_public !== undefined) {
      query = query.eq('is_public', is_public === 'true');
    }

    // Order by key
    query = query.order('key', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      console.error('Settings fetch error:', error);
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
// POST /api/v1/settings - Create new setting
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

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
      key: z.string().min(1, 'Açar mütləqdir').max(100).regex(/^[a-z0-9_]+$/, 'Açar yalnız kiçik hərflər, rəqəmlər və alt xətt ola bilər'),
      value: z.string().optional().or(z.literal('')),
      value_type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
      description: z.string().optional().or(z.literal('')),
      is_public: z.boolean().default(false),
    });

    const validatedData = settingSchema.parse(body);

    // Check if key already exists
    const { data: existing } = await supabase
      .from('settings')
      .select('key')
      .eq('key', validatedData.key)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu açar artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Insert
    const { data, error } = await supabase
      .from('settings')
      .insert([{
        key: validatedData.key,
        value: validatedData.value || null,
        value_type: validatedData.value_type,
        description: validatedData.description || null,
        is_public: validatedData.is_public,
        updated_by: user.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Setting insert error:', error);
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
