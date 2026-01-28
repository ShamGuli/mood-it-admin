import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/content - List all content pages
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Params
    const page_slug = searchParams.get('page_slug');
    const search = searchParams.get('search');

    // Query
    let query = supabase
      .from('content_pages')
      .select(`
        *,
        updated_by_user:users(id, full_name, email)
      `, { count: 'exact' });

    // Filters
    if (page_slug) {
      query = query.eq('page_slug', page_slug);
    }

    if (search && search.trim()) {
      query = query.or(`page_slug.ilike.%${search.trim()}%,section_key.ilike.%${search.trim()}%,content_de.ilike.%${search.trim()}%,content_en.ilike.%${search.trim()}%`);
    }

    // Order by updated_at DESC
    query = query.order('updated_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Content fetch error:', error);
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
// POST /api/v1/content - Create new content
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
    const contentSchema = z.object({
      page_slug: z.string().min(1, 'Səhifə slug-u mütləqdir').max(100),
      section_key: z.string().min(1, 'Bölmə açarı mütləqdir').max(100),
      content_de: z.string().optional().or(z.literal('')),
      content_en: z.string().optional().or(z.literal('')),
      content_type: z.enum(['text', 'html', 'json', 'markdown']).default('html'),
      media_url: z.string().url('Media URL yanlışdır').optional().or(z.literal('')),
      metadata: z.record(z.any()).optional(),
    });

    const validatedData = contentSchema.parse(body);

    // Check uniqueness (page_slug + section_key)
    const { data: existing } = await supabase
      .from('content_pages')
      .select('id')
      .eq('page_slug', validatedData.page_slug)
      .eq('section_key', validatedData.section_key)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu səhifə və bölmə artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Insert
    const { data, error } = await supabase
      .from('content_pages')
      .insert([{
        page_slug: validatedData.page_slug,
        section_key: validatedData.section_key,
        content_de: validatedData.content_de || null,
        content_en: validatedData.content_en || null,
        content_type: validatedData.content_type,
        media_url: validatedData.media_url || null,
        metadata: validatedData.metadata || {},
        updated_by: user.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Content insert error:', error);
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
