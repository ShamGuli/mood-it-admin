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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock API calls
async function fetchBrands() {
  return {
    items: [
      {
        id: '1',
        category: { name_de: 'Telefon' },
        name: 'Apple iPhone',
        slug: 'apple',
        logo_url: null,
        models_count: 15,
        display_order: 1,
        is_active: true,
      },
      {
        id: '2',
        category: { name_de: 'Telefon' },
        name: 'Samsung Galaxy',
        slug: 'samsung',
        logo_url: null,
        models_count: 12,
        display_order: 2,
        is_active: true,
      },
      {
        id: '3',
        category: { name_de: 'PlayStation' },
        name: 'Sony',
        slug: 'sony',
        logo_url: null,
        models_count: 4,
        display_order: 1,
        is_active: true,
      },
    ],
  };
}

async function fetchModels() {
  return {
    items: [
      {
        id: '1',
        brand: { name: 'Apple iPhone' },
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        release_year: 2023,
        display_order: 1,
        is_active: true,
      },
      {
        id: '2',
        brand: { name: 'Apple iPhone' },
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        release_year: 2023,
        display_order: 2,
        is_active: true,
      },
      {
        id: '3',
        brand: { name: 'Apple iPhone' },
        name: 'iPhone 15',
        slug: 'iphone-15',
        release_year: 2023,
        display_order: 3,
        is_active: true,
      },
      {
        id: '4',
        brand: { name: 'Samsung Galaxy' },
        name: 'Galaxy S24 Ultra',
        slug: 'galaxy-s24-ultra',
        release_year: 2024,
        display_order: 1,
        is_active: true,
      },
    ],
  };
}

export default function BrandsModelsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands', searchQuery, categoryFilter],
    queryFn: fetchBrands,
  });

  const { data: modelsData, isLoading: modelsLoading } = useQuery({
    queryKey: ['models', searchQuery],
    queryFn: fetchModels,
  });

  const handleDelete = (type: 'brand' | 'model', id: string) => {
    const message = type === 'brand' ? 'Marke wirklich löschen?' : 'Modell wirklich löschen?';
    if (confirm(message)) {
      toast.success(`${type === 'brand' ? 'Marke' : 'Modell'} gelöscht`);
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
          Marken & Modelle
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.info(`${activeTab === 0 ? 'Marke' : 'Modell'} hinzufügen Modal öffnen`)}
        >
          {activeTab === 0 ? 'Marke' : 'Modell'} hinzufügen
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Marken" />
          <Tab label="Modelle" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder={`${activeTab === 0 ? 'Marke' : 'Modell'} suchen...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            {activeTab === 0 && (
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
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 0 ? (
        /* Brands Table */
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Kategorie</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Modelle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brandsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Laden...
                    </TableCell>
                  </TableRow>
                ) : brandsData?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Keine Marken gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  brandsData?.items.map((brand) => (
                    <TableRow key={brand.id} hover>
                      <TableCell>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'grey.200',
                            color: 'grey.600',
                          }}
                        >
                          {brand.name.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {brand.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={brand.category.name_de}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={brand.slug} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${brand.models_count} Modelle`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={brand.is_active}
                          onChange={() => handleToggleActive(brand.id)}
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
                          onClick={() => handleDelete('brand', brand.id)}
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
      ) : (
        /* Models Table */
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Modell Name</TableCell>
                  <TableCell>Marke</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Release Jahr</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modelsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Laden...
                    </TableCell>
                  </TableRow>
                ) : modelsData?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Keine Modelle gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  modelsData?.items.map((model) => (
                    <TableRow key={model.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {model.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={model.brand.name}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={model.slug} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={model.release_year}
                          size="small"
                          color="default"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={model.is_active}
                          onChange={() => handleToggleActive(model.id)}
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
                          onClick={() => handleDelete('model', model.id)}
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
      )}
    </Box>
  );
}
