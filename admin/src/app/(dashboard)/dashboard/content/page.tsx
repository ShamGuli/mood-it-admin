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
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Language,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ContentForm from '@/components/forms/ContentForm';

// ============================================
// API FUNCTIONS
// ============================================

async function fetchContentPages(searchQuery: string, pageFilter: string) {
  const params = new URLSearchParams();
  if (pageFilter && pageFilter !== 'all') {
    params.append('page_slug', pageFilter);
  }
  if (searchQuery && searchQuery.trim()) {
    params.append('search', searchQuery.trim());
  }

  const response = await fetch(`/api/v1/content?${params.toString()}`);
  if (!response.ok) throw new Error('Məzmun yüklənə bilmədi');
  const result = await response.json();
  return result.data;
}

// ============================================
// HELPERS
// ============================================

const CONTENT_TYPE_LABELS: Record<string, string> = {
  text: 'Mətn',
  html: 'HTML',
  markdown: 'Markdown',
  json: 'JSON',
};

function formatDateTime(dateString: string | null) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('az-AZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ContentPagesPage() {
  const queryClient = useQueryClient();

  // States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch content pages
  const { data, isLoading, error } = useQuery({
    queryKey: ['content-pages', searchQuery, pageFilter],
    queryFn: () => fetchContentPages(searchQuery, pageFilter),
  });

  // Extract unique page slugs for filter
  const pageOptions = Array.from(
    new Set(data?.items?.map((item: any) => item.page_slug) || [])
  ).sort();

  // ========== HANDLERS ==========
  const handleEdit = (content: any) => {
    setSelectedContent(content);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['content-pages'] });
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedContent(null);
  };

  const handleDelete = async (id: string, pageSlug: string, sectionKey: string) => {
    if (!confirm(`"${pageSlug} / ${sectionKey}" məzmununu silmək istədiyinizdən əminsiniz?`)) return;

    try {
      const response = await fetch(`/api/v1/content/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Silmə zamanı xəta');
      }

      toast.success('Məzmun uğurla silindi');
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
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
          Məzmun İdarəsi
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setFormOpen(true)}
        >
          Məzmun əlavə et
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Səhifə, bölmə və ya məzmun axtar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 300 }}
            />
            <TextField
              select
              label="Səhifə"
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Bütün səhifələr</MenuItem>
              {pageOptions.map((page: string) => (
                <MenuItem key={page} value={page}>
                  {page}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Səhifə</TableCell>
                <TableCell>Bölmə</TableCell>
                <TableCell>Məzmun (DE)</TableCell>
                <TableCell>Məzmun (EN)</TableCell>
                <TableCell>Tip</TableCell>
                <TableCell>Son yeniləmə</TableCell>
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
                    Heç bir məzmun tapılmadı
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((content: any) => (
                  <TableRow key={content.id} hover>
                    <TableCell>
                      <Chip
                        label={content.page_slug}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {content.section_key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {content.content_de || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {content.content_en || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={CONTENT_TYPE_LABELS[content.content_type] || content.content_type}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {formatDateTime(content.updated_at)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {content.updated_by_user?.full_name || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(content)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(content.id, content.page_slug, content.section_key)}
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

      {/* FORM */}
      <ContentForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        content={selectedContent}
      />
    </Box>
  );
}
