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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Language,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils/format';

// Mock API call
async function fetchContentPages() {
  return {
    items: [
      {
        id: '1',
        page_slug: 'home',
        section_key: 'hero_title',
        content_de: 'Professioneller Reparatur-Service',
        content_en: 'Professional Repair Service',
        content_type: 'text',
        updated_at: '2026-01-28T10:00:00Z',
        updated_by: { full_name: 'Admin User' },
      },
      {
        id: '2',
        page_slug: 'home',
        section_key: 'hero_subtitle',
        content_de: 'Schnell, zuverlässig und günstig',
        content_en: 'Fast, reliable and affordable',
        content_type: 'text',
        updated_at: '2026-01-28T09:30:00Z',
        updated_by: { full_name: 'Admin User' },
      },
      {
        id: '3',
        page_slug: 'about',
        section_key: 'company_description',
        content_de: 'Wir sind Ihr zuverlässiger Partner für Reparaturen aller Art...',
        content_en: 'We are your reliable partner for repairs of all kinds...',
        content_type: 'html',
        updated_at: '2026-01-27T14:20:00Z',
        updated_by: { full_name: 'Admin User' },
      },
      {
        id: '4',
        page_slug: 'contact',
        section_key: 'business_hours',
        content_de: 'Mo-Fr: 9:00-18:00 Uhr',
        content_en: 'Mon-Fri: 9:00-18:00',
        content_type: 'text',
        updated_at: '2026-01-26T11:00:00Z',
        updated_by: { full_name: 'Admin User' },
      },
    ],
    pagination: {
      total: 4,
      page: 1,
      total_pages: 1,
    },
  };
}

const CONTENT_TYPE_COLORS = {
  text: 'default',
  html: 'primary',
  json: 'secondary',
  markdown: 'info',
} as const;

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageFilter, setPageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['content', searchQuery, pageFilter, typeFilter],
    queryFn: fetchContentPages,
  });

  const handleDelete = (id: string) => {
    if (confirm('Content wirklich löschen?')) {
      toast.success('Content gelöscht');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Content Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => toast.info('Content hinzufügen Modal öffnen')}
        >
          Content hinzufügen
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Content suchen (Seite, Section)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <TextField
              select
              label="Seite"
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Alle Seiten</MenuItem>
              <MenuItem value="home">Home</MenuItem>
              <MenuItem value="about">Über uns</MenuItem>
              <MenuItem value="services">Services</MenuItem>
              <MenuItem value="contact">Kontakt</MenuItem>
            </TextField>
            <TextField
              select
              label="Typ"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">Alle Typen</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
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
                <TableCell>Seite / Section</TableCell>
                <TableCell>Content (DE)</TableCell>
                <TableCell>Content (EN)</TableCell>
                <TableCell>Typ</TableCell>
                <TableCell>Zuletzt bearbeitet</TableCell>
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
                    Kein Content gefunden
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((content) => (
                  <TableRow key={content.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {content.page_slug}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {content.section_key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: 250 }}
                      >
                        {content.content_de}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Language fontSize="small" sx={{ color: 'text.secondary' }} />
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 250 }}
                        >
                          {content.content_en || '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={content.content_type}
                        size="small"
                        color={CONTENT_TYPE_COLORS[content.content_type as keyof typeof CONTENT_TYPE_COLORS]}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(content.updated_at)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        von {content.updated_by?.full_name}
                      </Typography>
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
                        onClick={() => handleDelete(content.id)}
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
