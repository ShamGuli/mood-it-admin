'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Switch,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  AdminPanelSettings,
  Build,
  Person,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDateTime, getInitials } from '@/lib/utils/format';

// Mock API call
async function fetchUsers() {
  return {
    items: [
      {
        id: '1',
        email: 'admin@moodit.at',
        full_name: 'Admin User',
        role: 'admin',
        phone: '+994 50 555 55 55',
        avatar_url: null,
        is_active: true,
        last_login_at: '2026-01-28T14:30:00Z',
        created_at: '2026-01-28T09:17:17Z',
      },
      {
        id: '2',
        email: 'tech1@moodit.at',
        full_name: 'Max Techniker',
        role: 'technician',
        phone: '+994 50 123 45 67',
        avatar_url: null,
        is_active: true,
        last_login_at: '2026-01-27T16:45:00Z',
        created_at: '2026-01-20T10:00:00Z',
      },
      {
        id: '3',
        email: 'tech2@moodit.at',
        full_name: 'Anna Technikerin',
        role: 'technician',
        phone: '+994 55 987 65 43',
        avatar_url: null,
        is_active: true,
        last_login_at: '2026-01-28T09:15:00Z',
        created_at: '2026-01-22T14:30:00Z',
      },
      {
        id: '4',
        email: 'old.tech@moodit.at',
        full_name: 'Peter Alt',
        role: 'technician',
        phone: null,
        avatar_url: null,
        is_active: false,
        last_login_at: '2025-12-15T11:20:00Z',
        created_at: '2025-11-01T08:00:00Z',
      },
    ],
    pagination: {
      total: 4,
      page: 1,
      total_pages: 1,
    },
  };
}

const ROLE_CONFIG = {
  admin: {
    label: 'Administrator',
    icon: AdminPanelSettings,
    color: 'error' as const,
  },
  technician: {
    label: 'Techniker',
    icon: Build,
    color: 'primary' as const,
  },
  customer: {
    label: 'Kunde',
    icon: Person,
    color: 'default' as const,
  },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['users', searchQuery, roleFilter, statusFilter],
    queryFn: fetchUsers,
  });

  const handleDelete = (id: string) => {
    if (confirm('Benutzer wirklich löschen?')) {
      toast.success('Benutzer gelöscht');
    }
  };

  const handleToggleActive = (id: string) => {
    toast.success('Status aktualisiert');
  };

  const handleResetPassword = (email: string) => {
    toast.success(`Passwort-Reset-Link an ${email} gesendet`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Benutzerverwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.info('Benutzer hinzufügen Modal öffnen')}
        >
          Benutzer hinzufügen
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Benutzer suchen (Name, E-Mail)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <TextField
              select
              label="Rolle"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Alle Rollen</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="technician">Techniker</MenuItem>
              <MenuItem value="customer">Kunde</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Alle</MenuItem>
              <MenuItem value="active">Aktiv</MenuItem>
              <MenuItem value="inactive">Inaktiv</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Benutzer</TableCell>
                <TableCell>E-Mail</TableCell>
                <TableCell>Rolle</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Letzter Login</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Keine Benutzer gefunden
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((user) => {
                  const roleConfig = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG];
                  const RoleIcon = roleConfig.icon;

                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={user.avatar_url || undefined}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: user.role === 'admin' ? 'error.main' : 'primary.main',
                            }}
                          >
                            {getInitials(user.full_name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.full_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Erstellt: {formatDateTime(user.created_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<RoleIcon sx={{ fontSize: 16 }} />}
                          label={roleConfig.label}
                          size="small"
                          color={roleConfig.color}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.phone || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.last_login_at
                            ? formatDateTime(user.last_login_at)
                            : 'Noch nie'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={user.is_active}
                          onChange={() => handleToggleActive(user.id)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => toast.info('Bearbeiten')}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.role === 'admin'}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
