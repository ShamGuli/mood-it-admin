import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    const supabase = createClient();

    let query = supabase.from('brands').select('*').eq('is_active', true).order('name');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: brands, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: brands || [],
    });
  } catch (error) {
    console.error('Brands API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
