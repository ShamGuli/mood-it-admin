'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Save,
  Person,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils/format';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır').max(255),
  phone: z.string().max(50).optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (data) {
            setUser(data);
            reset({
              full_name: data.full_name || '',
              phone: data.phone || '',
            });
          }
        }
      } catch (error) {
        console.error('User fetch error:', error);
        toast.error('İstifadəçi məlumatları yüklənə bilmədi');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!user) return;

      const response = await fetch(`/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          role: user.role,
          is_active: user.is_active,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Yeniləmə zamanı xəta');
      }

      toast.success('Profil uğurla yeniləndi');
      setUser(result.data);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Yüklənir...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Profil
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: 48,
                }}
              >
                {getInitials(user?.full_name)}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user?.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  bgcolor: user?.role === 'admin' ? 'primary.main' : 'secondary.main',
                  color: 'white',
                  borderRadius: 1,
                  display: 'inline-block',
                }}
              >
                {user?.role === 'admin' ? 'Admin' : 'Texnik'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Profil Məlumatları
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* Email (readonly) */}
                  <Grid item xs={12}>
                    <TextField
                      label="E-poçt"
                      value={user?.email || ''}
                      fullWidth
                      disabled
                      helperText="E-poçt dəyişdirilə bilməz"
                    />
                  </Grid>

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

                  {/* Phone */}
                  <Grid item xs={12}>
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

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
