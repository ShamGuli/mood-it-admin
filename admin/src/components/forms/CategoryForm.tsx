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
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const categorySchema = z.object({
  name_de: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(100),
  name_en: z.string().max(100).optional().or(z.literal('')),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
  icon: z.string().min(1, 'İkon mütləqdir'),
  description_de: z.string().optional().or(z.literal('')),
  description_en: z.string().optional().or(z.literal('')),
  badge: z.string().max(50).optional().or(z.literal('')),
  display_order: z.string().min(1, 'Sıralama mütləqdir'),
  is_active: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: any;
}

export default function CategoryForm({ open, onClose, onSuccess, category }: CategoryFormProps) {
  const isEditMode = !!category;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name_de: '',
      name_en: '',
      slug: '',
      icon: 'fa-solid fa-wrench',
      description_de: '',
      description_en: '',
      badge: '',
      display_order: '1',
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

  // Load category data for edit mode
  useEffect(() => {
    if (category && open) {
      reset({
        name_de: category.name_de || '',
        name_en: category.name_en || '',
        slug: category.slug || '',
        icon: category.icon || 'fa-solid fa-wrench',
        description_de: category.description_de || '',
        description_en: category.description_en || '',
        badge: category.badge || '',
        display_order: category.display_order?.toString() || '',
        is_active: category.is_active ?? true,
      });
    } else if (!open) {
      reset({
        name_de: '',
        name_en: '',
        slug: '',
        icon: 'fa-solid fa-wrench',
        description_de: '',
        description_en: '',
        badge: '',
        display_order: '1',
        is_active: true,
      });
    }
  }, [category, open, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const payload = {
        ...data,
        display_order: data.display_order ? parseInt(data.display_order) : undefined,
      };

      const response = await fetch(
        isEditMode ? `/api/v1/categories/${category.id}` : '/api/v1/categories',
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

      toast.success(result.message || `Kateqoriya uğurla ${isEditMode ? 'yeniləndi' : 'yaradıldı'}`);
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('Category form error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEditMode ? 'Kateqoriyanı redaktə et' : 'Yeni Kateqoriya əlavə et'}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
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

            {/* Display Order */}
            <Grid item xs={12} md={6}>
              <Controller
                name="display_order"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Göstərilmə sırası *"
                    type="number"
                    fullWidth
                    required
                    inputProps={{ min: 1 }}
                    error={!!errors.display_order}
                    helperText={errors.display_order?.message || 'Sıralama nömrəsi (1, 2, 3...)'}
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
                    helperText={errors.slug?.message || 'URL-uyğun, məs: telefon'}
                  />
                )}
              />
            </Grid>

            {/* Badge */}
            <Grid item xs={12} md={6}>
              <Controller
                name="badge"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nişan"
                    fullWidth
                    placeholder="məs: Popular, Hot"
                    error={!!errors.badge}
                    helperText={errors.badge?.message}
                  />
                )}
              />
            </Grid>

            {/* Is Active */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Kateqoriya aktivdir"
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
