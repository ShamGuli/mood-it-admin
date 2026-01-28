'use client';

import { useState, useEffect } from 'react';
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
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CategoryForm from '@/components/forms/CategoryForm';

// Real API call
async function fetchCategories(searchQuery: string) {
  const params = new URLSearchParams();
  params.append('include_inactive', 'true'); // Admin paneldə hamısını göstər
  
  const response = await fetch(`/api/v1/categories?${params.toString()}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Kateqoriyaları yükləmək alınmadı');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error?.message || 'Kateqoriyaları yükləmək alınmadı');
  }
  
  // Client-side search filter
  let items = result.data.items;
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    items = items.filter((cat: any) => 
      cat.name_de?.toLowerCase().includes(query) ||
      cat.name_en?.toLowerCase().includes(query) ||
      cat.slug?.toLowerCase().includes(query)
    );
  }
  
  return { items };
}

export default function CategoriesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const queryClient = useQueryClient();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', searchQuery],
    queryFn: () => fetchCategories(searchQuery),
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kateqoriyasını silmək istədiyinizdən əminsiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/categories/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }

      toast.success(result.message || 'Kateqoriya uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Status yeniləmə zamanı xəta');
      }

      toast.success('Status uğurla yeniləndi');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const handleReorder = async (categoryId: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/v1/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: newOrder }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Sıralama yeniləmə zamanı xəta');
      }

      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error(error instanceof Error ? error.message : 'Xəta baş verdi');
    }
  };

  const moveUp = (category: any, index: number) => {
    if (index === 0) return;
    const prevCategory = data?.items[index - 1];
    if (prevCategory) {
      handleReorder(category.id, prevCategory.display_order);
      handleReorder(prevCategory.id, category.display_order);
      toast.success('Sıralama yeniləndi');
    }
  };

  const moveDown = (category: any, index: number) => {
    if (!data?.items || index === data.items.length - 1) return;
    const nextCategory = data.items[index + 1];
    if (nextCategory) {
      handleReorder(category.id, nextCategory.display_order);
      handleReorder(nextCategory.id, category.display_order);
      toast.success('Sıralama yeniləndi');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Xidmət Kateqoriyaları
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
        >
          Kateqoriya əlavə et
        </Button>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            placeholder="Kateqoriya axtar..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
                <TableCell width={80}>Sıra</TableCell>
                <TableCell>İkon</TableCell>
                <TableCell>Ad</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Nişan</TableCell>
                <TableCell>Təsvir</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Əməliyyatlar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: 'error.main' }}>
                    Kateqoriyaları yükləmə zamanı xəta: {error instanceof Error ? error.message : 'Naməlum xəta'}
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Heç bir kateqoriya tapılmadı
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((category, index) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 24 }}>
                          {category.display_order}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => moveUp(category, index)}
                            disabled={index === 0}
                            sx={{ p: 0.25 }}
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => moveDown(category, index)}
                            disabled={index === (data?.items.length || 0) - 1}
                            sx={{ p: 0.25 }}
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
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
                        onChange={() => handleToggleActive(category.id, category.is_active)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(category.id, category.name_de)}
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

      {/* Category Form Modal */}
      <CategoryForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        category={selectedCategory}
      />
    </Box>
  );
}
