# NEXT.JS MIGRATION PLAN - VARIANT 2 (ADDIM-ADDIM)

## 🎯 MİQRASİYA MƏQSƏDİ

Static HTML səhifələrini tam dinamik Next.js səhifələrinə çevirmək:
- ✅ Bütün məzmun database-dən gələcək
- ✅ Admin paneldən tam idarəetmə
- ✅ SEO optimallaşdırılması (SSR/SSG)
- ✅ Performans təkmilləşdirməsi

---

## 📊 HAL-HAZIRKİ VƏZIYYƏT

### Mövcud Struktur:
```
admin/
├── public/              # 11 ədəd static HTML
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── preisliste.html
│   ├── service-all.html
│   └── service-*.html (6 fayl)
├── src/
│   ├── app/            # Next.js App Router (Admin)
│   └── components/     # Admin components
└── package.json        # Next.js 14.2.35
```

### Problemlər:
- ❌ HTML səhifələri static
- ❌ Məzmun hardcoded
- ❌ Admin paneldən idarə edilə bilmir
- ⚠️ SEO zəif (client-side rendering)

---

## 🏗️ YENİ STRUKTUR

```
admin/
├── src/
│   ├── app/
│   │   ├── (admin)/           # Admin routes (mövcud)
│   │   ├── (public)/          # Public routes (YENİ)
│   │   │   ├── page.tsx       # Ana səhifə
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx           # Bütün xidmətlər
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Tək xidmət
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── preisliste/
│   │   │       └── page.tsx
│   │   └── api/               # API routes (mövcud)
│   ├── components/
│   │   ├── admin/             # Admin components (mövcud)
│   │   └── public/            # Public components (YENİ)
│   │       ├── Layout/
│   │       │   ├── Header.tsx
│   │       │   ├── Footer.tsx
│   │       │   └── Navigation.tsx
│   │       ├── SEO/
│   │       │   ├── MetaTags.tsx
│   │       │   └── StructuredData.tsx
│   │       └── Services/
│   │           ├── ServiceCard.tsx
│   │           ├── ServiceGrid.tsx
│   │           └── CategoryFilter.tsx
│   └── lib/
│       ├── supabase/          # Mövcud
│       └── seo/               # YENİ
│           └── helpers.ts
└── public/
    ├── images/                # Mövcud
    └── css/                   # Mövcud (sonra Next.js-ə migrate)
```

---

## 📅 MİGRASİYA FAZA PLANI

### **PHASE 1: HAZIRLIK (1 session) ✅**
**Müddət:** 30-45 dəqiqə
**Məqsəd:** Struktur və dokumentasiya

- [x] Migration plan yaratmaq
- [x] File structure document
- [x] Migration checklist
- [x] Migration guide (HTML → Next.js)
- [ ] Layout components (Header, Footer, Navigation)
- [ ] SEO helper functions

**Deliverables:**
- 4 ədəd `.md` fayl
- Layout component skeleton
- TODO list

---

### **PHASE 2: LAYOUT VƏ COMPONENTS (1 session)**
**Müddət:** 1-1.5 saat
**Məqsəd:** Təkrar istifadə olunan component-lər

- [ ] `components/public/Layout/Header.tsx`
- [ ] `components/public/Layout/Footer.tsx` (dinamik)
- [ ] `components/public/Layout/Navigation.tsx` (dropdown menu)
- [ ] `components/public/SEO/MetaTags.tsx`
- [ ] `components/public/SEO/StructuredData.tsx`
- [ ] CSS import Next.js-ə (global.css)

**Test:**
- Header və Footer render olur
- Navigation links işləyir
- Footer API-dən data çəkir

---

### **PHASE 3: ANA SƏHİFƏ (1 session)**
**Müddət:** 1.5-2 saat
**Məqsəd:** `index.html` → `app/(public)/page.tsx`

- [ ] `app/(public)/page.tsx` yaratmaq (SSG)
- [ ] Hero section component
- [ ] Partner brands component
- [ ] Services showcase (API-dən)
- [ ] Statistics/counters component
- [ ] Mission/Vision section
- [ ] Testimonials (əgər varsa)
- [ ] CTA section

**Test:**
- Ana səhifə `/` render olur
- SEO meta tags düzgün
- Xidmətlər API-dən gəlir
- Footer dinamikdir

---

### **PHASE 4: HAQQIMIZDA SƏHİFƏSİ (1 session)**
**Müddət:** 45-60 dəqiqə
**Məqsəd:** `about.html` → `app/(public)/about/page.tsx`

- [ ] `app/(public)/about/page.tsx` (SSG)
- [ ] About content component
- [ ] Team section (database-dən - future)
- [ ] Timeline/History
- [ ] Values/Principles

**Test:**
- `/about` səhifəsi render olur
- SEO meta tags
- Layout düzgün

---

### **PHASE 5: ƏLAQƏ SƏHİFƏSİ (1 session)**
**Müddət:** 1-1.5 saat
**Məqsəd:** `contact.html` → `app/(public)/contact/page.tsx`

- [ ] `app/(public)/contact/page.tsx` (SSR)
- [ ] Contact form component
- [ ] Contact info (API-dən)
- [ ] Google Maps integration
- [ ] Form submission (API route)
- [ ] WhatsApp link

**Test:**
- `/contact` səhifəsi render olur
- Form işləyir
- Contact məlumatları API-dən gəlir

---

### **PHASE 6: XİDMƏT SƏHİFƏLƏRİ (2 session)**
**Müddət:** 2-3 saat
**Məqsəd:** Dynamic service pages

#### Session 6.1: Services Index
- [ ] `app/(public)/services/page.tsx` (SSG)
- [ ] Service grid component
- [ ] Category filter component
- [ ] Service card component

#### Session 6.2: Single Service
- [ ] `app/(public)/services/[slug]/page.tsx` (SSG)
- [ ] `generateStaticParams()` - bütün xidmət slug-ları
- [ ] Service detail view
- [ ] Related services
- [ ] CTA section

**Test:**
- `/services` - bütün xidmətlər görsənir
- `/services/display-tausch` - tək xidmət görünür
- SEO meta tags dinamik
- Category filter işləyir

---

### **PHASE 7: KATEQORİYA SƏHİFƏLƏRİ (1 session)**
**Müddət:** 1.5 saat
**Məqsəd:** Category-specific pages

- [ ] `app/(public)/categories/[slug]/page.tsx` (SSG)
- [ ] `generateStaticParams()` - kateqoriya slug-ları
- [ ] Category header
- [ ] Services in category
- [ ] Brands/Models in category
- [ ] Related categories

**Test:**
- `/categories/smartphone` işləyir
- Kateqoriyaya aid xidmətlər görünür
- SEO optimal

---

### **PHASE 8: QİYMƏT KALKULYATORU (1 session)**
**Müddət:** 2 saat
**Məqsəd:** `preisliste.html` → `app/(public)/preisliste/page.tsx`

- [ ] `app/(public)/preisliste/page.tsx` (SSR)
- [ ] Multi-step wizard component
- [ ] Category selection (API)
- [ ] Brand selection (API)
- [ ] Model selection (API)
- [ ] Service selection (API)
- [ ] Price calculation
- [ ] Contact form submission

**Test:**
- Wizard steps işləyir
- Dynamic data yüklənir
- Price hesablanır
- Form submission işləyir

---

### **PHASE 9: SEO OPTIMALLAŞDIRMA (1 session)**
**Müddət:** 1-1.5 saat
**Məqsəd:** SEO təkmilləşdirmə

- [ ] `next-sitemap` package quraşdırmaq
- [ ] `next-sitemap.config.js` yaratmaq
- [ ] Dynamic sitemap generator
- [ ] `robots.txt` generator
- [ ] Structured data helper (JSON-LD)
- [ ] Open Graph images
- [ ] Twitter Card meta tags

**Test:**
- `/sitemap.xml` generate olur
- `/robots.txt` düzgün
- Google Search Console yoxlama

---

### **PHASE 10: IMAGE OPTIMALLAŞDIRMA (1 session)**
**Müddət:** 1 saat
**Məqsəd:** Image performance

- [ ] `<img>` → `<Image>` (Next.js)
- [ ] Image optimization konfiqurasiya
- [ ] Lazy loading
- [ ] Responsive images
- [ ] WebP/AVIF format support

**Test:**
- Şəkillər sürətli yüklənir
- Responsive düzgün işləyir

---

### **PHASE 11: CSS MİGRATİON (1 session)**
**Müddət:** 1-1.5 saat
**Məqsəd:** CSS Next.js-ə inteqrasiya

- [ ] `public/css/` → `src/styles/`
- [ ] `globals.css` yaratmak
- [ ] CSS modules (optional)
- [ ] Tailwind CSS (optional - future)

---

### **PHASE 12: TESTING VƏ BUG FİXES (1-2 session)**
**Müddət:** 2-3 saat
**Məqsəd:** Bütün səhifələri test etmək

- [ ] Bütün routes test
- [ ] Mobile responsive test
- [ ] SEO test (Lighthouse)
- [ ] Performance test
- [ ] Bug fixes
- [ ] Cross-browser test

---

### **PHASE 13: DEPLOYMENT (1 session)**
**Müddət:** 30-45 dəqiqə
**Məqsəd:** Vercel-ə deploy

- [ ] `public/` folderini silmək/arxivləmək
- [ ] Build test (`npm run build`)
- [ ] Vercel deploy
- [ ] Environment variables yoxla
- [ ] Domain setup (optional)
- [ ] Final testing

---

## 📊 TOPLAM MÜDDƏT

**Realist qiymət:**
- **Minimum:** 13-14 session (~8-10 gün)
- **Maximum:** 15-18 session (~2 həftə)

**Hər session:**
- 30 dəqiqə - 2 saat arası
- Test + bug fix daxil

---

## 🔄 ROLLBACK PLANI

Əgər problem çıxarsa:

1. **Static HTML saxlanır:** `public/` folderi arxivlənir, silinmir
2. **Git branches:** Hər phase ayrı branch (optional)
3. **Vercel Preview:** Hər deploy preview URL alır
4. **Database:** Dəyişmir, yalnız query-lər optimallaşdırılır

---

## ✅ SUCCESS KRİTERİYALARI

Migration uğurlu sayılır əgər:

1. ✅ Bütün 11 səhifə Next.js-də işləyir
2. ✅ Admin paneldən məzmun idarə olunur
3. ✅ SEO score 90+ (Lighthouse)
4. ✅ Performance score 85+ (Lighthouse)
5. ✅ Mobile responsive düzgün
6. ✅ Bütün API calls işləyir
7. ✅ Footer dinamik (Settings API-dən)

---

## 📝 QEYDLƏR

- Hər phase-dən sonra **test** edilir
- Problemlər dərhal həll olunur
- Context refresh lazım olarsa, state saxlanır
- Git commits hər phase-dən sonra

---

**Hazırlayan:** AI Assistant  
**Tarix:** 2026-01-29  
**Variant:** 2 (Addım-addım)  
**Status:** 🚀 Başlandı
