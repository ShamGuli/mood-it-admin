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
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import BrandForm from '@/components/forms/BrandForm';
import ModelForm from '@/components/forms/ModelForm';

// ============================================
// API FUNCTIONS
// ============================================

async function fetchBrands(searchQuery: string, categoryFilter: string) {
  const params = new URLSearchParams();
  params.append('include_inactive', 'true');
  if (categoryFilter && categoryFilter !== 'all') {
    params.append('category_id', categoryFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }

  const response = await fetch(`/api/v1/brands?${params.toString()}`);
  if (!response.ok) throw new Error('Markalar yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

async function fetchModels(searchQuery: string, brandFilter: string) {
  const params = new URLSearchParams();
  params.append('include_inactive', 'true');
  if (brandFilter && brandFilter !== 'all') {
    params.append('brand_id', brandFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }

  const response = await fetch(`/api/v1/models?${params.toString()}`);
  if (!response.ok) throw new Error('Modellər yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

async function fetchCategories() {
  const response = await fetch('/api/v1/categories?include_inactive=true');
  if (!response.ok) throw new Error('Kateqoriyalar yüklənə bilmədi');
  const result = await response.json();
  return result.data?.items || [];
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BrandsModelsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  
  // ========== BRANDS STATES ==========
  const [brandSearchInput, setBrandSearchInput] = useState('');
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  // ========== MODELS STATES ==========
  const [modelSearchInput, setModelSearchInput] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [modelFormOpen, setModelFormOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);

  // ========== DEBOUNCE ==========
  useEffect(() => {
    const timer = setTimeout(() => setBrandSearchQuery(brandSearchInput), 500);
    return () => clearTimeout(timer);
  }, [brandSearchInput]);

  useEffect(() => {
    const timer = setTimeout(() => setModelSearchQuery(modelSearchInput), 500);
    return () => clearTimeout(timer);
  }, [modelSearchInput]);

  // ========== QUERIES ==========
  const { data: brandsData, isLoading: brandsLoading, error: brandsError } = useQuery({
    queryKey: ['brands', brandSearchQuery, categoryFilter],
    queryFn: () => fetchBrands(brandSearchQuery, categoryFilter),
  });

  const { data: modelsData, isLoading: modelsLoading, error: modelsError } = useQuery({
    queryKey: ['models', modelSearchQuery, brandFilter],
    queryFn: () => fetchModels(modelSearchQuery, brandFilter),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: brandsForFilter } = useQuery({
    queryKey: ['brands-filter'],
    queryFn: () => fetchBrands('', 'all'),
  });

  // ========== BRAND HANDLERS ==========
  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`"${name}" markasını silmək istədiyinizdən əminsiniz?`)) return;
    try {
      const response = await fetch(`/api/v1/brands/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }
      toast.success('Marka uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleToggleBrandActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/brands/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Status yeniləmə zamanı xəta');
      }
      toast.success('Status uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleEditBrand = (brand: any) => {
    setSelectedBrand(brand);
    setBrandFormOpen(true);
  };

  const handleBrandFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

  const handleCloseBrandForm = () => {
    setBrandFormOpen(false);
    setSelectedBrand(null);
  };

  const handleReorderBrand = async (brandId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/v1/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newOrder }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Sıralama yeniləmə zamanı xəta');
      }
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const moveBrandUp = (brand: any, index: number) => {
    if (index === 0) return;
    const prevBrand = brandsData?.items[index - 1];
    if (prevBrand) {
      handleReorderBrand(brand.id, prevBrand.display_order);
      handleReorderBrand(prevBrand.id, brand.display_order);
      toast.success('Sıralama yeniləndi');
    }
  };

  const moveBrandDown = (brand: any, index: number) => {
    if (!brandsData?.items || index === brandsData.items.length - 1) return;
    const nextBrand = brandsData.items[index + 1];
    if (nextBrand) {
      handleReorderBrand(brand.id, nextBrand.display_order);
      handleReorderBrand(nextBrand.id, brand.display_order);
      toast.success('Sıralama yeniləndi');
    }
  };

  // ========== MODEL HANDLERS ==========
  const handleDeleteModel = async (id: string, name: string) => {
    if (!confirm(`"${name}" modelini silmək istədiyinizdən əminsiniz?`)) return;
    try {
      const response = await fetch(`/api/v1/models/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }
      toast.success('Model uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['models'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleToggleModelActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/models/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Status yeniləmə zamanı xəta');
      }
      toast.success('Status uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['models'] });
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleEditModel = (model: any) => {
    setSelectedModel(model);
    setModelFormOpen(true);
  };

  const handleModelFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['models'] });
  };

  const handleCloseModelForm = () => {
    setModelFormOpen(false);
    setSelectedModel(null);
  };

  const handleReorderModel = async (modelId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/v1/models/${modelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newOrder }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Sıralama yeniləmə zamanı xəta');
      }
      queryClient.invalidateQueries({ queryKey: ['models'] });
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const moveModelUp = (model: any, index: number) => {
    if (index === 0) return;
    const prevModel = modelsData?.items[index - 1];
    if (prevModel) {
      handleReorderModel(model.id, prevModel.display_order);
      handleReorderModel(prevModel.id, model.display_order);
      toast.success('Sıralama yeniləndi');
    }
  };

  const moveModelDown = (model: any, index: number) => {
    if (!modelsData?.items || index === modelsData.items.length - 1) return;
    const nextModel = modelsData.items[index + 1];
    if (nextModel) {
      handleReorderModel(model.id, nextModel.display_order);
      handleReorderModel(nextModel.id, model.display_order);
      toast.success('Sıralama yeniləndi');
    }
  };

  // ========== RENDER ==========
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Markalar və Modellər
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => activeTab === 0 ? setBrandFormOpen(true) : setModelFormOpen(true)}
        >
          {activeTab === 0 ? 'Marka' : 'Model'} əlavə et
        </Button>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Markalar" />
          <Tab label="Modellər" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder={`${activeTab === 0 ? 'Marka' : 'Model'} axtar...`}
              value={activeTab === 0 ? brandSearchInput : modelSearchInput}
              onChange={(e) => activeTab === 0 ? setBrandSearchInput(e.target.value) : setModelSearchInput(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            {activeTab === 0 ? (
              <TextField
                select
                label="Kateqoriya"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">Bütün kateqoriyalar</MenuItem>
                {categories?.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name_de}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                select
                label="Marka"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">Bütün markalar</MenuItem>
                {brandsForFilter?.items?.map((brand: any) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 0 ? (
        /* ==================== BRANDS TABLE ==================== */
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={80}>Sıra</TableCell>
                  <TableCell>Logo</TableCell>
                  <TableCell>Ad</TableCell>
                  <TableCell>Kateqoriya</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Əməliyyatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brandsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : brandsError ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
                      Xəta: {brandsError instanceof Error ? brandsError.message : 'Məlumatlar yüklənə bilmədi'}
                    </TableCell>
                  </TableRow>
                ) : brandsData?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Heç bir marka tapılmadı
                    </TableCell>
                  </TableRow>
                ) : (
                  brandsData?.items.map((brand: any, index: number) => (
                    <TableRow key={brand.id} hover>
                      {/* Sıra */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 24 }}>
                            {brand.display_order}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => moveBrandUp(brand, index)}
                              disabled={index === 0}
                              sx={{ p: 0.25 }}
                            >
                              <ArrowUpward fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => moveBrandDown(brand, index)}
                              disabled={index === (brandsData?.items.length || 0) - 1}
                              sx={{ p: 0.25 }}
                            >
                              <ArrowDownward fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </TableCell>
                      {/* Logo */}
                      <TableCell>
                        <Avatar
                          src={brand.logo_url}
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
                      {/* Ad */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {brand.name}
                        </Typography>
                      </TableCell>
                      {/* Kateqoriya */}
                      <TableCell>
                        <Chip
                          label={brand.category?.name_de || '-'}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                          }}
                        />
                      </TableCell>
                      {/* Slug */}
                      <TableCell>
                        <Chip label={brand.slug} size="small" variant="outlined" />
                      </TableCell>
                      {/* Status */}
                      <TableCell>
                        <Switch
                          checked={brand.is_active}
                          onChange={() => handleToggleBrandActive(brand.id, brand.is_active)}
                          size="small"
                        />
                      </TableCell>
                      {/* Actions */}
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleEditBrand(brand)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteBrand(brand.id, brand.name)}
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
        /* ==================== MODELS TABLE ==================== */
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={80}>Sıra</TableCell>
                  <TableCell>Model Adı</TableCell>
                  <TableCell>Marka</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Buraxılış ili</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Əməliyyatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modelsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : modelsError ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>
                      Xəta: {modelsError instanceof Error ? modelsError.message : 'Məlumatlar yüklənə bilmədi'}
                    </TableCell>
                  </TableRow>
                ) : modelsData?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Heç bir model tapılmadı
                    </TableCell>
                  </TableRow>
                ) : (
                  modelsData?.items.map((model: any, index: number) => (
                    <TableRow key={model.id} hover>
                      {/* Sıra */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 24 }}>
                            {model.display_order}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => moveModelUp(model, index)}
                              disabled={index === 0}
                              sx={{ p: 0.25 }}
                            >
                              <ArrowUpward fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => moveModelDown(model, index)}
                              disabled={index === (modelsData?.items.length || 0) - 1}
                              sx={{ p: 0.25 }}
                            >
                              <ArrowDownward fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </TableCell>
                      {/* Model Adı */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {model.name}
                        </Typography>
                      </TableCell>
                      {/* Marka */}
                      <TableCell>
                        <Chip
                          label={model.brand?.name || '-'}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #4185DD, #B42FDA)',
                          }}
                        />
                      </TableCell>
                      {/* Slug */}
                      <TableCell>
                        <Chip label={model.slug} size="small" variant="outlined" />
                      </TableCell>
                      {/* Buraxılış ili */}
                      <TableCell>
                        {model.release_year || '-'}
                      </TableCell>
                      {/* Status */}
                      <TableCell>
                        <Switch
                          checked={model.is_active}
                          onChange={() => handleToggleModelActive(model.id, model.is_active)}
                          size="small"
                        />
                      </TableCell>
                      {/* Actions */}
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => handleEditModel(model)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteModel(model.id, model.name)}
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

      {/* FORMS */}
      <BrandForm
        open={brandFormOpen}
        onClose={handleCloseBrandForm}
        onSuccess={handleBrandFormSuccess}
        brand={selectedBrand}
      />
      <ModelForm
        open={modelFormOpen}
        onClose={handleCloseModelForm}
        onSuccess={handleModelFormSuccess}
        model={selectedModel}
      />
    </Box>
  );
}
