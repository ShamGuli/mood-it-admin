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
const brandSchema = z.object({
  category_id: z.string().min(1, 'Kateqoriya mütləqdir'),
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug yalnız kiçik hərflər, rəqəmlər və tire ola bilər'),
  logo_url: z.string().url('Logo URL yanlışdır').optional().or(z.literal('')),
  display_order: z.string().min(1, 'Sıralama mütləqdir'),
  is_active: z.boolean(),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: any | null;
}

// Fetch categories
async function fetchCategories() {
  const response = await fetch('/api/v1/categories?include_inactive=true');
  if (!response.ok) throw new Error('Kateqoriyalar yüklənə bilmədi');
  const result = await response.json();
  return result.data?.items || [];
}

export default function BrandForm({ open, onClose, onSuccess, brand }: BrandFormProps) {
  const isEditMode = !!brand;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      category_id: '',
      name: '',
      slug: '',
      logo_url: '',
      display_order: '1',
      is_active: true,
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
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
    if (brand && open) {
      reset({
        category_id: brand.category_id || '',
        name: brand.name || '',
        slug: brand.slug || '',
        logo_url: brand.logo_url || '',
        display_order: String(brand.display_order || 1),
        is_active: brand.is_active ?? true,
      });
    } else if (!brand && open) {
      reset({
        category_id: '',
        name: '',
        slug: '',
        logo_url: '',
        display_order: '1',
        is_active: true,
      });
    }
  }, [brand, open, reset]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      const payload = {
        ...data,
        display_order: parseInt(data.display_order, 10),
      };

      const url = isEditMode ? `/api/v1/brands/${brand.id}` : '/api/v1/brands';
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

      toast.success(isEditMode ? 'Marka uğurla yeniləndi' : 'Marka uğurla yaradıldı');
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
        <DialogTitle>{isEditMode ? 'Markanı redaktə et' : 'Yeni Marka əlavə et'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Category */}
            <Grid item xs={12}>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Kateqoriya *"
                    fullWidth
                    required
                    error={!!errors.category_id}
                    helperText={errors.category_id?.message}
                  >
                    {categories?.map((cat: any) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name_de}
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

            {/* Logo URL */}
            <Grid item xs={12} md={8}>
              <Controller
                name="logo_url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Logo URL"
                    fullWidth
                    error={!!errors.logo_url}
                    helperText={errors.logo_url?.message || 'məs: https://example.com/logo.png'}
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
            <Grid item xs={12}>
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
