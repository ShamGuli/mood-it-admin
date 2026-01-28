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

// Mock API calls
async function fetchDashboardStats() {
  return {
    totalBookings: 156,
    pendingBookings: 12,
    completedBookings: 125,
    monthlyRevenue: 4200,
  };
}

async function fetchRecentBookings() {
  return {
    items: [
      {
        id: '1',
        booking_number: 'BOOK-20260128-0001',
        customer_name: 'Max Mustermann',
        service: { name_de: 'Display Tausch' },
        status: 'pending',
        estimated_price: '€149',
        booking_date: '2026-01-29T10:00:00Z',
      },
      {
        id: '2',
        booking_number: 'BOOK-20260128-0002',
        customer_name: 'Anna Schmidt',
        service: { name_de: 'HDMI Port Reparatur' },
        status: 'in_progress',
        estimated_price: '€89',
        booking_date: '2026-01-28T15:00:00Z',
      },
      {
        id: '3',
        booking_number: 'BOOK-20260127-0005',
        customer_name: 'Peter Müller',
        service: { name_de: 'Akku Wechsel' },
        status: 'completed',
        estimated_price: '€69',
        booking_date: '2026-01-27T11:00:00Z',
      },
    ],
  };
}

const STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
} as const;

const STATUS_LABELS = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  in_progress: 'In Bearbeitung',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
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
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={statsLoading ? '...' : stats?.totalBookings || 0}
            icon={BookOnline}
            color="#8a4fff"
            change="+12% vs letzter Monat"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Bookings"
            value={statsLoading ? '...' : stats?.pendingBookings || 0}
            icon={HourglassEmpty}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={statsLoading ? '...' : stats?.completedBookings || 0}
            icon={CheckCircle}
            color="#4CAF50"
            change="+8% vs letzter Monat"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue (Monat)"
            value={statsLoading ? '...' : `€${stats?.monthlyRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="#2196F3"
            change="+10.5%"
          />
        </Grid>
      </Grid>

      {/* Recent Bookings Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Letzte Buchungen
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Buchungsnr.</TableCell>
                      <TableCell>Kunde</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Termin</TableCell>
                      <TableCell>Preis</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Laden...
                        </TableCell>
                      </TableRow>
                    ) : recentBookings?.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Keine Buchungen vorhanden
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
                              {booking.service.name_de}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(booking.booking_date)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {booking.estimated_price}
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
