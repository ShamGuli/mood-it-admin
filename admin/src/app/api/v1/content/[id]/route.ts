import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// GET /api/v1/content/[id] - Get single content
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('content_pages')
      .select(`
        *,
        updated_by_user:users(id, full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Content fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: { message: 'Məzmun tapılmadı' } },
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
// PUT /api/v1/content/[id] - Update content
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id } = params;

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
      content_type: z.enum(['text', 'html', 'json', 'markdown']),
      media_url: z.string().url('Media URL yanlışdır').optional().or(z.literal('')),
      metadata: z.record(z.any()).optional(),
    });

    const validatedData = contentSchema.parse(body);

    // Check uniqueness (excluding current record)
    const { data: existing } = await supabase
      .from('content_pages')
      .select('id')
      .eq('page_slug', validatedData.page_slug)
      .eq('section_key', validatedData.section_key)
      .neq('id', id)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: 'Bu səhifə və bölmə artıq mövcuddur' } },
        { status: 400 }
      );
    }

    // Update
    const { data, error } = await supabase
      .from('content_pages')
      .update({
        page_slug: validatedData.page_slug,
        section_key: validatedData.section_key,
        content_de: validatedData.content_de || null,
        content_en: validatedData.content_en || null,
        content_type: validatedData.content_type,
        media_url: validatedData.media_url || null,
        metadata: validatedData.metadata || {},
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Content update error:', error);
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
// DELETE /api/v1/content/[id] - Delete content
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Delete
    const { error } = await supabase.from('content_pages').delete().eq('id', id);

    if (error) {
      console.error('Content delete error:', error);
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
