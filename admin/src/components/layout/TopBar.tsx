'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Logout,
  Person,
  Settings as SettingsIcon,
  NavigateNext,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils/format';

interface TopBarProps {
  sidebarOpen: boolean;
}

export function TopBar({ sidebarOpen }: TopBarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      logout();
      toast.success('Uğurla çıxış edildi');
      router.push('/login');
    } catch (error) {
      toast.error('Çıxış zamanı xəta');
    }
    handleMenuClose();
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#252435',
        boxShadow: 'none',
        borderBottom: '1px solid #3A3949',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Breadcrumbs */}
        <Box sx={{ flex: 1 }}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ color: '#D1D1D1' }}
          >
            <Link
              href="/dashboard"
              underline="hover"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              İdarə Paneli
            </Link>
          </Breadcrumbs>
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user?.full_name || user?.email}
          </Typography>

          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                fontSize: '0.875rem',
              }}
            >
              {user ? getInitials(user.full_name || user.email) : 'A'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2">{user?.full_name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  background: user?.role === 'admin' ? '#8a4fff' : '#4185DD',
                  color: '#fff',
                  width: 'fit-content',
                  fontSize: '0.7rem',
                }}
              >
                {user?.role?.toUpperCase()}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profil
            </MenuItem>

            <MenuItem onClick={() => router.push('/dashboard/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Parametrlər
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Çıxış
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
