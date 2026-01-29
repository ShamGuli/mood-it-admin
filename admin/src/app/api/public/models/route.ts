import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand_id');

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: 'brand_id is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: models, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: models || [],
    });
  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
