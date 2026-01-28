'use client';

import { useState } from 'react';
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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Phone,
  Email,
  WhatsApp,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDate, formatPrice } from '@/lib/utils/format';

// Mock API call
async function fetchBookings() {
  return {
    items: [
      {
        id: '1',
        booking_number: 'BOOK-20260128-0001',
        customer_name: 'Max Mustermann',
        customer_phone: '+49 123 456789',
        customer_email: 'max@example.com',
        category: { name_de: 'Telefon' },
        service: { name_de: 'Display Tausch' },
        brand: { name: 'Apple iPhone' },
        model: { name: 'iPhone 15 Pro' },
        status: 'pending',
        estimated_price: '€149',
        final_price: null,
        booking_date: '2026-01-29T10:00:00Z',
        created_at: '2026-01-28T14:30:00Z',
      },
      {
        id: '2',
        booking_number: 'BOOK-20260128-0002',
        customer_name: 'Anna Schmidt',
        customer_phone: '+49 987 654321',
        customer_email: 'anna@example.com',
        category: { name_de: 'PlayStation' },
        service: { name_de: 'HDMI Port Reparatur' },
        brand: { name: 'Sony' },
        model: { name: 'PS5' },
        status: 'in_progress',
        estimated_price: '€89',
        final_price: null,
        booking_date: '2026-01-28T15:00:00Z',
        created_at: '2026-01-27T09:15:00Z',
      },
      {
        id: '3',
        booking_number: 'BOOK-20260127-0005',
        customer_name: 'Peter Müller',
        customer_phone: '+49 555 123456',
        customer_email: null,
        category: { name_de: 'Telefon' },
        service: { name_de: 'Akku Wechsel' },
        brand: { name: 'Samsung Galaxy' },
        model: { name: 'S23 Ultra' },
        status: 'completed',
        estimated_price: '€69',
        final_price: 69.00,
        booking_date: '2026-01-27T11:00:00Z',
        created_at: '2026-01-26T16:20:00Z',
      },
    ],
    pagination: {
      total: 3,
      page: 1,
      total_pages: 1,
    },
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

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', searchQuery, statusFilter],
    queryFn: fetchBookings,
  });

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Buchung wirklich löschen?')) {
      toast.success('Buchung gelöscht');
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    toast.success(`Status geändert zu: ${STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS]}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Buchungen
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.info('Buchung hinzufügen Modal öffnen')}
        >
          Neue Buchung
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buchung suchen (Nummer, Name, Telefon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              <MenuItem value="all">Alle Status</MenuItem>
              <MenuItem value="pending">Ausstehend</MenuItem>
              <MenuItem value="confirmed">Bestätigt</MenuItem>
              <MenuItem value="in_progress">In Bearbeitung</MenuItem>
              <MenuItem value="completed">Abgeschlossen</MenuItem>
              <MenuItem value="cancelled">Storniert</MenuItem>
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
                <TableCell>Buchungsnr.</TableCell>
                <TableCell>Kunde</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Gerät</TableCell>
                <TableCell>Termin</TableCell>
                <TableCell>Preis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Keine Buchungen gefunden
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {booking.booking_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(booking.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {booking.customer_name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {booking.customer_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.customer_phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking.service.name_de}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.category.name_de}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.brand.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.model.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(booking.booking_date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking.final_price ? formatPrice(booking.final_price) : booking.estimated_price}
                      </Typography>
                      {!booking.final_price && (
                        <Typography variant="caption" color="text.secondary">
                          (geschätzt)
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS]}
                        size="small"
                        color={STATUS_COLORS[booking.status as keyof typeof STATUS_COLORS]}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => toast.info('Bearbeiten')}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Buchungsdetails: {selectedBooking?.booking_number}
        </DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Kunde
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedBooking.customer_name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {selectedBooking.customer_phone && (
                    <Chip
                      icon={<Phone />}
                      label={selectedBooking.customer_phone}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {selectedBooking.customer_email && (
                    <Chip
                      icon={<Email />}
                      label={selectedBooking.customer_email}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Service & Gerät
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.service.name_de} - {selectedBooking.category.name_de}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBooking.brand.name} {selectedBooking.model.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={STATUS_LABELS[selectedBooking.status as keyof typeof STATUS_LABELS]}
                  color={STATUS_COLORS[selectedBooking.status as keyof typeof STATUS_COLORS]}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
