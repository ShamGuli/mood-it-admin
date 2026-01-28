'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const serviceSchema = z.object({
  category_id: z.string().min(1, 'Kateqoriya mütləqdir'),
  name_de: z.string().min(3, 'Ad ən azı 3 simvol olmalıdır').max(255),
  name_en: z.string().max(255).optional().or(z.literal('')),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
  description_de: z.string().optional().or(z.literal('')),
  description_en: z.string().optional().or(z.literal('')),
  icon: z.string().min(1, 'İkon mütləqdir'),
  duration: z.string().optional().or(z.literal('')),
  price_min: z.string().optional().or(z.literal('')),
  price_max: z.string().optional().or(z.literal('')),
  price_display: z.string().optional().or(z.literal('')),
  is_active: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: any; // For edit mode
}

// Fetch categories
async function fetchCategories() {
  const response = await fetch('/api/v1/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  const result = await response.json();
  return result.data?.items || [];
}

export default function ServiceForm({ open, onClose, onSuccess, service }: ServiceFormProps) {
  const isEditMode = !!service;

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    enabled: open,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      category_id: '',
      name_de: '',
      name_en: '',
      slug: '',
      description_de: '',
      description_en: '',
      icon: 'fa-solid fa-wrench',
      duration: '',
      price_min: '',
      price_max: '',
      price_display: '',
      is_active: true,
    },
  });

  // Auto-generate slug from name_de
  const nameDe = watch('name_de');
  useEffect(() => {
    if (nameDe && !isEditMode) {
      const slug = nameDe
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      reset((formValues) => ({
        ...formValues,
        slug,
      }));
    }
  }, [nameDe, isEditMode, reset]);

  // Load service data for edit mode
  useEffect(() => {
    if (service && open) {
      reset({
        category_id: service.category_id || '',
        name_de: service.name_de || '',
        name_en: service.name_en || '',
        slug: service.slug || '',
        description_de: service.description_de || '',
        description_en: service.description_en || '',
        icon: service.icon || 'fa-solid fa-wrench',
        duration: service.duration || '',
        price_min: service.price_min?.toString() || '',
        price_max: service.price_max?.toString() || '',
        price_display: service.price_display || '',
        is_active: service.is_active ?? true,
      });
    } else if (!open) {
      reset();
    }
  }, [service, open, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      // Convert price strings to numbers
      const payload = {
        ...data,
        price_min: data.price_min ? parseFloat(data.price_min) : undefined,
        price_max: data.price_max ? parseFloat(data.price_max) : undefined,
      };

      const response = await fetch(
        isEditMode ? `/api/v1/services/${service.id}` : '/api/v1/services',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Yadda saxlama zamanı xəta');
      }

      toast.success(result.message || `Xidmət uğurla ${isEditMode ? 'yeniləndi' : 'yaradıldı'}`);
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('Service form error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? 'Xidməti redaktə et' : 'Yeni Xidmət əlavə et'}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Category */}
            <Grid item xs={12} md={6}>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Kateqoriya *"
                    fullWidth
                    error={!!errors.category_id}
                    helperText={errors.category_id?.message}
                    disabled={categoriesLoading}
                  >
                    {categoriesLoading ? (
                      <MenuItem value="">
                        <CircularProgress size={20} />
                      </MenuItem>
                    ) : (
                      categories?.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name_de}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid>

            {/* Icon */}
            <Grid item xs={12} md={6}>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="İkon (FontAwesome) *"
                    fullWidth
                    error={!!errors.icon}
                    helperText={errors.icon?.message || 'məs: fa-solid fa-mobile'}
                  />
                )}
              />
            </Grid>

            {/* Name DE */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name_de"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ad (Almanca) *"
                    fullWidth
                    error={!!errors.name_de}
                    helperText={errors.name_de?.message}
                  />
                )}
              />
            </Grid>

            {/* Name EN */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name_en"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ad (İngiliscə)"
                    fullWidth
                    error={!!errors.name_en}
                    helperText={errors.name_en?.message}
                  />
                )}
              />
            </Grid>

            {/* Slug */}
            <Grid item xs={12}>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Slug *"
                    fullWidth
                    error={!!errors.slug}
                    helperText={errors.slug?.message || 'URL-uyğun, məs: ekran-deyismesi'}
                  />
                )}
              />
            </Grid>

            {/* Description DE */}
            <Grid item xs={12} md={6}>
              <Controller
                name="description_de"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Təsvir (Almanca)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description_de}
                    helperText={errors.description_de?.message}
                  />
                )}
              />
            </Grid>

            {/* Description EN */}
            <Grid item xs={12} md={6}>
              <Controller
                name="description_en"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Təsvir (İngiliscə)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description_en}
                    helperText={errors.description_en?.message}
                  />
                )}
              />
            </Grid>

            {/* Duration */}
            <Grid item xs={12} md={4}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Müddət"
                    fullWidth
                    placeholder="məs: 1-2 saat"
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                  />
                )}
              />
            </Grid>

            {/* Price Min */}
            <Grid item xs={12} md={4}>
              <Controller
                name="price_min"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Min Qiymət (€)"
                    type="number"
                    fullWidth
                    inputProps={{ step: '0.01', min: 0 }}
                    error={!!errors.price_min}
                    helperText={errors.price_min?.message}
                  />
                )}
              />
            </Grid>

            {/* Price Max */}
            <Grid item xs={12} md={4}>
              <Controller
                name="price_max"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Maks Qiymət (€)"
                    type="number"
                    fullWidth
                    inputProps={{ step: '0.01', min: 0 }}
                    error={!!errors.price_max}
                    helperText={errors.price_max?.message}
                  />
                )}
              />
            </Grid>

            {/* Price Display */}
            <Grid item xs={12}>
              <Controller
                name="price_display"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Qiymətin Göstərilməsi"
                    fullWidth
                    placeholder="məs: €79-199"
                    error={!!errors.price_display}
                    helperText={errors.price_display?.message || 'Qiymətin necə göstəriləcəyi'}
                  />
                )}
              />
            </Grid>

            {/* Is Active */}
            <Grid item xs={12}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Xidmət aktivdir"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Ləğv et
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Yadda saxlanılır...' : isEditMode ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
