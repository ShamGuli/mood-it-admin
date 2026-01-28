# 🗄️ Database Schema - Mood IT

**Version:** 1.0.0  
**Database:** Supabase (PostgreSQL 15)  
**Last Updated:** January 28, 2026

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Indexes](#indexes)
5. [Row Level Security (RLS)](#row-level-security)
6. [Migrations](#migrations)
7. [Seed Data](#seed-data)

---

## 1. OVERVIEW

The database consists of **8 core tables** managing:
- User authentication and roles
- Service catalog (categories, brands, models, services)
- Customer bookings/orders
- Dynamic content management
- System settings

**Key Features:**
- UUID primary keys for security
- Timestamps for audit trails
- Soft deletes (is_active flags)
- JSONB for flexible data (features, metadata)
- Full-text search support

---

## 2. ENTITY RELATIONSHIP DIAGRAM

```
┌─────────────┐
│    users    │
└─────────────┘
      │
      │
      ▼
┌─────────────────┐         ┌──────────────────┐
│ service_        │◄────────┤    services      │
│ categories      │         └──────────────────┘
└─────────────────┘                │
      │                            │
      │                            │
      ▼                            │
┌─────────────┐                   │
│   brands    │                   │
└─────────────┘                   │
      │                            │
      │                            │
      ▼                            │
┌─────────────┐                   │
│   models    │                   │
└─────────────┘                   │
      │                            │
      │         ┌──────────────────┘
      │         │
      │         │
      ▼         ▼
┌─────────────────────────┐
│      bookings           │
└─────────────────────────┘

┌─────────────────┐       ┌──────────────┐
│ content_pages   │       │   settings   │
└─────────────────┘       └──────────────┘
```

---

## 3. TABLE DEFINITIONS

### 3.1 `users`
Stores admin and technician accounts.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'technician', 'customer')),
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
```

**Fields:**
- `id` - Unique identifier (UUID)
- `email` - Login email (unique)
- `password_hash` - Bcrypt hashed password
- `full_name` - Display name
- `role` - User role (admin/technician/customer)
- `phone` - Contact phone
- `avatar_url` - Profile picture URL
- `is_active` - Account status
- `last_login_at` - Last login timestamp
- `created_at` - Account creation date
- `updated_at` - Last update timestamp

---

### 3.2 `service_categories`
Main service categories (Telefon, PlayStation, macOS, etc.)

```sql
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_de VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(100) NOT NULL, -- FontAwesome class (e.g., 'fa-solid fa-mobile')
  description_de TEXT,
  description_en TEXT,
  badge VARCHAR(50), -- e.g., 'Beliebt', 'Neu'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_service_categories_updated_at
BEFORE UPDATE ON service_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_categories_slug ON service_categories(slug);
CREATE INDEX idx_categories_active ON service_categories(is_active);
CREATE INDEX idx_categories_order ON service_categories(display_order);
```

**Example Data:**
```sql
INSERT INTO service_categories (name_de, name_en, slug, icon, description_de) VALUES
('Telefon', 'Phone', 'phone', 'fa-solid fa-mobile', 'Smartphone Reparatur'),
('PlayStation', 'PlayStation', 'playstation', 'fa-brands fa-playstation', 'PlayStation Reparatur');
```

---

### 3.3 `services`
Individual services (Display replacement, Battery replacement, etc.)

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name_de VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  slug VARCHAR(100) UNIQUE NOT NULL,
  description_de TEXT,
  description_en TEXT,
  features JSONB DEFAULT '[]'::jsonb, -- ["Feature 1", "Feature 2"]
  icon VARCHAR(100) NOT NULL, -- FontAwesome class
  duration VARCHAR(50), -- "1-2 Stunden", "3-5 Tage"
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  price_display VARCHAR(50), -- "€49-99" or "ab €49"
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_services_order ON services(display_order);

-- Full-text search
CREATE INDEX idx_services_search ON services USING GIN (
  to_tsvector('german', name_de || ' ' || COALESCE(description_de, ''))
);
```

**Example Data:**
```sql
INSERT INTO services (category_id, name_de, slug, description_de, features, icon, duration, price_min, price_max, price_display) VALUES
(
  (SELECT id FROM service_categories WHERE slug = 'phone'),
  'Display Tausch',
  'display-replacement',
  'Professioneller Austausch des Displays',
  '["Original Teile", "12 Monate Garantie", "Express Service"]'::jsonb,
  'fa-solid fa-mobile-screen',
  '1-2 Stunden',
  79.00,
  199.00,
  '€79-199'
);
```

---

### 3.4 `brands`
Device brands (Apple, Samsung, HP, etc.)

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Composite unique constraint (category + slug)
CREATE UNIQUE INDEX idx_brands_category_slug ON brands(category_id, slug);

-- Indexes
CREATE INDEX idx_brands_category ON brands(category_id);
CREATE INDEX idx_brands_active ON brands(is_active);
```

**Example Data:**
```sql
INSERT INTO brands (category_id, name, slug) VALUES
((SELECT id FROM service_categories WHERE slug = 'phone'), 'Apple iPhone', 'apple'),
((SELECT id FROM service_categories WHERE slug = 'phone'), 'Samsung Galaxy', 'samsung');
```

---

### 3.5 `models`
Device models (iPhone 15 Pro, Galaxy S24, etc.)

```sql
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  release_year INTEGER,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Composite unique constraint (brand + slug)
CREATE UNIQUE INDEX idx_models_brand_slug ON models(brand_id, slug);

-- Indexes
CREATE INDEX idx_models_brand ON models(brand_id);
CREATE INDEX idx_models_active ON models(is_active);
```

**Example Data:**
```sql
INSERT INTO models (brand_id, name, slug, release_year) VALUES
(
  (SELECT id FROM brands WHERE slug = 'apple' LIMIT 1),
  'iPhone 15 Pro',
  'iphone-15-pro',
  2023
);
```

---

### 3.6 `bookings`
Customer service bookings/orders

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'BOOK-20260128-0001'
  
  -- Customer Info
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  customer_whatsapp VARCHAR(50),
  
  -- Device & Service Selection
  category_id UUID REFERENCES service_categories(id),
  brand_id UUID REFERENCES brands(id),
  model_id UUID REFERENCES models(id),
  service_id UUID REFERENCES services(id),
  
  -- Booking Details
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  estimated_price VARCHAR(50), -- "€79-199"
  final_price DECIMAL(10,2),
  
  -- Dates
  booking_date TIMESTAMP, -- Preferred appointment date
  confirmed_date TIMESTAMP, -- Actual confirmed date
  completion_date TIMESTAMP, -- When service completed
  
  -- Notes
  customer_notes TEXT, -- Customer's message
  internal_notes TEXT, -- Admin/technician notes
  
  -- Assignment
  assigned_to UUID REFERENCES users(id), -- Technician
  
  -- Metadata
  source VARCHAR(50) DEFAULT 'website', -- 'website', 'phone', 'walk-in'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE
  date_part VARCHAR(8);
  sequence_part VARCHAR(4);
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  
  SELECT LPAD(CAST(COUNT(*) + 1 AS VARCHAR), 4, '0')
  INTO sequence_part
  FROM bookings
  WHERE DATE(created_at) = DATE(NOW());
  
  NEW.booking_number := 'BOOK-' || date_part || '-' || sequence_part;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_number
BEFORE INSERT ON bookings
FOR EACH ROW
WHEN (NEW.booking_number IS NULL)
EXECUTE FUNCTION generate_booking_number();

-- Indexes
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_phone ON bookings(customer_phone);
CREATE INDEX idx_bookings_category ON bookings(category_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_assigned ON bookings(assigned_to);
CREATE INDEX idx_bookings_created_date ON bookings(created_at DESC);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);

-- Full-text search
CREATE INDEX idx_bookings_search ON bookings USING GIN (
  to_tsvector('german', customer_name || ' ' || COALESCE(customer_phone, '') || ' ' || COALESCE(customer_email, ''))
);
```

---

### 3.7 `content_pages`
Dynamic CMS content for website pages

```sql
CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug VARCHAR(100) NOT NULL, -- 'home', 'about', 'contact', 'service-smartphone'
  section_key VARCHAR(100) NOT NULL, -- 'hero_title', 'about_description'
  content_de TEXT,
  content_en TEXT,
  content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'json', 'markdown')),
  media_url VARCHAR(500), -- Image/video URL
  metadata JSONB DEFAULT '{}'::jsonb, -- SEO, custom fields
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Composite unique constraint
CREATE UNIQUE INDEX idx_content_page_section ON content_pages(page_slug, section_key);

-- Indexes
CREATE INDEX idx_content_page ON content_pages(page_slug);
CREATE INDEX idx_content_updated ON content_pages(updated_at DESC);
```

**Example Data:**
```sql
INSERT INTO content_pages (page_slug, section_key, content_de, content_type) VALUES
('home', 'hero_title', 'Professioneller Tech-Service in Wels', 'text'),
('home', 'hero_subtitle', 'Reparatur von Smartphones, Notebooks, Gaming-Konsolen & mehr', 'text');
```

---

### 3.8 `settings`
System-wide settings (key-value store)

```sql
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  value_type VARCHAR(50) DEFAULT 'string' CHECK (value_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Can be accessed by public API
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Example Data:**
```sql
INSERT INTO settings (key, value, value_type, description, is_public) VALUES
('business_name', 'Mood IT', 'string', 'Company name', true),
('business_phone', '+43 123456789', 'string', 'Contact phone', true),
('business_email', 'info@moodit.at', 'string', 'Contact email', true),
('business_whatsapp', '+994 55 220 10 18', 'string', 'WhatsApp number', true),
('business_address', 'Wels, Österreich', 'string', 'Physical address', true),
('working_hours', '{"monday": "09:00-18:00", "tuesday": "09:00-18:00"}', 'json', 'Business hours', true),
('booking_email_enabled', 'true', 'boolean', 'Send booking confirmation emails', false),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', false);
```

---

## 4. INDEXES

### Performance Indexes
Already defined above in table definitions.

### Additional Composite Indexes
```sql
-- Bookings by status and date (for dashboard)
CREATE INDEX idx_bookings_status_date ON bookings(status, created_at DESC);

-- Services by category and active status
CREATE INDEX idx_services_category_active ON services(category_id, is_active);

-- Models by brand and active status
CREATE INDEX idx_models_brand_active ON models(brand_id, is_active);
```

---

## 5. ROW LEVEL SECURITY (RLS)

### Enable RLS on all tables
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
```

### Policies

#### Public Read Access (for active items)
```sql
-- Categories (public can view active categories)
CREATE POLICY "Public read active categories" ON service_categories
  FOR SELECT USING (is_active = true);

-- Services (public can view active services)
CREATE POLICY "Public read active services" ON services
  FOR SELECT USING (is_active = true);

-- Brands (public can view active brands)
CREATE POLICY "Public read active brands" ON brands
  FOR SELECT USING (is_active = true);

-- Models (public can view active models)
CREATE POLICY "Public read active models" ON models
  FOR SELECT USING (is_active = true);

-- Settings (public can view public settings)
CREATE POLICY "Public read public settings" ON settings
  FOR SELECT USING (is_public = true);
```

#### Authenticated Users (Admin/Technician)
```sql
-- Full access for admins
CREATE POLICY "Admins full access categories" ON service_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = true
    )
  );

CREATE POLICY "Admins full access services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = true
    )
  );

-- Similar policies for other tables...

-- Bookings: Technicians can read/update assigned bookings
CREATE POLICY "Technicians read own bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'admin' OR (users.role = 'technician' AND bookings.assigned_to = auth.uid()))
      AND users.is_active = true
    )
  );

CREATE POLICY "Technicians update own bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND (users.role = 'admin' OR (users.role = 'technician' AND bookings.assigned_to = auth.uid()))
      AND users.is_active = true
    )
  );
```

#### Public Booking Creation
```sql
-- Anyone can create a booking (public form submission)
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);
```

---

## 6. MIGRATIONS

### Migration File Structure
```
migrations/
├── 001_create_users_table.sql
├── 002_create_service_categories_table.sql
├── 003_create_services_table.sql
├── 004_create_brands_models_tables.sql
├── 005_create_bookings_table.sql
├── 006_create_content_pages_table.sql
├── 007_create_settings_table.sql
├── 008_create_indexes.sql
├── 009_enable_rls.sql
└── 010_seed_initial_data.sql
```

### Apply Migrations (Supabase CLI)
```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

---

## 7. SEED DATA

### Seed Script: `migrations/010_seed_initial_data.sql`

```sql
-- 1. Create admin user (password: Admin123!)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@moodit.at', '$2a$10$...', 'Admin User', 'admin');

-- 2. Service Categories
INSERT INTO service_categories (name_de, slug, icon, description_de, display_order) VALUES
('Telefon', 'phone', 'fa-solid fa-mobile', 'Smartphone Reparatur & Service', 1),
('PlayStation', 'playstation', 'fa-brands fa-playstation', 'PlayStation Konsolen Reparatur', 2),
('Apple macOS', 'macos', 'fa-brands fa-apple', 'MacBook & iMac Service', 3),
('Notebook & Laptops', 'notebook', 'fa-solid fa-laptop', 'Notebook Reparatur & Upgrade', 4),
('Desktop Computer', 'desktop', 'fa-solid fa-desktop', 'PC Reparatur & Service', 5),
('GPU Service', 'gpu', 'fa-solid fa-microchip', 'Grafikkarten Reparatur', 6),
('Xbox Series', 'xbox', 'fa-brands fa-xbox', 'Xbox Konsolen Reparatur', 7);

-- 3. Brands (Phone category)
INSERT INTO brands (category_id, name, slug, display_order) VALUES
((SELECT id FROM service_categories WHERE slug = 'phone'), 'Apple iPhone', 'apple', 1),
((SELECT id FROM service_categories WHERE slug = 'phone'), 'Samsung Galaxy', 'samsung', 2),
((SELECT id FROM service_categories WHERE slug = 'phone'), 'Andere Marken', 'other', 3);

-- 4. Models (iPhone)
INSERT INTO models (brand_id, name, slug, release_year, display_order) VALUES
((SELECT id FROM brands WHERE slug = 'apple' LIMIT 1), 'iPhone 15 Pro Max', 'iphone-15-pro-max', 2023, 1),
((SELECT id FROM brands WHERE slug = 'apple' LIMIT 1), 'iPhone 15 Pro', 'iphone-15-pro', 2023, 2),
((SELECT id FROM brands WHERE slug = 'apple' LIMIT 1), 'iPhone 15', 'iphone-15', 2023, 3),
((SELECT id FROM brands WHERE slug = 'apple' LIMIT 1), 'iPhone 14 Pro', 'iphone-14-pro', 2022, 4);

-- 5. Services (Phone category)
INSERT INTO services (category_id, name_de, slug, description_de, features, icon, duration, price_min, price_max, price_display, display_order) VALUES
(
  (SELECT id FROM service_categories WHERE slug = 'phone'),
  'Display Tausch',
  'display-replacement',
  'Professioneller Austausch des defekten Displays',
  '["Original Teile", "12 Monate Garantie", "Express Service verfügbar"]'::jsonb,
  'fa-solid fa-mobile-screen',
  '1-2 Stunden',
  79.00,
  199.00,
  '€79-199',
  1
),
(
  (SELECT id FROM service_categories WHERE slug = 'phone'),
  'Akku Wechsel',
  'battery-replacement',
  'Austausch des schwachen Akkus',
  '["Original Teile", "12 Monate Garantie", "Express Service verfügbar"]'::jsonb,
  'fa-solid fa-battery-full',
  '1 Stunde',
  49.00,
  89.00,
  '€49-89',
  2
);

-- 6. Content (Home page)
INSERT INTO content_pages (page_slug, section_key, content_de, content_type) VALUES
('home', 'hero_title', 'Professioneller Tech-Service in Wels, Österreich', 'text'),
('home', 'hero_subtitle', 'Reparatur von Smartphones, Notebooks, Gaming-Konsolen & mehr', 'text'),
('home', 'about_title', 'Über Mood IT', 'text');

-- 7. Settings
INSERT INTO settings (key, value, value_type, description, is_public) VALUES
('business_name', 'Mood IT', 'string', 'Company name', true),
('business_phone', '+994 50 555 55 55', 'string', 'Contact phone', true),
('business_email', 'info@moodit.at', 'string', 'Contact email', true),
('business_whatsapp', '+994 55 220 10 18', 'string', 'WhatsApp number', true);
```

---

## 8. BACKUP & MAINTENANCE

### Automated Backups (Supabase)
- **Daily backups** (automatic via Supabase Pro)
- **Point-in-time recovery** (PITR) available
- **Manual backups** via CLI:
```bash
supabase db dump --file backup_$(date +%Y%m%d).sql
```

### Database Maintenance
```sql
-- Vacuum tables (monthly)
VACUUM ANALYZE;

-- Reindex (quarterly)
REINDEX DATABASE postgres;
```

---

## 9. PERFORMANCE MONITORING

### Useful Queries

#### Slow Queries
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

**Document Version:** 1.0.0  
**Database Version:** PostgreSQL 15 (Supabase)  
**Last Updated:** January 28, 2026

---

© 2026 Mood IT - Confidential