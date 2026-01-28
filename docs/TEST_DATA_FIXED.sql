-- ============================================
-- MOOD IT - TEST DATA (CORRECTED)
-- ============================================
-- Əvvəlcə mövcud data-nı silək (clean slate)
-- ============================================

DELETE FROM models WHERE brand_id IN (SELECT id FROM brands);
DELETE FROM brands WHERE category_id IN (SELECT id FROM service_categories);
DELETE FROM services WHERE category_id IN (SELECT id FROM service_categories);
DELETE FROM content_pages;
DELETE FROM settings WHERE key IN ('site_name', 'site_description', 'contact_email', 'contact_phone', 'contact_whatsapp', 'address_street', 'address_city', 'address_zip', 'address_country', 'business_hours', 'social_facebook', 'social_instagram', 'warranty_period');
DELETE FROM service_categories;

-- ============================================
-- 1. SERVICE CATEGORIES
-- ============================================
INSERT INTO service_categories (name_de, name_en, slug, description_de, description_en, icon, display_order, is_active)
VALUES
  ('Smartphone', 'Smartphone', 'smartphone', 'Smartphone təmiri - bütün brendlər', 'Professional smartphone repair for all brands', 'fa-solid fa-mobile-screen-button', 1, true),
  ('PlayStation', 'PlayStation', 'playstation', 'PlayStation konsollarının təmiri', 'PlayStation console repair and service', 'fa-brands fa-playstation', 2, true),
  ('macOS', 'macOS', 'macos', 'Mac təmiri və macOS dəstək', 'Mac repair and macOS support', 'fa-brands fa-apple', 3, true),
  ('Notebook', 'Notebook', 'notebook', 'Noutbuk təmiri və texniki xidmət', 'Laptop repair and maintenance', 'fa-solid fa-laptop', 4, true),
  ('Desktop', 'Desktop', 'desktop', 'Masaüstü kompüter təmiri', 'Desktop PC repair and upgrade', 'fa-solid fa-desktop', 5, true),
  ('Xbox & GPU', 'Xbox & GPU', 'gpu', 'Xbox və videokart təmiri', 'Xbox repair and graphics card service', 'fa-solid fa-microchip', 6, true);

-- ============================================
-- 2. SERVICES
-- ============================================

-- Smartphone Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, icon, duration, price_min, price_max, price_display, display_order, is_active)
SELECT 
  id, 'Display Tausch', 'Display Replacement', 'display-tausch',
  'Orijinal ehtiyat hissələri ilə peşəkar ekran dəyişdirilməsi',
  'Professional display replacement with original parts',
  'fa-solid fa-mobile-screen', '1 saat', 149, 249, '€149-249', 1, true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id, 'Akku Wechsel', 'Battery Replacement', 'akku-wechsel',
  'Daha uzun batareya ömrü üçün sürətli batareya dəyişdirilməsi',
  'Fast battery replacement for longer battery life',
  'fa-solid fa-battery-three-quarters', '45 dəqiqə', 79, 129, '€79-129', 2, true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id, 'Kamera Reparatur', 'Camera Repair', 'kamera-reparatur',
  'Ön və arxa kameranın təmiri',
  'Repair of front and rear camera',
  'fa-solid fa-camera', '1 saat', 99, 149, '€99-149', 3, true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id, 'Wasserschaden Behandlung', 'Water Damage Treatment', 'wasserschaden',
  'Su ziyanının peşəkar müalicəsi',
  'Professional water damage treatment',
  'fa-solid fa-droplet', '2 saat', 129, 199, '€129-199', 4, true
FROM service_categories WHERE slug = 'smartphone'
UNION ALL
SELECT 
  id, 'Ladebuchse Reparatur', 'Charging Port Repair', 'ladebuchse-reparatur',
  'Qüsurlu şarj portlarının dəyişdirilməsi',
  'Replacement of defective charging ports',
  'fa-solid fa-charging-station', '45 dəqiqə', 69, 99, '€69-99', 5, true
FROM service_categories WHERE slug = 'smartphone';

-- PlayStation Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, icon, duration, price_min, price_max, price_display, display_order, is_active)
SELECT 
  id, 'PS5 HDMI Port Reparatur', 'PS5 HDMI Port Repair', 'ps5-hdmi-port',
  'PS5 üçün qüsurlu HDMI portlarının təmiri',
  'Repair of defective HDMI ports for PS5',
  'fa-solid fa-plug', '1.5 saat', 159, 199, '€159-199', 1, true
FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT 
  id, 'PS4 APU Reballing', 'PS4 APU Reballing', 'ps4-apu-reballing',
  'PS4 üçün peşəkar APU reballing',
  'Professional APU reballing for PS4',
  'fa-solid fa-microchip', '3 saat', 189, 249, '€189-249', 2, true
FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT 
  id, 'Lüfter Austausch', 'Fan Replacement', 'luefter-austausch',
  'Köhnə fanatların dəyişdirilməsi',
  'Replacement of worn fans',
  'fa-solid fa-fan', '1 saat', 79, 119, '€79-119', 3, true
FROM service_categories WHERE slug = 'playstation'
UNION ALL
SELECT 
  id, 'Reinigung & Wartung', 'Cleaning & Maintenance', 'reinigung-wartung',
  'Tam təmizləmə və texniki xidmət',
  'Complete cleaning and maintenance',
  'fa-solid fa-broom', '45 dəqiqə', 59, 89, '€59-89', 4, true
FROM service_categories WHERE slug = 'playstation';

-- macOS Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, icon, duration, price_min, price_max, price_display, display_order, is_active)
SELECT 
  id, 'MacBook Display Reparatur', 'MacBook Display Repair', 'macbook-display',
  'Bütün MacBook modelləri üçün ekran təmiri',
  'Display repair for all MacBook models',
  'fa-solid fa-display', '2 saat', 299, 499, '€299-499', 1, true
FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT 
  id, 'Tastatur Austausch', 'Keyboard Replacement', 'tastatur-austausch',
  'Qüsurlu klaviaturaların dəyişdirilməsi',
  'Replacement of defective keyboards',
  'fa-solid fa-keyboard', '1.5 saat', 189, 249, '€189-249', 2, true
FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT 
  id, 'SSD Upgrade', 'SSD Upgrade', 'ssd-upgrade',
  'Daha sürətli performans üçün SSD yeniləməsi',
  'SSD upgrade for faster performance',
  'fa-solid fa-hard-drive', '1 saat', 149, 299, '€149-299', 3, true
FROM service_categories WHERE slug = 'macos'
UNION ALL
SELECT 
  id, 'Akku Service', 'Battery Service', 'akku-service',
  'Batareya dəyişdirilməsi və optimizasiyası',
  'Battery replacement and optimization',
  'fa-solid fa-battery-half', '1.25 saat', 129, 199, '€129-199', 4, true
FROM service_categories WHERE slug = 'macos';

-- Notebook Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, icon, duration, price_min, price_max, price_display, display_order, is_active)
SELECT 
  id, 'Display Austausch', 'Display Replacement', 'display-austausch-nb',
  'Qüsurlu noutbuk ekranlarının dəyişdirilməsi',
  'Replacement of defective notebook displays',
  'fa-solid fa-laptop-medical', '1.5 saat', 199, 349, '€199-349', 1, true
FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT 
  id, 'Lüfter & Kühlung', 'Fan & Cooling', 'luefter-kuehlung',
  'Fan təmizləməsi və soyutma sisteminin texniki xidməti',
  'Fan cleaning and cooling system maintenance',
  'fa-solid fa-wind', '45 dəqiqə', 69, 99, '€69-99', 2, true
FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT 
  id, 'RAM Upgrade', 'RAM Upgrade', 'ram-upgrade',
  'Yaddaş genişləndirilməsi',
  'Memory expansion',
  'fa-solid fa-memory', '30 dəqiqə', 89, 149, '€89-149', 3, true
FROM service_categories WHERE slug = 'notebook'
UNION ALL
SELECT 
  id, 'Windows Neuinstallation', 'Windows Reinstallation', 'windows-neuinstallation',
  'Sürücülərlə təmiz Windows quraşdırılması',
  'Clean Windows installation with drivers',
  'fa-brands fa-windows', '2 saat', 79, 129, '€79-129', 4, true
FROM service_categories WHERE slug = 'notebook';

-- Desktop Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, icon, duration, price_min, price_max, price_display, display_order, is_active)
SELECT 
  id, 'PC Zusammenbau', 'PC Assembly', 'pc-zusammenbau',
  'İstək üzrə fərdi kompüter yığılması',
  'Individual PC assembly on request',
  'fa-solid fa-screwdriver-wrench', '3 saat', 149, 249, '€149-249', 1, true
FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT 
  id, 'Mainboard Reparatur', 'Motherboard Repair', 'mainboard-reparatur',
  'Peşəkar anakart təmiri',
  'Professional motherboard repair',
  'fa-solid fa-microchip', '4 saat', 189, 349, '€189-349', 2, true
FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT 
  id, 'Netzteil Austausch', 'Power Supply Replacement', 'netzteil-austausch',
  'Qüsurlu güc mənbələrinin dəyişdirilməsi',
  'Replacement of defective power supplies',
  'fa-solid fa-plug-circle-bolt', '45 dəqiqə', 79, 149, '€79-149', 3, true
FROM service_categories WHERE slug = 'desktop'
UNION ALL
SELECT 
  id, 'Performance Tuning', 'Performance Tuning', 'performance-tuning',
  'Maksimal performans üçün sistem optimallaşdırılması',
  'System optimization for maximum performance',
  'fa-solid fa-gauge-high', '1.5 saat', 99, 149, '€99-149', 4, true
FROM service_categories WHERE slug = 'desktop';

-- Xbox & GPU Services
INSERT INTO services (category_id, name_de, name_en, slug, description_de, description_en, icon, duration, price_min, price_max, price_display, display_order, is_active)
SELECT 
  id, 'Xbox HDMI Reparatur', 'Xbox HDMI Repair', 'xbox-hdmi',
  'Xbox One/Series üçün HDMI port təmiri',
  'HDMI port repair for Xbox One/Series',
  'fa-brands fa-xbox', '1.5 saat', 149, 199, '€149-199', 1, true
FROM service_categories WHERE slug = 'gpu'
UNION ALL
SELECT 
  id, 'GPU Reballing', 'GPU Reballing', 'gpu-reballing',
  'Peşəkar GPU reballing',
  'Professional GPU reballing',
  'fa-solid fa-microchip', '3 saat', 199, 299, '€199-299', 2, true
FROM service_categories WHERE slug = 'gpu'
UNION ALL
SELECT 
  id, 'Grafikkarten-Kühlung', 'Graphics Card Cooling', 'gpu-kuehlung',
  'Soyutma sisteminin texniki xidməti və termal pasta',
  'Cooling system maintenance and thermal paste',
  'fa-solid fa-temperature-low', '1 saat', 89, 129, '€89-129', 3, true
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
-- 6. PUBLIC SETTINGS (Azərbaycan dilinə tərcümə olunmuş)
-- ============================================
INSERT INTO settings (key, value, value_type, description, is_public)
VALUES
  ('site_name', 'Mood IT', 'string', 'Website name', true),
  ('site_description', 'Bakıda peşəkar texniki servis', 'string', 'Website description', true),
  ('contact_email', 'info@moodit.az', 'string', 'Contact email', true),
  ('contact_phone', '+994 50 555 55 55', 'string', 'Contact phone', true),
  ('contact_whatsapp', '+994 50 555 55 55', 'string', 'WhatsApp number', true),
  ('address_street', 'Küçə 222', 'string', 'Street address', true),
  ('address_city', 'Bakı', 'string', 'City', true),
  ('address_zip', 'AZ1000', 'string', 'ZIP code', true),
  ('address_country', 'Azərbaycan', 'string', 'Country', true),
  ('business_hours', '{"monday":"09:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-18:00","friday":"09:00-18:00","saturday":"Bağlı","sunday":"Bağlı"}', 'json', 'Business hours', true),
  ('social_facebook', 'https://facebook.com/moodit', 'string', 'Facebook URL', true),
  ('social_instagram', 'https://instagram.com/moodit', 'string', 'Instagram URL', true),
  ('warranty_period', '90', 'number', 'Warranty period in days', true);

-- ============================================
-- 7. CONTENT PAGES (Azərbaycan dilinə tərcümə olunmuş)
-- ============================================
INSERT INTO content_pages (page_slug, section_key, content_de, content_en, content_type)
VALUES
  ('index', 'hero_title', 'Bakıda peşəkar texniki servis', 'Professional Tech Service in Baku', 'text'),
  ('index', 'hero_subtitle', 'Smartfonlar, kompüterlər, konsollar və daha çoxu üçün sürətli və etibarlı təmir', 'Fast and reliable repair for smartphones, PCs, consoles and more', 'text'),
  ('about', 'about_title', 'Mood IT haqqında', 'About Mood IT', 'text'),
  ('about', 'about_content', 'Biz Bakıda texniki təmir üçün peşəkar tərəfdaşınızıq. İllərlə təcrübə və ən müasir avadanlıqla bütün cihazlarınız üçün sürətli və etibarlı təmir təklif edirik.', 'We are your professional partner for tech repairs in Baku. With years of experience and state-of-the-art equipment, we offer fast and reliable repairs for all your devices.', 'text');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 
  'Test data uğurla əlavə edildi! ✅' as message,
  (SELECT COUNT(*) FROM service_categories) as categories_count,
  (SELECT COUNT(*) FROM services) as services_count,
  (SELECT COUNT(*) FROM brands) as brands_count,
  (SELECT COUNT(*) FROM models) as models_count,
  (SELECT COUNT(*) FROM settings WHERE is_public = true) as public_settings_count,
  (SELECT COUNT(*) FROM content_pages) as content_pages_count;
