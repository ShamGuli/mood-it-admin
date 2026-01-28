'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
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
  DragIndicator,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock API call - replace with real API
async function fetchCategories() {
  // Simulate API call
  return {
    items: [
      {
        id: '1',
        name_de: 'Telefon',
        slug: 'phone',
        icon: 'fa-solid fa-mobile',
        description_de: 'Smartphone Reparatur & Service',
        badge: 'Popular',
        display_order: 1,
        is_active: true,
      },
      {
        id: '2',
        name_de: 'PlayStation',
        slug: 'playstation',
        icon: 'fa-brands fa-playstation',
        description_de: 'PlayStation Konsolen Reparatur',
        badge: 'Hot',
        display_order: 2,
        is_active: true,
      },
      {
        id: '3',
        name_de: 'Apple macOS',
        slug: 'macos',
        icon: 'fa-brands fa-apple',
        description_de: 'MacBook & iMac Service',
        badge: null,
        display_order: 3,
        is_active: true,
      },
      {
        id: '4',
        name_de: 'Notebook & Laptops',
        slug: 'notebook',
        icon: 'fa-solid fa-laptop',
        description_de: 'Notebook Reparatur & Upgrade',
        badge: null,
        display_order: 4,
        is_active: true,
      },
      {
        id: '5',
        name_de: 'Desktop Computer',
        slug: 'desktop',
        icon: 'fa-solid fa-desktop',
        description_de: 'PC Reparatur & Service',
        badge: null,
        display_order: 5,
        is_active: true,
      },
    ],
    pagination: {
      total: 5,
      page: 1,
      total_pages: 1,
    },
  };
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['categories', searchQuery],
    queryFn: fetchCategories,
  });

  const handleDelete = (id: string) => {
    if (confirm('Kategorie wirklich löschen?')) {
      toast.success('Kategorie gelöscht');
    }
  };

  const handleToggleActive = (id: string) => {
    toast.success('Status aktualisiert');
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Service Kategorien
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.info('Kategorie hinzufügen Modal öffnen')}
        >
          Kategorie hinzufügen
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            placeholder="Kategorie suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            fullWidth
          />
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}>
                  <DragIndicator sx={{ color: 'text.disabled' }} />
                </TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Badge</TableCell>
                <TableCell>Beschreibung</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Keine Kategorien gefunden
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <IconButton size="small" sx={{ cursor: 'grab' }}>
                        <DragIndicator fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                        }}
                      >
                        <i className={category.icon} style={{ fontSize: 20 }} />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {category.name_de}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.slug}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {category.badge && (
                        <Chip
                          label={category.badge}
                          size="small"
                          color={category.badge === 'Popular' ? 'primary' : 'error'}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                        {category.description_de}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={category.is_active}
                        onChange={() => handleToggleActive(category.id)}
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
                        onClick={() => handleDelete(category.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
