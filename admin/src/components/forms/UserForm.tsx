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
import { toast } from 'sonner';

// Zod schema for create
const createUserSchema = z.object({
  email: z.string().email('Yanlış e-poçt ünvanı'),
  password: z.string().min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
  full_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
  role: z.enum(['admin', 'technician']),
  phone: z.string().max(50).optional().or(z.literal('')),
  is_active: z.boolean(),
});

// Zod schema for edit (no password, no email change)
const editUserSchema = z.object({
  full_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
  role: z.enum(['admin', 'technician']),
  phone: z.string().max(50).optional().or(z.literal('')),
  is_active: z.boolean(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any | null;
}

export default function UserForm({ open, onClose, onSuccess, user }: UserFormProps) {
  const isEditMode = !!user;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData | EditUserFormData>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: isEditMode
      ? {
          full_name: '',
          role: 'technician' as const,
          phone: '',
          is_active: true,
        }
      : {
          email: '',
          password: '',
          full_name: '',
          role: 'technician' as const,
          phone: '',
          is_active: true,
        },
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (user && open) {
      reset({
        full_name: user.full_name || '',
        role: user.role || 'technician',
        phone: user.phone || '',
        is_active: user.is_active ?? true,
      });
    } else if (!user && open) {
      reset({
        email: '',
        password: '',
        full_name: '',
        role: 'technician',
        phone: '',
        is_active: true,
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: CreateUserFormData | EditUserFormData) => {
    try {
      const url = isEditMode ? `/api/v1/users/${user.id}` : '/api/v1/users';
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

      toast.success(isEditMode ? 'İstifadəçi uğurla yeniləndi' : 'İstifadəçi uğurla yaradıldı');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Form submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEditMode ? 'İstifadəçini redaktə et' : 'Yeni İstifadəçi əlavə et'}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Email (only for create) */}
            {!isEditMode && (
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="E-poçt *"
                      type="email"
                      fullWidth
                      required
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
            )}

            {/* Password (only for create) */}
            {!isEditMode && (
              <Grid item xs={12}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Şifrə *"
                      type="password"
                      fullWidth
                      required
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </Grid>
            )}

            {/* Full Name */}
            <Grid item xs={12}>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ad Soyad *"
                    fullWidth
                    required
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                  />
                )}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} md={6}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Rol *"
                    fullWidth
                    required
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="technician">Texnik</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Telefon"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
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
