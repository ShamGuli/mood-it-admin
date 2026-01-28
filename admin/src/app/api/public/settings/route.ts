import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================
// GET /api/public/settings - Get public settings (PUBLIC)
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('settings')
      .select('key, value, value_type')
      .eq('is_public', true)
      .order('key', { ascending: true });

    if (error) {
      console.error('Public settings fetch error:', error);
      return NextResponse.json(
        { success: false, error: { message: 'Parametrlər yüklənə bilmədi' } },
        { status: 500 }
      );
    }

    // Convert array to key-value object
    const settings: Record<string, any> = {};
    data?.forEach((setting) => {
      let value = setting.value;
      
      // Parse value based on type
      if (setting.value_type === 'number') {
        value = parseFloat(setting.value);
      } else if (setting.value_type === 'boolean') {
        value = setting.value === 'true';
      } else if (setting.value_type === 'json') {
        try {
          value = JSON.parse(setting.value);
        } catch (e) {
          value = setting.value;
        }
      }
      
      settings[setting.key] = value;
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Public settings error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
