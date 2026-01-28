'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Save,
  Business,
  Email,
  Phone,
  Public,
  Security,
  Notifications,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const settingsSchema = z.object({
  business_name: z.string().min(1, 'Geschäftsname ist erforderlich'),
  business_email: z.string().email('Ungültige E-Mail'),
  business_phone: z.string().min(1, 'Telefonnummer ist erforderlich'),
  business_whatsapp: z.string().optional(),
  business_address: z.string().optional(),
  website_url: z.string().url('Ungültige URL').optional().or(z.literal('')),
  booking_confirmation_email: z.boolean(),
  booking_reminder_email: z.boolean(),
  booking_reminder_hours: z.number().min(1).max(48),
  maintenance_mode: z.boolean(),
  allow_online_booking: z.boolean(),
  require_email_verification: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      business_name: 'Mood IT',
      business_email: 'info@moodit.at',
      business_phone: '+994 50 555 55 55',
      business_whatsapp: '+994 55 220 10 18',
      business_address: 'Musterstraße 123, 1010 Wien, Österreich',
      website_url: 'https://moodit.at',
      booking_confirmation_email: true,
      booking_reminder_email: true,
      booking_reminder_hours: 24,
      maintenance_mode: false,
      allow_online_booking: true,
      require_email_verification: false,
    },
  });

  const maintenanceMode = watch('maintenance_mode');

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Einstellungen erfolgreich gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern der Einstellungen');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Einstellungen
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {isSaving ? 'Speichern...' : 'Speichern'}
        </Button>
      </Box>

      {maintenanceMode && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Wartungsmodus ist aktiviert. Die Website ist für Besucher nicht erreichbar.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Business Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Business color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Geschäftsinformationen
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Geschäftsname"
                    fullWidth
                    {...register('business_name')}
                    error={!!errors.business_name}
                    helperText={errors.business_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Website URL"
                    fullWidth
                    {...register('website_url')}
                    error={!!errors.website_url}
                    helperText={errors.website_url?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Geschäftsadresse"
                    fullWidth
                    multiline
                    rows={2}
                    {...register('business_address')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Phone color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Kontaktinformationen
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="E-Mail"
                    type="email"
                    fullWidth
                    {...register('business_email')}
                    error={!!errors.business_email}
                    helperText={errors.business_email?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Telefon"
                    fullWidth
                    {...register('business_phone')}
                    error={!!errors.business_phone}
                    helperText={errors.business_phone?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="WhatsApp"
                    fullWidth
                    {...register('business_whatsapp')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Notifications color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  E-Mail Benachrichtigungen
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      {...register('booking_confirmation_email')}
                      defaultChecked
                    />
                  }
                  label="Buchungsbestätigung senden"
                />
                <FormControlLabel
                  control={
                    <Switch
                      {...register('booking_reminder_email')}
                      defaultChecked
                    />
                  }
                  label="Terminerinnerung senden"
                />
                <TextField
                  label="Erinnerung (Stunden vor Termin)"
                  type="number"
                  fullWidth
                  {...register('booking_reminder_hours', { valueAsNumber: true })}
                  error={!!errors.booking_reminder_hours}
                  helperText={errors.booking_reminder_hours?.message}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Security color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Systemeinstellungen
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch {...register('maintenance_mode')} />}
                  label="Wartungsmodus"
                />
                <Divider />
                <FormControlLabel
                  control={
                    <Switch
                      {...register('allow_online_booking')}
                      defaultChecked
                    />
                  }
                  label="Online-Buchungen erlauben"
                />
                <FormControlLabel
                  control={<Switch {...register('require_email_verification')} />}
                  label="E-Mail-Verifizierung erforderlich"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
