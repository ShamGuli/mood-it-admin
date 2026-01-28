'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
  Label as LabelIcon,
  BookOnline as BookingIcon,
  Article as ContentIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 80;

const menuItems = [
  { title: 'İdarə Paneli', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Xidmətlər', icon: <BuildIcon />, path: '/dashboard/services' },
  { title: 'Kateqoriyalar', icon: <CategoryIcon />, path: '/dashboard/categories' },
  { title: 'Markalar və Modellər', icon: <LabelIcon />, path: '/dashboard/brands' },
  { title: 'Sifarişlər', icon: <BookingIcon />, path: '/dashboard/bookings' },
  { title: 'Məzmun', icon: <ContentIcon />, path: '/dashboard/content' },
  { title: 'Parametrlər', icon: <SettingsIcon />, path: '/dashboard/settings' },
  { title: 'İstifadəçilər', icon: <PeopleIcon />, path: '/dashboard/users' },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          boxSizing: 'border-box',
          background: '#1C1B2B',
          borderRight: '1px solid #3A3949',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          borderBottom: '1px solid #3A3949',
        }}
      >
        {open && (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            Mood IT
          </Box>
        )}
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Tooltip
              key={item.path}
              title={!open ? item.title : ''}
              placement="right"
            >
              <ListItem disablePadding sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  selected={isActive}
                  onClick={() => router.push(item.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: open ? 'flex-start' : 'center',
                    px: 2,
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                      borderLeft: '3px solid #8a4fff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? '#FFFFFF' : '#D1D1D1',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 400,
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    </Drawer>
  );
}
