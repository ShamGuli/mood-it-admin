'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Zod schema
const modelSchema = z.object({
  brand_id: z.string().min(1, 'Marka mütləqdir'),
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
  release_year: z.string().optional().or(z.literal('')),
  display_order: z.string().min(1, 'Sıralama mütləqdir'),
  is_active: z.boolean(),
});

type ModelFormData = z.infer<typeof modelSchema>;

interface ModelFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  model?: any | null;
}

// Fetch brands
async function fetchBrands() {
  const response = await fetch('/api/v1/brands?include_inactive=true');
  if (!response.ok) throw new Error('Markalar yüklənə bilmədi');
  const result = await response.json();
  return result.data?.items || [];
}

export default function ModelForm({ open, onClose, onSuccess, model }: ModelFormProps) {
  const isEditMode = !!model;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      brand_id: '',
      name: '',
      slug: '',
      release_year: '',
      display_order: '1',
      is_active: true,
    },
  });

  // Fetch brands
  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  // Auto-generate slug from name
  const name = watch('name');
  useEffect(() => {
    if (!isEditMode && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', generatedSlug);
    }
  }, [name, isEditMode, setValue]);

  // Pre-fill form in edit mode
  useEffect(() => {
    if (model && open) {
      reset({
        brand_id: model.brand_id || '',
        name: model.name || '',
        slug: model.slug || '',
        release_year: model.release_year ? String(model.release_year) : '',
        display_order: String(model.display_order || 1),
        is_active: model.is_active ?? true,
      });
    } else if (!model && open) {
      reset({
        brand_id: '',
        name: '',
        slug: '',
        release_year: '',
        display_order: '1',
        is_active: true,
      });
    }
  }, [model, open, reset]);

  const onSubmit = async (data: ModelFormData) => {
    try {
      const payload = {
        ...data,
        release_year: data.release_year ? parseInt(data.release_year, 10) : null,
        display_order: parseInt(data.display_order, 10),
      };

      const url = isEditMode ? `/api/v1/models/${model.id}` : '/api/v1/models';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Xəta baş verdi');
      }

      toast.success(isEditMode ? 'Model uğurla yeniləndi' : 'Model uğurla yaradıldı');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Form submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEditMode ? 'Modeli redaktə et' : 'Yeni Model əlavə et'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Brand */}
            <Grid item xs={12}>
              <Controller
                name="brand_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Marka *"
                    fullWidth
                    required
                    error={!!errors.brand_id}
                    helperText={errors.brand_id?.message}
                  >
                    {brands?.map((brand: any) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ad *"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Slug */}
            <Grid item xs={12} md={6}>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Slug *"
                    fullWidth
                    required
                    error={!!errors.slug}
                    helperText={errors.slug?.message || 'URL-də istifadə olunur'}
                  />
                )}
              />
            </Grid>

            {/* Release Year */}
            <Grid item xs={12} md={4}>
              <Controller
                name="release_year"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Buraxılış ili"
                    type="number"
                    fullWidth
                    inputProps={{ min: 2000, max: new Date().getFullYear() + 1 }}
                    error={!!errors.release_year}
                    helperText={errors.release_year?.message || 'məs: 2024'}
                  />
                )}
              />
            </Grid>

            {/* Display Order */}
            <Grid item xs={12} md={4}>
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

            {/* Is Active */}
            <Grid item xs={12} md={4}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Aktiv"
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
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Yadda saxlanılır...' : isEditMode ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
