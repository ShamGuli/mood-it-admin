import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// GET /api/public/content - Get page content (PUBLIC)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 'index';

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('content_pages')
      .select('*')
      .eq('page_slug', page)
      .order('section_key', { ascending: true });

    if (error) {
      console.error('Public content fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: 'Məzmun yüklənə bilmədi' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error('Public content error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
