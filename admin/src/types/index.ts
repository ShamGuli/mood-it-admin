// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'technician' | 'customer';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name_de: string;
  name_en?: string;
  slug: string;
  icon: string;
  description_de?: string;
  description_en?: string;
  badge?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  category?: ServiceCategory;
  name_de: string;
  name_en?: string;
  slug: string;
  description_de?: string;
  description_en?: string;
  features?: string[];
  icon: string;
  duration?: string;
  price_min?: number;
  price_max?: number;
  price_display?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  category_id: string;
  category?: ServiceCategory;
  name: string;
  slug: string;
  logo_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Model {
  id: string;
  brand_id: string;
  brand?: Brand;
  name: string;
  slug: string;
  release_year?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_whatsapp?: string;
  category_id?: string;
  category?: ServiceCategory;
  brand_id?: string;
  brand?: Brand;
  model_id?: string;
  model?: Model;
  service_id?: string;
  service?: Service;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimated_price?: string;
  final_price?: number;
  booking_date?: string;
  confirmed_date?: string;
  completion_date?: string;
  customer_notes?: string;
  internal_notes?: string;
  assigned_to?: string;
  assigned_technician?: User;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: string;
  page_slug: string;
  section_key: string;
  content_de?: string;
  content_en?: string;
  content_type: 'text' | 'html' | 'json' | 'markdown';
  media_url?: string;
  metadata?: Record<string, unknown>;
  updated_by?: string;
  updated_at: string;
}

export interface Setting {
  key: string;
  value: string;
  value_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
  updated_by?: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown[];
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

// Form Types
export interface ServiceFormData {
  category_id: string;
  name_de: string;
  name_en?: string;
  slug: string;
  description_de?: string;
  description_en?: string;
  features?: string[];
  icon: string;
  duration?: string;
  price_min?: number;
  price_max?: number;
  price_display?: string;
  is_active: boolean;
}

export interface BookingFormData {
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_whatsapp?: string;
  category_id: string;
  brand_id?: string;
  model_id?: string;
  service_id: string;
  booking_date?: string;
  customer_notes?: string;
}

// Dashboard Statistics
export interface DashboardStats {
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    this_month: number;
    last_month: number;
    growth_percentage: number;
  };
  popular_services: Array<{
    service_id: string;
    service_name: string;
    booking_count: number;
  }>;
  bookings_trend: Array<{
    date: string;
    count: number;
  }>;
}
