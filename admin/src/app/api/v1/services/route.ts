import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// GET /api/v1/services - List all services
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category_id = searchParams.get('category_id');
    const is_active = searchParams.get('is_active');
    const search = searchParams.get('search');
    const order_by = searchParams.get('order_by') || 'created_at';
    const order_direction = searchParams.get('order_direction') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Build query
    let query = supabase
      .from('services')
      .select(`
        *,
        category:service_categories(id, name_de, slug)
      `, { count: 'exact' });
    
    // Filters
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    
    if (is_active) {
      query = query.eq('is_active', is_active === 'true');
    }
    
    // Search by name (German or English)
    if (search) {
      query = query.or(`name_de.ilike.%${search}%,name_en.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    
    // Ordering
    const validOrderBy = ['created_at', 'updated_at', 'name_de', 'display_order'];
    const orderColumn = validOrderBy.includes(order_by) ? order_by : 'created_at';
    const orderAsc = order_direction === 'asc';
    query = query.order(orderColumn, { ascending: orderAsc });
    
    // Pagination
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        items: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST /api/v1/services - Create new service
const createServiceSchema = z.object({
  category_id: z.string().uuid(),
  name_de: z.string().min(3).max(255),
  name_en: z.string().max(255).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description_de: z.string().optional(),
  description_en: z.string().optional(),
  features: z.array(z.string()).optional(),
  icon: z.string(),
  duration: z.string().optional(),
  price_min: z.number().positive().optional(),
  price_max: z.number().positive().optional(),
  price_display: z.string().optional(),
  is_active: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }
    
    // Parse and validate body
    const body = await request.json();
    const validated = createServiceSchema.parse(body);
    
    // Check if slug already exists
    const { data: existing } = await supabase
      .from('services')
      .select('id')
      .eq('slug', validated.slug)
      .single();
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'DUPLICATE_SLUG', message: 'Slug already exists' } },
        { status: 409 }
      );
    }
    
    // Insert service
    const { data, error } = await supabase
      .from('services')
      .insert(validated)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'DB_ERROR', message: error.message } },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, data, message: 'Service erfolgreich erstellt' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: error.errors } },
        { status: 400 }
      );
    }
    
    console.error('Services POST error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
