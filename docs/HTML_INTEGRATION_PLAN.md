# 🔗 HTML SƏHIFƏLƏRI İNTEQRASİYA PLANI

## 📋 **MƏQSƏD**
Mövcud HTML səhifələrini Admin Panel ilə birləşdirmək və dinamik məzmun göstərmək.

---

## 📁 **MÖVCUD HTML SƏHIFƏLƏR**

### **1. Ana Səhifə**
- `index.html` - Əsas landing page
- Hero section (video background)
- Xidmətlər bölməsi
- Statistika
- Testimonials

### **2. Haqqımızda**
- `about.html` - Şirkət haqqında məlumat

### **3. Xidmətlər**
- `service-all.html` - Bütün xidmətlər
- `service-smartphone.html` - Smartphone təmiri
- `service-playstation.html` - PlayStation təmiri
- `service-macos.html` - macOS təmiri
- `service-notebook.html` - Notebook təmiri
- `service-desktop.html` - Desktop təmiri
- `service-gpu.html` - Xbox & GPU təmiri

### **4. Qiymət Siyahısı**
- `preisliste.html` - İnteraktiv qiymət kalkulyatoru
- `preisliste-wizard.js` - Wizard funksionallığı
- `preisliste-data.js` - Qiymət məlumatları

### **5. Əlaqə**
- `contact.html` - Əlaqə formu

---

## 🎯 **İNTEQRASİYA STRATEGİYASI**

### **VARIANT 1: Next.js Public Route (RECOMMENDEDxs)**

```
mood/
├── admin/                  # Admin Panel (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/     # Login
│   │   │   ├── (dashboard)/ # Admin panel
│   │   │   └── (public)/   # 🆕 Public HTML səhifələr
│   │   │       ├── page.tsx          # / (index.html)
│   │   │       ├── about/page.tsx    # /about
│   │   │       ├── services/         # /services/*
│   │   │       ├── preisliste/       # /preisliste
│   │   │       └── contact/page.tsx  # /contact
│   │   └── components/
│   │       └── public/       # 🆕 Public components
│   │           ├── Header.tsx
│   │           ├── Footer.tsx
│   │           └── Hero.tsx
```

**✅ ÜSTÜNLÜKLƏRİ:**
- Tək port (3000)
- Paylaşılan API
- SEO optimizasiyası
- Server-side rendering
- Dinamik məzmun

**❌ ÇƏTINLIKLƏR:**
- HTML → React konvertasiyası
- CSS inteqrasiyası

---

### **VARIANT 2: Separate Static HTML + API (FAST SOLUTION)**

```
mood/
├── admin/                  # Admin Panel (Next.js) - Port 3000
│   └── src/app/api/        # Public API endpoints
│       └── public/         # 🆕 Public API
│           ├── services/route.ts
│           ├── categories/route.ts
│           └── content/route.ts
├── public/                 # 🆕 Static HTML - Port 5500 (Live Server)
│   ├── index.html
│   ├── about.html
│   ├── services/
│   ├── preisliste.html
│   ├── contact.html
│   ├── css/
│   ├── js/
│   │   └── api-client.js   # 🆕 Fetch data from Admin API
│   └── images/
```

**✅ ÜSTÜNLÜKLƏRİ:**
- Sürətli implementasiya
- HTML dəyişməz qalır
- JavaScript ilə API inteqrasiyası

**❌ ÇƏTINLIKLƏR:**
- 2 ayrı port
- CORS konfiqurasiyası
- SEO məhdudiyyəti

---

## 🚀 **TÖVSİYƏ EDİLƏN YANAŞMA: VARIANT 2 (FAST)**

### **SƏBƏBLƏR:**
1. **Sürətli**: HTML-i React-ə çevirmək uzun vaxt alır
2. **Minimal Dəyişiklik**: Mövcud dizayn toxunulmaz qalır
3. **Dinamik Məzmun**: API ilə database-dən məlumat çəkilir
4. **Test Asan**: Admin panel və public site ayrıca

---

## 📝 **İMPLEMENTASİYA ADDIMLA

RI**

### **PHASE 1: PUBLIC API YARATMAQ** (30 dəq)

#### **1.1 Public Services API**
```typescript
// admin/src/app/api/public/services/route.ts
GET /api/public/services?category=smartphone
- Aktiv xidmətləri qaytarır
- Kateqoriya filtr
- RLS: is_active = true
```

#### **1.2 Public Categories API**
```typescript
// admin/src/app/api/public/categories/route.ts
GET /api/public/categories
- Aktiv kateqoriyaları qaytarır
- display_order ilə sıralama
```

#### **1.3 Public Content API**
```typescript
// admin/src/app/api/public/content/route.ts
GET /api/public/content?page=index
- Səhifə məzmununu qaytarır
- Çoxdilli dəstək (DE/EN)
```

#### **1.4 Public Settings API**
```typescript
// admin/src/app/api/public/settings/route.ts
GET /api/public/settings
- Public settings (is_public = true)
- Əlaqə məlumatları, sosial media links
```

---

### **PHASE 2: HTML SƏHİFƏLƏRİNİ YENİDƏN QURMAQ** (1 saat)

#### **2.1 Public Folder Structure**
```bash
mkdir public
# HTML fayllarını public/ folder-ə köçürmək
mv *.html public/
mv css public/
mv js public/
mv images public/
mv webfonts public/
```

#### **2.2 API Client JavaScript**
```javascript
// public/js/api-client.js
const API_BASE = 'http://localhost:3000/api/public';

async function fetchServices(category) {
  const res = await fetch(`${API_BASE}/services?category=${category}`);
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

async function renderServices(container, category) {
  const data = await fetchServices(category);
  // Render HTML
}
```

#### **2.3 Update HTML**
```html
<!-- public/service-smartphone.html -->
<div id="services-container"></div>

<script src="js/api-client.js"></script>
<script>
  renderServices('#services-container', 'smartphone');
</script>
```

---

### **PHASE 3: CORS KONFIQURASIYASI** (15 dəq)

```typescript
// admin/next.config.mjs
async headers() {
  return [
    {
      source: '/api/public/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET' },
      ],
    },
  ];
}
```

---

### **PHASE 4: PREİSLİSTE İNTEQRASİYASI** (45 dəq)

#### **4.1 Preisliste API**
```typescript
// admin/src/app/api/public/preisliste/route.ts
GET /api/public/preisliste
- Brands, Models, Services with prices
```

#### **4.2 Update preisliste-data.js**
```javascript
// public/js/preisliste-data.js
async function loadPreislisteData() {
  const data = await fetch('http://localhost:3000/api/public/preisliste');
  return data.json();
}
```

---

### **PHASE 5: CONTACT FORM İNTEQRASİYASI** (30 dəq)

#### **5.1 Contact API**
```typescript
// admin/src/app/api/public/contact/route.ts
POST /api/public/contact
- Form məlumatlarını database-ə yazır
- E-poçt göndərir
```

#### **5.2 Update contact.html**
```javascript
// public/js/contact-form.js
async function submitForm(formData) {
  await fetch('http://localhost:3000/api/public/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}
```

---

## ⏱️ **ÜMUMI MÜDDƏT: ~3 SAAT**

---

## 📦 **DELIVERY STRUCTURE**

```
mood-it-admin/
├── admin/                  # Next.js Admin Panel (Port 3000)
│   └── src/app/api/public/ # Public API endpoints
├── public/                 # Static HTML Site (Port 5500)
│   ├── index.html
│   ├── about.html
│   ├── services/
│   ├── preisliste.html
│   ├── contact.html
│   └── js/
│       └── api-client.js   # API inteqrasiya
└── docs/
    └── HTML_INTEGRATION_PLAN.md
```

---

## 🎯 **SONRAKI ADDIM**

**İndi seçim et:**
1. ✅ **VARIANT 2 (FAST)** - Public API + Static HTML (3 saat)
2. ❌ **VARIANT 1 (SLOW)** - HTML → React (10+ saat)

**Hansını seçirsən?** 🚀
