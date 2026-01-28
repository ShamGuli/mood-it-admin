'use client';

import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  AdminPanelSettings,
  Build,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import UserForm from '@/components/forms/UserForm';
import { formatDateTime, getInitials } from '@/lib/utils/format';

// ============================================
// API FUNCTIONS
// ============================================

async function fetchUsers(searchQuery: string, roleFilter: string) {
  const params = new URLSearchParams();
  params.append('include_inactive', 'true');
  if (roleFilter && roleFilter !== 'all') {
    params.append('role', roleFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }

  const response = await fetch(`/api/v1/users?${params.toString()}`);
  if (!response.ok) throw new Error('İstifadəçilər yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

// ============================================
// HELPERS
// ============================================

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  technician: 'Texnik',
};

const ROLE_ICONS: Record<string, any> = {
  admin: AdminPanelSettings,
  technician: Build,
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function UsersPage() {
  const queryClient = useQueryClient();

  // States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', searchQuery, roleFilter],
    queryFn: () => fetchUsers(searchQuery, roleFilter),
  });

  // ========== HANDLERS ==========
  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Status yeniləmə zamanı xəta');
      }

      toast.success('Status uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleDelete = async (id: string, fullName: string) => {
    if (!confirm(`"${fullName}" istifadəçisini silmək istədiyinizdən əminsiniz?\n\nBu əməliyyat geri alına bilməz!`)) return;

    try {
      const response = await fetch(`/api/v1/users/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }

      toast.success('İstifadəçi uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  // ========== RENDER ==========
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          İstifadəçilər
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
        >
          İstifadəçi əlavə et
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Ad, e-poçt axtar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <TextField
              select
              label="Rol"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Hamısı</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="technician">Texnik</MenuItem>
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
                <TableCell>İstifadəçi</TableCell>
                <TableCell>E-poçt</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Qeydiyyat</TableCell>
                <TableCell align="right">Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
                    Xəta: {error instanceof Error ? error.message : 'Məlumatlar yüklənə bilmədi'}
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Heç bir istifadəçi tapılmadı
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((user: any) => {
                  const RoleIcon = ROLE_ICONS[user.role] || Build;
                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={user.avatar_url}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: user.role === 'admin' ? 'primary.main' : 'secondary.main',
                            }}
                          >
                            {getInitials(user.full_name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {user.full_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              ID: {user.id.slice(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<RoleIcon fontSize="small" />}
                          label={ROLE_LABELS[user.role] || user.role}
                          size="small"
                          color={user.role === 'admin' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Switch
                          checked={user.is_active}
                          onChange={() => handleToggleActive(user.id, user.is_active)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          {formatDateTime(user.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(user)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user.id, user.full_name)}
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

      {/* FORM */}
      <UserForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        user={selectedUser}
      />
    </Box>
  );
}
