'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Save,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ============================================
// API FUNCTIONS
// ============================================

async function fetchSettings(searchQuery: string) {
  const params = new URLSearchParams();
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }

  const response = await fetch(`/api/v1/settings?${params.toString()}`);
  if (!response.ok) throw new Error('Parametrlər yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

// ============================================
// ZOD SCHEMA
// ============================================

const settingSchema = z.object({
  key: z.string().min(1, 'Açar mütləqdir').max(100).regex(/^[a-z0-9_]+$/, 'Açar yalnız kiçik hərflər, rəqəmlər və alt xətt ola bilər'),
  value: z.string().optional().or(z.literal('')),
  value_type: z.enum(['string', 'number', 'boolean', 'json']),
  description: z.string().optional().or(z.literal('')),
  is_public: z.boolean(),
});

type SettingFormData = z.infer<typeof settingSchema>;

// ============================================
// HELPERS
// ============================================

const VALUE_TYPE_LABELS: Record<string, string> = {
  string: 'Mətn',
  number: 'Rəqəm',
  boolean: 'Boolean',
  json: 'JSON',
};

function formatDateTime(dateString: string | null) {
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

// ============================================
// MAIN COMPONENT
// ============================================

export default function SettingsPage() {
  const queryClient = useQueryClient();

  // States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<any>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch settings
  const { data, isLoading, error } = useQuery({
    queryKey: ['settings', searchQuery],
    queryFn: () => fetchSettings(searchQuery),
  });

  // Form
  const isEditMode = !!selectedSetting;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      key: '',
      value: '',
      value_type: 'string',
      description: '',
      is_public: false,
    },
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (selectedSetting && formOpen) {
      reset({
        key: selectedSetting.key || '',
        value: selectedSetting.value || '',
        value_type: selectedSetting.value_type || 'string',
        description: selectedSetting.description || '',
        is_public: selectedSetting.is_public ?? false,
      });
    } else if (!selectedSetting && formOpen) {
      reset({
        key: '',
        value: '',
        value_type: 'string',
        description: '',
        is_public: false,
      });
    }
  }, [selectedSetting, formOpen, reset]);

  // ========== HANDLERS ==========
  const handleEdit = (setting: any) => {
    setSelectedSetting(setting);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedSetting(null);
  };

  const onSubmit = async (data: SettingFormData) => {
    try {
      const url = isEditMode ? `/api/v1/settings/${selectedSetting.key}` : '/api/v1/settings';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Xəta baş verdi');
      }

      toast.success(isEditMode ? 'Parametr uğurla yeniləndi' : 'Parametr uğurla yaradıldı');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      handleCloseForm();
    } catch (error) {
      console.error('Form submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`"${key}" parametrini silmək istədiyinizdən əminsiniz?`)) return;

    try {
      const response = await fetch(`/api/v1/settings/${key}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }

      toast.success('Parametr uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  // ========== RENDER ==========
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Parametrlər
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
        >
          Parametr əlavə et
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            placeholder="Açar, təsvir və ya dəyər axtar..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Settings Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Açar</TableCell>
                <TableCell>Dəyər</TableCell>
                <TableCell>Tip</TableCell>
                <TableCell>Təsvir</TableCell>
                <TableCell>Public</TableCell>
                <TableCell>Son yeniləmə</TableCell>
                <TableCell align="right">Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
                    Xəta: {error instanceof Error ? error.message : 'Məlumatlar yüklənə bilmədi'}
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Heç bir parametr tapılmadı
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((setting: any) => (
                  <TableRow key={setting.key} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {setting.key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {setting.value || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={VALUE_TYPE_LABELS[setting.value_type] || setting.value_type}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 250,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {setting.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={setting.is_public ? 'Bəli' : 'Xeyr'}
                        size="small"
                        color={setting.is_public ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {formatDateTime(setting.updated_at)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {setting.updated_by_user?.full_name || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(setting)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(setting.key)}
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

      {/* FORM DIALOG */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{isEditMode ? 'Parametri redaktə et' : 'Yeni Parametr əlavə et'}</DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Key */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="key"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Açar *"
                      fullWidth
                      required
                      disabled={isEditMode}
                      error={!!errors.key}
                      helperText={errors.key?.message || 'məs: business_name, email_enabled'}
                    />
                  )}
                />
              </Grid>

              {/* Value Type */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="value_type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Tip *"
                      fullWidth
                      required
                      error={!!errors.value_type}
                      helperText={errors.value_type?.message}
                    >
                      <MenuItem value="string">Mətn</MenuItem>
                      <MenuItem value="number">Rəqəm</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                      <MenuItem value="json">JSON</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* Value */}
              <Grid item xs={12}>
                <Controller
                  name="value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dəyər"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.value}
                      helperText={errors.value?.message}
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Təsvir"
                      fullWidth
                      multiline
                      rows={2}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              {/* Is Public */}
              <Grid item xs={12}>
                <Controller
                  name="is_public"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Public API-yə açıqdır"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseForm} disabled={isSubmitting}>
              Ləğv et
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Yadda saxlanılır...' : isEditMode ? 'Yenilə' : 'Əlavə et'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
