'use client';

import { useState, useEffect } from 'react';

// Helper functions
function formatPrice(service: any): string {
  if (service.price_display) {
    // Əgər artıq € var olarsa, olduğu kimi qaytar
    if (service.price_display.includes('€') || service.price_display.includes('EUR')) {
      return service.price_display;
    }
    // Yoxdursa, əlavə et
    return `€${service.price_display}`;
  }
  
  // price_display yoxdursa, price_min və price_max-dan yarat
  if (service.price_min && service.price_max) {
    return `€${service.price_min}-${service.price_max}`;
  }
  
  if (service.price_min) {
    return `€${service.price_min}`;
  }
  
  return '-';
}

function formatDuration(duration: string | null): string {
  if (!duration) return '-';
  
  // Almanca sözləri Azərbaycan dilinə çevir
  return duration
    .replace(/\b(\d+)-(\d+)\s*stunden?\b/gi, '$1-$2 saat')
    .replace(/\bstunden?\b/gi, 'saat')
    .replace(/\btage?\b/gi, 'gün')
    .replace(/\bminuten?\b/gi, 'dəqiqə')
    .replace(/\bwoche\b/gi, 'həftə')
    .replace(/\bmonat\b/gi, 'ay');
}
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Switch,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ContentCopy,
  Search,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ServiceForm from '@/components/forms/ServiceForm';

// Real API call to Supabase
async function fetchServices(searchQuery: string, categoryFilter: string) {
  const params = new URLSearchParams();
  
  // Category filter
  if (categoryFilter && categoryFilter !== 'all') {
    params.append('category_id', categoryFilter);
  }
  
  // Search query
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }
  
  // Order by created_at DESC (newest first)
  params.append('order_by', 'created_at');
  params.append('order_direction', 'desc');
  
  const response = await fetch(`/api/v1/services?${params.toString()}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Xidmətləri yükləmək alınmadı');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error?.message || 'Xidmətləri yükləmək alınmadı');
  }
  
  return result.data;
}

export default function ServicesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch services
  const { data, isLoading, error } = useQuery({
    queryKey: ['services', searchQuery, categoryFilter],
    queryFn: () => fetchServices(searchQuery, categoryFilter),
  });

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-filter'],
    queryFn: async () => {
      const response = await fetch('/api/v1/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      return result.success ? result.data.items : [];
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedService(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xidməti silmək istədiyinizdən əminsiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/services/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }

      toast.success('Xidmət uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Status yeniləmə zamanı xəta');
      }

      toast.success('Status uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Xidmətlər
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
        >
          Xidmət əlavə et
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Xidmət axtar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <TextField
              select
              label="Kateqoriya"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Bütün kateqoriyalar</MenuItem>
              {categoriesData?.map((category: any) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name_de}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell>Kateqoriya</TableCell>
                <TableCell>Qiymət</TableCell>
                <TableCell>Müddət</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'error.main' }}>
                    Xidmətləri yükləmə zamanı xəta: {error instanceof Error ? error.message : 'Naməlum xəta'}
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Heç bir xidmət tapılmadı
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((service: any) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {service.name_de}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.category.name_de}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatPrice(service)}</TableCell>
                    <TableCell>{formatDuration(service.duration)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_active}
                        onChange={() => handleToggleActive(service.id, service.is_active)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => toast.info('Dublikat yarat')}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(service.id)}
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

      {/* Service Form Modal */}
      <ServiceForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        service={selectedService}
      />
    </Box>
  );
}
