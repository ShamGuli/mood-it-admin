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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ContentCopy,
  Search,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock API call - replace with real API
async function fetchServices() {
  // Simulate API call
  return {
    items: [
      {
        id: '1',
        name_de: 'Display Tausch',
        category: { name_de: 'Telefon' },
        price_display: '€79-199',
        duration: '1-2 Stunden',
        is_active: true,
      },
      {
        id: '2',
        name_de: 'Akku Wechsel',
        category: { name_de: 'Telefon' },
        price_display: '€49-89',
        duration: '1 Stunde',
        is_active: true,
      },
    ],
    pagination: {
      total: 2,
      page: 1,
      total_pages: 1,
    },
  };
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['services', searchQuery, categoryFilter],
    queryFn: fetchServices,
  });

  const handleDelete = (id: string) => {
    // Show confirmation dialog
    if (confirm('Service wirklich löschen?')) {
      toast.success('Service gelöscht');
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
          Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.info('Service hinzufügen Modal öffnen')}
        >
          Service hinzufügen
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Service suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <TextField
              select
              label="Kategorie"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Alle Kategorien</MenuItem>
              <MenuItem value="phone">Telefon</MenuItem>
              <MenuItem value="playstation">PlayStation</MenuItem>
              <MenuItem value="macos">macOS</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell>Preis</TableCell>
                <TableCell>Dauer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Keine Services gefunden
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {service.name_de}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.category.name_de}
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                        }}
                      />
                    </TableCell>
                    <TableCell>{service.price_display}</TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell>
                      <Switch
                        checked={service.is_active}
                        onChange={() => handleToggleActive(service.id)}
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
                        onClick={() => toast.info('Duplizieren')}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(service.id)}
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
