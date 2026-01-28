-- ============================================
-- MOOD IT - TEST DATA
-- ============================================
-- Kateqoriyalar, Xidmətlər, Markalar, Modellər, Parametrlər
-- ============================================

-- ============================================
-- 1. SERVICE CATEGORIES
-- ============================================
INSERT INTO service_categories (name_de, name_en, slug, description_de, description_en, icon, display_order, is_active)
VALUES
  ('Smartphone', 'Smartphone', 'smartphone', 'Professionelle Smartphone-Reparatur für alle Marken', 'Professional smartphone repair for all brands', 'fa-mobile', 1, true),
  ('PlayStation', 'PlayStation', 'playstation', 'PlayStation Konsolen-Reparatur und Service', 'PlayStation console repair and service', 'fa-playstation', 2, true),
  ('macOS', 'macOS', 'macos', 'Mac-Reparatur und macOS-Support', 'Mac repair and macOS support', 'fa-apple', 3, true),
  ('Notebook', 'Notebook', 'notebook', 'Laptop-Reparatur und Wartung', 'Laptop repair and maintenance', 'fa-laptop', 4, true),
  ('Desktop', 'Desktop', 'desktop', 'Desktop-PC-Reparatur und Upgrade', 'Desktop PC repair and upgrade', 'fa-desktop', 5, true),
  ('Xbox & GPU', 'Xbox & GPU', 'gpu', 'Xbox-Reparatur und Grafikkarten-Service', 'Xbox repair and graphics card service', 'fa-microchip', 6, true);

-- ============================================
-- 2. SERVICES (per category)
-- ============================================

-- Smartphone Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, base_price, duration_minutes, is_featured, display_order, is_active)
SELECT 
  id,
  'Display Tausch',
  'Display Replacement',
  'display-tausch',
  'Professioneller Display-Austausch mit Original-Ersatzteilen',
  'Professional display replacement with original parts',
  149.00,
  60,
  true,
  1,
  true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id,
  'Akku Wechsel',
  'Battery Replacement',
  'akku-wechsel',
  'Schneller Akkutausch für längere Akkulaufzeit',
  'Fast battery replacement for longer battery life',
  79.00,
  45,
  true,
  2,
  true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id,
  'Kamera Reparatur',
  'Camera Repair',
  'kamera-reparatur',
  'Reparatur von Front- und Rückkamera',
  'Repair of front and rear camera',
  99.00,
  60,
  false,
  3,
  true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id,
  'Wasserschaden Behandlung',
  'Water Damage Treatment',
  'wasserschaden',
  'Professionelle Behandlung von Wasserschäden',
  'Professional water damage treatment',
  129.00,
  120,
  false,
  4,
  true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id,
  'Ladebuchse Reparatur',
  'Charging Port Repair',
  'ladebuchse-reparatur',
  'Austausch defekter Ladebuchsen',
  'Replacement of defective charging ports',
  69.00,
  45,
  false,
  5,
  true
FROM service_categories WHERE slug = 'smartphone';

-- PlayStation Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, base_price, duration_minutes, is_featured, display_order, is_active)
SELECT 
  id,
  'PS5 HDMI Port Reparatur',
  'PS5 HDMI Port Repair',
  'ps5-hdmi-port',
  'Reparatur defekter HDMI-Anschlüsse für PS5',
  'Repair of defective HDMI ports for PS5',
  159.00,
  90,
  true,
  1,
  true
FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT 
  id,
  'PS4 APU Reballing',
  'PS4 APU Reballing',
  'ps4-apu-reballing',
  'Professionelles APU Reballing für PS4',
  'Professional APU reballing for PS4',
  189.00,
  180,
  true,
  2,
  true
FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT 
  id,
  'Lüfter Austausch',
  'Fan Replacement',
  'luefter-austausch',
  'Austausch verschlissener Lüfter',
  'Replacement of worn fans',
  79.00,
  60,
  false,
  3,
  true
FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT 
  id,
  'Reinigung & Wartung',
  'Cleaning & Maintenance',
  'reinigung-wartung',
  'Komplette Reinigung und Wartung',
  'Complete cleaning and maintenance',
  59.00,
  45,
  false,
  4,
  true
FROM service_categories WHERE slug = 'playstation';

-- macOS Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, base_price, duration_minutes, is_featured, display_order, is_active)
SELECT 
  id,
  'MacBook Display Reparatur',
  'MacBook Display Repair',
  'macbook-display',
  'Display-Reparatur für alle MacBook-Modelle',
  'Display repair for all MacBook models',
  299.00,
  120,
  true,
  1,
  true
FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT 
  id,
  'Tastatur Austausch',
  'Keyboard Replacement',
  'tastatur-austausch',
  'Austausch defekter Tastaturen',
  'Replacement of defective keyboards',
  189.00,
  90,
  false,
  2,
  true
FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT 
  id,
  'SSD Upgrade',
  'SSD Upgrade',
  'ssd-upgrade',
  'SSD-Upgrade für schnellere Performance',
  'SSD upgrade for faster performance',
  149.00,
  60,
  true,
  3,
  true
FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT 
  id,
  'Akku Service',
  'Battery Service',
  'akku-service',
  'Akkutausch und Batterieoptimierung',
  'Battery replacement and optimization',
  129.00,
  75,
  false,
  4,
  true
FROM service_categories WHERE slug = 'macos';

-- Notebook Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, base_price, duration_minutes, is_featured, display_order, is_active)
SELECT 
  id,
  'Display Austausch',
  'Display Replacement',
  'display-austausch-nb',
  'Austausch defekter Notebook-Displays',
  'Replacement of defective notebook displays',
  199.00,
  90,
  true,
  1,
  true
FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT 
  id,
  'Lüfter & Kühlung',
  'Fan & Cooling',
  'luefter-kuehlung',
  'Lüfterreinigung und Kühlsystem-Wartung',
  'Fan cleaning and cooling system maintenance',
  69.00,
  45,
  false,
  2,
  true
FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT 
  id,
  'RAM Upgrade',
  'RAM Upgrade',
  'ram-upgrade',
  'Arbeitsspeicher-Erweiterung',
  'Memory expansion',
  89.00,
  30,
  false,
  3,
  true
FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT 
  id,
  'Windows Neuinstallation',
  'Windows Reinstallation',
  'windows-neuinstallation',
  'Saubere Windows-Installation mit Treibern',
  'Clean Windows installation with drivers',
  79.00,
  120,
  false,
  4,
  true
FROM service_categories WHERE slug = 'notebook';

-- Desktop Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, base_price, duration_minutes, is_featured, display_order, is_active)
SELECT 
  id,
  'PC Zusammenbau',
  'PC Assembly',
  'pc-zusammenbau',
  'Individueller PC-Zusammenbau nach Wunsch',
  'Individual PC assembly on request',
  149.00,
  180,
  true,
  1,
  true
FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT 
  id,
  'Mainboard Reparatur',
  'Motherboard Repair',
  'mainboard-reparatur',
  'Professionelle Mainboard-Reparatur',
  'Professional motherboard repair',
  189.00,
  240,
  true,
  2,
  true
FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT 
  id,
  'Netzteil Austausch',
  'Power Supply Replacement',
  'netzteil-austausch',
  'Austausch defekter Netzteile',
  'Replacement of defective power supplies',
  79.00,
  45,
  false,
  3,
  true
FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT 
  id,
  'Performance Tuning',
  'Performance Tuning',
  'performance-tuning',
  'System-Optimierung für maximale Performance',
  'System optimization for maximum performance',
  99.00,
  90,
  false,
  4,
  true
FROM service_categories WHERE slug = 'desktop';

-- Xbox & GPU Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, base_price, duration_minutes, is_featured, display_order, is_active)
SELECT 
  id,
  'Xbox HDMI Reparatur',
  'Xbox HDMI Repair',
  'xbox-hdmi',
  'HDMI-Port-Reparatur für Xbox One/Series',
  'HDMI port repair for Xbox One/Series',
  149.00,
  90,
  true,
  1,
  true
FROM service_categories WHERE slug = 'gpu'
UNION ALL
SELECT 
  id,
  'GPU Reballing',
  'GPU Reballing',
  'gpu-reballing',
  'Professionelles GPU-Reballing',
  'Professional GPU reballing',
  199.00,
  180,
  true,
  2,
  true
FROM service_categories WHERE slug = 'gpu'
UNION ALL
SELECT 
  id,
  'Grafikkarten-Kühlung',
  'Graphics Card Cooling',
  'gpu-kuehlung',
  'Kühlsystem-Wartung und Wärmeleitpaste',
  'Cooling system maintenance and thermal paste',
  89.00,
  60,
  false,
  3,
  true
FROM service_categories WHERE slug = 'gpu';

-- ============================================
-- 3. BRANDS
-- ============================================
INSERT INTO brands (category_id, name, slug, display_order, is_active)
SELECT id, 'Apple', 'apple', 1, true FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'Samsung', 'samsung', 2, true FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'Huawei', 'huawei', 3, true FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'Xiaomi', 'xiaomi', 4, true FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'OnePlus', 'oneplus', 5, true FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT id, 'Sony', 'sony', 1, true FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT id, 'Apple', 'apple-mac', 1, true FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT id, 'Dell', 'dell', 1, true FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT id, 'HP', 'hp', 2, true FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT id, 'Lenovo', 'lenovo', 3, true FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT id, 'ASUS', 'asus', 4, true FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT id, 'Custom Build', 'custom', 1, true FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT id, 'Microsoft', 'microsoft', 1, true FROM service_categories WHERE slug = 'gpu'
UNION ALL
SELECT id, 'NVIDIA', 'nvidia', 2, true FROM service_categories WHERE slug = 'gpu'
UNION ALL
SELECT id, 'AMD', 'amd', 3, true FROM service_categories WHERE slug = 'gpu';

-- ============================================
-- 4. MODELS (Smartphone - Apple)
-- ============================================
INSERT INTO models (brand_id, name, slug, release_year, display_order, is_active)
SELECT 
  b.id,
  model_name,
  model_slug,
  release_year,
  ROW_NUMBER() OVER (ORDER BY release_year DESC),
  true
FROM brands b
CROSS JOIN (
  VALUES
    ('iPhone 15 Pro Max', 'iphone-15-pro-max', 2023),
    ('iPhone 15 Pro', 'iphone-15-pro', 2023),
    ('iPhone 15', 'iphone-15', 2023),
    ('iPhone 14 Pro Max', 'iphone-14-pro-max', 2022),
    ('iPhone 14 Pro', 'iphone-14-pro', 2022),
    ('iPhone 14', 'iphone-14', 2022),
    ('iPhone 13 Pro Max', 'iphone-13-pro-max', 2021),
    ('iPhone 13 Pro', 'iphone-13-pro', 2021),
    ('iPhone 13', 'iphone-13', 2021),
    ('iPhone 12 Pro Max', 'iphone-12-pro-max', 2020),
    ('iPhone 12 Pro', 'iphone-12-pro', 2020),
    ('iPhone 12', 'iphone-12', 2020),
    ('iPhone 11 Pro Max', 'iphone-11-pro-max', 2019),
    ('iPhone 11 Pro', 'iphone-11-pro', 2019),
    ('iPhone 11', 'iphone-11', 2019),
    ('iPhone XS Max', 'iphone-xs-max', 2018),
    ('iPhone XS', 'iphone-xs', 2018),
    ('iPhone XR', 'iphone-xr', 2018),
    ('iPhone X', 'iphone-x', 2017)
) AS models(model_name, model_slug, release_year)
WHERE b.slug = 'apple' AND b.category_id = (SELECT id FROM service_categories WHERE slug = 'smartphone');

-- ============================================
-- 5. MODELS (PlayStation - Sony)
-- ============================================
INSERT INTO models (brand_id, name, slug, release_year, display_order, is_active)
SELECT 
  b.id,
  model_name,
  model_slug,
  release_year,
  ROW_NUMBER() OVER (ORDER BY release_year DESC),
  true
FROM brands b
CROSS JOIN (
  VALUES
    ('PlayStation 5', 'ps5', 2020),
    ('PlayStation 5 Digital', 'ps5-digital', 2020),
    ('PlayStation 4 Pro', 'ps4-pro', 2016),
    ('PlayStation 4 Slim', 'ps4-slim', 2016),
    ('PlayStation 4', 'ps4', 2013)
) AS models(model_name, model_slug, release_year)
WHERE b.slug = 'sony' AND b.category_id = (SELECT id FROM service_categories WHERE slug = 'playstation');

-- ============================================
-- 6. PUBLIC SETTINGS
-- ============================================
INSERT INTO settings (key, value, value_type, description, is_public)
VALUES
  ('site_name', 'Mood IT', 'string', 'Website name', true),
  ('site_description', 'Professioneller Tech-Service in Wels, Österreich', 'string', 'Website description', true),
  ('contact_email', 'info@moodit.at', 'string', 'Contact email', true),
  ('contact_phone', '+43 7242 12345', 'string', 'Contact phone', true),
  ('contact_whatsapp', '+43 664 1234567', 'string', 'WhatsApp number', true),
  ('address_street', 'Musterstraße 123', 'string', 'Street address', true),
  ('address_city', 'Wels', 'string', 'City', true),
  ('address_zip', '4600', 'string', 'ZIP code', true),
  ('address_country', 'Österreich', 'string', 'Country', true),
  ('business_hours', '{"monday":"09:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-18:00","friday":"09:00-18:00","saturday":"Geschlossen","sunday":"Geschlossen"}', 'json', 'Business hours', true),
  ('social_facebook', 'https://facebook.com/moodit', 'string', 'Facebook URL', true),
  ('social_instagram', 'https://instagram.com/moodit', 'string', 'Instagram URL', true),
  ('warranty_period', '90', 'number', 'Warranty period in days', true);

-- ============================================
-- 7. CONTENT PAGES
-- ============================================
INSERT INTO content_pages (page_slug, section_key, content_de, content_en, content_type)
VALUES
  ('index', 'hero_title', 'Professioneller Tech-Service in Wels', 'Professional Tech Service in Wels', 'text'),
  ('index', 'hero_subtitle', 'Schnelle und zuverlässige Reparatur für Smartphones, PCs, Konsolen und mehr', 'Fast and reliable repair for smartphones, PCs, consoles and more', 'text'),
  ('about', 'about_title', 'Über Mood IT', 'About Mood IT', 'text'),
  ('about', 'about_content', 'Wir sind Ihr professioneller Partner für Tech-Reparaturen in Wels. Mit jahrelanger Erfahrung und modernster Ausstattung bieten wir schnelle und zuverlässige Reparaturen für alle Ihre Geräte.', 'We are your professional partner for tech repairs in Wels. With years of experience and state-of-the-art equipment, we offer fast and reliable repairs for all your devices.', 'text');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 
  'Test data successfully inserted!' as message,
  (SELECT COUNT(*) FROM service_categories) as categories_count,
  (SELECT COUNT(*) FROM services) as services_count,
  (SELECT COUNT(*) FROM brands) as brands_count,
  (SELECT COUNT(*) FROM models) as models_count,
  (SELECT COUNT(*) FROM settings WHERE is_public = true) as public_settings_count,
  (SELECT COUNT(*) FROM content_pages) as content_pages_count;
