'use client';

import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar } from '@mui/material';
import {
  BookOnline,
  HourglassEmpty,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatPrice } from '@/lib/utils/format';

// API calls
async function fetchDashboardStats() {
  const response = await fetch('/api/v1/dashboard/stats');
  if (!response.ok) throw new Error('Statistika yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

async function fetchRecentBookings() {
  const response = await fetch('/api/v1/bookings?limit=5');
  if (!response.ok) throw new Error('Son sifarişlər yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

const STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
} as const;

const STATUS_LABELS = {
  pending: 'Gözləyən',
  confirmed: 'Təsdiqlənmiş',
  in_progress: 'İcrada',
  completed: 'Tamamlanmış',
  cancelled: 'Ləğv edilmiş',
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  change?: string;
}) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {change && (
              <Typography variant="caption" sx={{ color: '#4CAF50', display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                {change}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color}20, ${color}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 32, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: fetchRecentBookings,
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        İdarə Paneli
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cəmi Sifarişlər"
            value={statsLoading ? '...' : stats?.totalBookings || 0}
            icon={BookOnline}
            color="#8a4fff"
            change={stats?.bookingsChange ? `${stats.bookingsChange}% vs keçən ay` : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gözləyən"
            value={statsLoading ? '...' : stats?.pendingBookings || 0}
            icon={HourglassEmpty}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tamamlanmış"
            value={statsLoading ? '...' : stats?.completedBookings || 0}
            icon={CheckCircle}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Gəlir (Ay)"
            value={statsLoading ? '...' : `€${(stats?.totalRevenue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
            color="#2196F3"
            change={stats?.revenueChange ? `${stats.revenueChange}% vs keçən ay` : undefined}
          />
        </Grid>
      </Grid>

      {/* Recent Bookings Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Son Sifarişlər
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sifariş №</TableCell>
                      <TableCell>Müştəri</TableCell>
                      <TableCell>Xidmət</TableCell>
                      <TableCell>Tarix</TableCell>
                      <TableCell>Qiymət</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Yüklənir...
                        </TableCell>
                      </TableRow>
                    ) : recentBookings?.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Heç bir sifariş tapılmadı
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentBookings?.items.map((booking) => (
                        <TableRow key={booking.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                              {booking.booking_number}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {booking.customer_name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {booking.customer_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.service?.name_de || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(booking.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {booking.final_price ? formatPrice(booking.final_price) : booking.estimated_price || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS]}
                              size="small"
                              color={STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS]}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
