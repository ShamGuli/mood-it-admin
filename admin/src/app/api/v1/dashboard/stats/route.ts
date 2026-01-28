import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering (prevent static optimization)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================
// GET /api/v1/dashboard/stats - Get dashboard statistics
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // 2. Pending bookings
    const { count: pendingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 3. Completed bookings
    const { count: completedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // 4. Total revenue (sum of final_price for completed bookings)
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('status', 'completed')
      .not('final_price', 'is', null);

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.final_price || 0), 0) || 0;

    // 5. Calculate change percentages (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Current period (last 30 days)
    const { count: currentPeriodBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Previous period (30-60 days ago)
    const { count: previousPeriodBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString());

    // Calculate percentage change
    const bookingsChange = previousPeriodBookings && previousPeriodBookings > 0
      ? ((((currentPeriodBookings || 0) - previousPeriodBookings) / previousPeriodBookings) * 100).toFixed(1)
      : '+0';

    // Revenue change
    const { data: currentRevenueData } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .not('final_price', 'is', null);

    const currentRevenue = currentRevenueData?.reduce((sum, booking) => sum + (booking.final_price || 0), 0) || 0;

    const { data: previousRevenueData } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('status', 'completed')
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())
      .not('final_price', 'is', null);

    const previousRevenue = previousRevenueData?.reduce((sum, booking) => sum + (booking.final_price || 0), 0) || 0;

    const revenueChange = previousRevenue > 0
      ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1)
      : '+0';

    return NextResponse.json({
      success: true,
      data: {
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        completedBookings: completedBookings || 0,
        totalRevenue: totalRevenue,
        bookingsChange: bookingsChange,
        revenueChange: revenueChange,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Server xətası' } },
      { status: 500 }
    );
  }
}
