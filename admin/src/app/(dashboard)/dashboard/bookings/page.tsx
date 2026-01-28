'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility,
  Search,
  Phone,
  Email,
  WhatsApp,
  Close,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// ============================================
// API FUNCTIONS
// ============================================

async function fetchBookings(searchQuery: string, statusFilter: string) {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== 'all') {
    params.append('status', statusFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }

  const response = await fetch(`/api/v1/bookings?${params.toString()}`);
  if (!response.ok) throw new Error('Sifarişlər yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

async function fetchBookingDetails(id: string) {
  const response = await fetch(`/api/v1/bookings/${id}`);
  if (!response.ok) throw new Error('Sifariş detalları yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

async function fetchTechnicians() {
  const response = await fetch('/api/v1/users?role=technician');
  if (!response.ok) return [];
  const result = await response.json();
  return result.data?.items || [];
}

// ============================================
// STATUS HELPERS
// ============================================

const STATUS_LABELS: Record<string, string> = {
  pending: 'Gözləyən',
  confirmed: 'Təsdiqlənmiş',
  in_progress: 'İcrada',
  completed: 'Tamamlanmış',
  cancelled: 'Ləğv edilmiş',
};

const STATUS_COLORS: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
};

function formatDate(dateString: string | null) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('az-AZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatPrice(price: number | null | undefined) {
  if (!price) return '-';
  return `€${price.toFixed(2)}`;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BookingsPage() {
  const queryClient = useQueryClient();
  
  // States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch bookings
  const { data: bookingsData, isLoading, error } = useQuery({
    queryKey: ['bookings', searchQuery, statusFilter],
    queryFn: () => fetchBookings(searchQuery, statusFilter),
  });

  // Fetch booking details (when dialog opens)
  const { data: bookingDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['booking-details', selectedBookingId],
    queryFn: () => fetchBookingDetails(selectedBookingId!),
    enabled: !!selectedBookingId && detailsDialogOpen,
  });

  // Fetch technicians
  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians,
  });

  // ========== HANDLERS ==========
  const handleViewDetails = (id: string) => {
    setSelectedBookingId(id);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedBookingId(null);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/v1/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Status yeniləmə zamanı xəta');
      }

      toast.success('Status uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-details', id] });
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleAssignTechnician = async (id: string, technicianId: string | null) => {
    try {
      const response = await fetch(`/api/v1/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to: technicianId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Texnik təyin zamanı xəta');
      }

      toast.success('Texnik uğurla təyin edildi');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-details', id] });
    } catch (error) {
      console.error('Assign error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  // ========== RENDER ==========
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Sifarişlər
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Sifariş №, Müştəri adı, E-poçt, Telefon axtar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 300 }}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Hamısı</MenuItem>
              <MenuItem value="pending">Gözləyən</MenuItem>
              <MenuItem value="confirmed">Təsdiqlənmiş</MenuItem>
              <MenuItem value="in_progress">İcrada</MenuItem>
              <MenuItem value="completed">Tamamlanmış</MenuItem>
              <MenuItem value="cancelled">Ləğv edilmiş</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sifariş №</TableCell>
                <TableCell>Müştəri</TableCell>
                <TableCell>Xidmət</TableCell>
                <TableCell>Cihaz</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Qiymət</TableCell>
                <TableCell>Tarix</TableCell>
                <TableCell align="right">Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: 'error.main' }}>
                    Xəta: {error instanceof Error ? error.message : 'Məlumatlar yüklənə bilmədi'}
                  </TableCell>
                </TableRow>
              ) : bookingsData?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Heç bir sifariş tapılmadı
                  </TableCell>
                </TableRow>
              ) : (
                bookingsData?.items.map((booking: any) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {booking.booking_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.customer_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Phone fontSize="inherit" /> {booking.customer_phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.service?.name_de || '-'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {booking.category?.name_de || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.brand?.name || '-'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {booking.model?.name || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[booking.status] || booking.status}
                        color={STATUS_COLORS[booking.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking.final_price ? formatPrice(booking.final_price) : booking.estimated_price || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {formatDate(booking.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleViewDetails(booking.id)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* DETAILS DIALOG */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Sifariş Detalları</Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : bookingDetails ? (
            <Grid container spacing={3}>
              {/* Booking Number & Status */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                    {bookingDetails.booking_number}
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={bookingDetails.status}
                      label="Status"
                      onChange={(e) => handleStatusChange(bookingDetails.id, e.target.value)}
                    >
                      <MenuItem value="pending">Gözləyən</MenuItem>
                      <MenuItem value="confirmed">Təsdiqlənmiş</MenuItem>
                      <MenuItem value="in_progress">İcrada</MenuItem>
                      <MenuItem value="completed">Tamamlanmış</MenuItem>
                      <MenuItem value="cancelled">Ləğv edilmiş</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Customer Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  MÜŞTƏRİ MƏLUMATLARI
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Ad</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {bookingDetails.customer_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Telefon</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" color="primary" />
                      <Typography variant="body1">{bookingDetails.customer_phone}</Typography>
                    </Box>
                  </Grid>
                  {bookingDetails.customer_email && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">E-poçt</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="primary" />
                        <Typography variant="body1">{bookingDetails.customer_email}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {bookingDetails.customer_whatsapp && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">WhatsApp</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsApp fontSize="small" color="success" />
                        <Typography variant="body1">{bookingDetails.customer_whatsapp}</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Service & Device Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  XİDMƏT VƏ CİHAZ
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Kateqoriya</Typography>
                    <Typography variant="body1">{bookingDetails.category?.name_de || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Xidmət</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {bookingDetails.service?.name_de || '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Marka</Typography>
                    <Typography variant="body1">{bookingDetails.brand?.name || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Model</Typography>
                    <Typography variant="body1">{bookingDetails.model?.name || '-'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Pricing */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  QİYMƏT
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Təxmini qiymət</Typography>
                    <Typography variant="body1">{bookingDetails.estimated_price || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Son qiymət</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatPrice(bookingDetails.final_price)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Assignment */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  TƏYİNAT
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Texnik</InputLabel>
                  <Select
                    value={bookingDetails.assigned_to?.id || ''}
                    label="Texnik"
                    onChange={(e) => handleAssignTechnician(bookingDetails.id, e.target.value || null)}
                  >
                    <MenuItem value="">Təyin edilməyib</MenuItem>
                    {technicians?.map((tech: any) => (
                      <MenuItem key={tech.id} value={tech.id}>
                        {tech.full_name} ({tech.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Notes */}
              {bookingDetails.customer_notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                    MÜŞTƏRİ QEYDI
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {bookingDetails.customer_notes}
                  </Typography>
                </Grid>
              )}

              {bookingDetails.internal_notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                    DAXİLİ QEYD
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {bookingDetails.internal_notes}
                  </Typography>
                </Grid>
              )}

              {/* Dates */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  TARİXLƏR
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Yaradılma tarixi</Typography>
                    <Typography variant="body2">{formatDate(bookingDetails.created_at)}</Typography>
                  </Grid>
                  {bookingDetails.confirmed_date && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Təsdiq tarixi</Typography>
                      <Typography variant="body2">{formatDate(bookingDetails.confirmed_date)}</Typography>
                    </Grid>
                  )}
                  {bookingDetails.completion_date && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Tamamlanma tarixi</Typography>
                      <Typography variant="body2">{formatDate(bookingDetails.completion_date)}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Typography>Məlumat tapılmadı</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Bağla</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
