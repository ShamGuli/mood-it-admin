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
} from '@mui/material';
import { toast } from 'sonner';

// Zod schema
const contentSchema = z.object({
  page_slug: z.string().min(1, 'Səhifə slug-u mütləqdir').max(100),
  section_key: z.string().min(1, 'Bölmə açarı mütləqdir').max(100),
  content_de: z.string().optional().or(z.literal('')),
  content_en: z.string().optional().or(z.literal('')),
  content_type: z.enum(['text', 'html', 'json', 'markdown']),
  media_url: z.string().url('Media URL yanlışdır').optional().or(z.literal('')),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  content?: any | null;
}

export default function ContentForm({ open, onClose, onSuccess, content }: ContentFormProps) {
  const isEditMode = !!content;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      page_slug: '',
      section_key: '',
      content_de: '',
      content_en: '',
      content_type: 'html',
      media_url: '',
    },
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (content && open) {
      reset({
        page_slug: content.page_slug || '',
        section_key: content.section_key || '',
        content_de: content.content_de || '',
        content_en: content.content_en || '',
        content_type: content.content_type || 'html',
        media_url: content.media_url || '',
      });
    } else if (!content && open) {
      reset({
        page_slug: '',
        section_key: '',
        content_de: '',
        content_en: '',
        content_type: 'html',
        media_url: '',
      });
    }
  }, [content, open, reset]);

  const onSubmit = async (data: ContentFormData) => {
    try {
      const url = isEditMode ? `/api/v1/content/${content.id}` : '/api/v1/content';
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

      toast.success(isEditMode ? 'Məzmun uğurla yeniləndi' : 'Məzmun uğurla yaradıldı');
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
        <DialogTitle>{isEditMode ? 'Məzmunu redaktə et' : 'Yeni Məzmun əlavə et'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Page Slug */}
            <Grid item xs={12} md={6}>
              <Controller
                name="page_slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Səhifə Slug *"
                    fullWidth
                    required
                    error={!!errors.page_slug}
                    helperText={errors.page_slug?.message || 'məs: home, about, contact'}
                  />
                )}
              />
            </Grid>

            {/* Section Key */}
            <Grid item xs={12} md={6}>
              <Controller
                name="section_key"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bölmə Açarı *"
                    fullWidth
                    required
                    error={!!errors.section_key}
                    helperText={errors.section_key?.message || 'məs: hero_title, about_text'}
                  />
                )}
              />
            </Grid>

            {/* Content Type */}
            <Grid item xs={12}>
              <Controller
                name="content_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Məzmun Tipi *"
                    fullWidth
                    required
                    error={!!errors.content_type}
                    helperText={errors.content_type?.message}
                  >
                    <MenuItem value="text">Mətn</MenuItem>
                    <MenuItem value="html">HTML</MenuItem>
                    <MenuItem value="markdown">Markdown</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Content DE */}
            <Grid item xs={12}>
              <Controller
                name="content_de"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Məzmun (Alman dili)"
                    fullWidth
                    multiline
                    rows={6}
                    error={!!errors.content_de}
                    helperText={errors.content_de?.message}
                  />
                )}
              />
            </Grid>

            {/* Content EN */}
            <Grid item xs={12}>
              <Controller
                name="content_en"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Məzmun (İngilis dili)"
                    fullWidth
                    multiline
                    rows={6}
                    error={!!errors.content_en}
                    helperText={errors.content_en?.message}
                  />
                )}
              />
            </Grid>

            {/* Media URL */}
            <Grid item xs={12}>
              <Controller
                name="media_url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Media URL"
                    fullWidth
                    error={!!errors.media_url}
                    helperText={errors.media_url?.message || 'məs: https://example.com/image.jpg'}
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
