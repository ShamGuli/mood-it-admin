# NEXT.JS FILE STRUCTURE

## 📂 YENİ LAYIHƏ STRUKTURU

```
admin/
├── src/
│   ├── app/
│   │   ├── (admin)/                    # Admin Panel Routes (Mövcud)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                # Dashboard
│   │   │   ├── login/
│   │   │   ├── services/
│   │   │   ├── categories/
│   │   │   ├── brands/
│   │   │   ├── bookings/
│   │   │   ├── users/
│   │   │   ├── content/
│   │   │   └── settings/
│   │   │
│   │   ├── (public)/                   # Public Website Routes (YENİ)
│   │   │   ├── layout.tsx              # Public layout
│   │   │   ├── page.tsx                # Ana səhifə (/)
│   │   │   ├── about/
│   │   │   │   └── page.tsx            # Haqqımızda (/about)
│   │   │   ├── contact/
│   │   │   │   └── page.tsx            # Əlaqə (/contact)
│   │   │   ├── services/
│   │   │   │   ├── page.tsx            # Bütün xidmətlər (/services)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Tək xidmət (/services/[slug])
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx        # Kateqoriya (/categories/[slug])
│   │   │   └── preisliste/
│   │   │       └── page.tsx            # Qiymət kalkulyatoru (/preisliste)
│   │   │
│   │   ├── api/                        # API Routes (Mövcud + Yeni)
│   │   │   ├── v1/                     # Admin API (Mövcud)
│   │   │   └── public/                 # Public API (Mövcud)
│   │   │       ├── categories/
│   │   │       ├── services/
│   │   │       ├── settings/
│   │   │       └── contact/
│   │   │
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css                 # Global styles
│   │
│   ├── components/
│   │   ├── admin/                      # Admin Components (Mövcud)
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   └── forms/
│   │   │
│   │   └── public/                     # Public Website Components (YENİ)
│   │       ├── Layout/
│   │       │   ├── Header.tsx          # Site header
│   │       │   ├── Footer.tsx          # Site footer
│   │       │   ├── Navigation.tsx      # Main navigation
│   │       │   └── index.tsx           # Layout wrapper
│   │       │
│   │       ├── SEO/
│   │       │   ├── MetaTags.tsx        # Dynamic meta tags
│   │       │   ├── StructuredData.tsx  # JSON-LD schema
│   │       │   └── SocialShare.tsx     # Social media meta
│   │       │
│   │       ├── Hero/
│   │       │   ├── HeroSection.tsx     # Ana səhifə hero
│   │       │   └── PageHeader.tsx      # Səhifə başlığı
│   │       │
│   │       ├── Services/
│   │       │   ├── ServiceCard.tsx     # Xidmət kartı
│   │       │   ├── ServiceGrid.tsx     # Grid layout
│   │       │   ├── ServiceDetail.tsx   # Detail view
│   │       │   ├── CategoryFilter.tsx  # Filter by category
│   │       │   └── RelatedServices.tsx # Related services
│   │       │
│   │       ├── Contact/
│   │       │   ├── ContactForm.tsx     # Contact form
│   │       │   ├── ContactInfo.tsx     # Contact info display
│   │       │   └── GoogleMap.tsx       # Map component
│   │       │
│   │       ├── Preisliste/
│   │       │   ├── WizardStep.tsx      # Multi-step wizard
│   │       │   ├── CategorySelect.tsx  # Category selection
│   │       │   ├── BrandSelect.tsx     # Brand selection
│   │       │   ├── ModelSelect.tsx     # Model selection
│   │       │   ├── ServiceSelect.tsx   # Service selection
│   │       │   └── PriceSummary.tsx    # Price calculation
│   │       │
│   │       ├── About/
│   │       │   ├── AboutContent.tsx    # About us content
│   │       │   ├── Team.tsx            # Team section
│   │       │   └── Timeline.tsx        # Company history
│   │       │
│   │       └── ui/                     # Reusable UI components
│   │           ├── Button.tsx
│   │           ├── Card.tsx
│   │           ├── Input.tsx
│   │           ├── Loader.tsx
│   │           └── Badge.tsx
│   │
│   ├── lib/
│   │   ├── supabase/                   # Supabase client (Mövcud)
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── seo/                        # SEO Helpers (YENİ)
│   │   │   ├── generateMetadata.ts     # Metadata generator
│   │   │   ├── structuredData.ts       # Schema.org helpers
│   │   │   └── sitemap.ts              # Sitemap generator
│   │   │
│   │   └── utils/                      # Utility functions
│   │       ├── formatters.ts           # Format helpers
│   │       └── validators.ts           # Validation
│   │
│   ├── hooks/                          # React Hooks (YENİ)
│   │   ├── useServices.ts              # Services data hook
│   │   ├── useCategories.ts            # Categories data hook
│   │   └── useSettings.ts              # Settings data hook
│   │
│   ├── types/                          # TypeScript Types (Mövcud)
│   │   ├── database.types.ts           # Supabase types
│   │   ├── api.types.ts                # API types
│   │   └── public.types.ts             # Public site types (YENİ)
│   │
│   └── styles/                         # Styles (YENİ)
│       ├── globals.css                 # Global CSS
│       ├── variables.css               # CSS variables
│       └── public/                     # Public site styles
│           ├── layout.css
│           ├── components.css
│           └── utilities.css
│
├── public/                             # Static Assets
│   ├── images/                         # Images
│   │   ├── logo.png
│   │   ├── favicon.png
│   │   └── services/
│   ├── fonts/                          # Fonts
│   ├── icons/                          # Icons/SVGs
│   └── [ARCHIVED]/                     # Old HTML files (backup)
│       ├── index.html
│       ├── about.html
│       └── ...
│
├── docs/                               # Documentation
│   ├── NEXT_JS_MIGRATION_PLAN.md       # Migration plan
│   ├── NEXT_JS_FILE_STRUCTURE.md       # This file
│   ├── NEXT_JS_MIGRATION_CHECKLIST.md  # Checklist
│   ├── MIGRATION_GUIDE.md              # HTML → Next.js guide
│   ├── PRD.md                          # Product requirements (Mövcud)
│   ├── ARCHITECTURE.md                 # Architecture (Mövcud)
│   └── API_DOCUMENTATION.md            # API docs (Mövcud)
│
├── next.config.js                      # Next.js config
├── next-sitemap.config.js              # Sitemap config (YENİ)
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
└── .env.local                          # Environment variables
```

---

## 📁 FOLDER AÇIQLAMALARI

### **(admin)** - Admin Panel Routes
Protected routes, authentication tələb edir.

### **(public)** - Public Website Routes
Public-facing səhifələr, authentication tələb etmir.

### **components/public/**
Public website üçün reusable component-lər.

### **lib/seo/**
SEO helper functions:
- Meta tags generation
- Structured data (JSON-LD)
- Sitemap generation

### **hooks/**
Custom React hooks, data fetching üçün.

---

## 🔄 MİGRATİON MAPPİNG

| Old File | New File | Type |
|----------|----------|------|
| `public/index.html` | `app/(public)/page.tsx` | SSG |
| `public/about.html` | `app/(public)/about/page.tsx` | SSG |
| `public/contact.html` | `app/(public)/contact/page.tsx` | SSR |
| `public/service-all.html` | `app/(public)/services/page.tsx` | SSG |
| `public/service-smartphone.html` | `app/(public)/categories/smartphone/page.tsx` | SSG |
| `public/preisliste.html` | `app/(public)/preisliste/page.tsx` | SSR |
| `public/css/custom.css` | `src/styles/public/` | CSS Modules |
| `public/js/api-client.js` | `src/hooks/useServices.ts` | React Hook |

---

## 📝 FİLE NAMİNG CONVENTİONS

### Components:
- PascalCase: `ServiceCard.tsx`, `Footer.tsx`
- Folder per component (optional): `ServiceCard/index.tsx`

### Pages:
- `page.tsx` - Route file
- `layout.tsx` - Layout file
- `loading.tsx` - Loading UI
- `error.tsx` - Error handling

### Styles:
- `globals.css` - Global styles
- `ComponentName.module.css` - Component-specific (optional)

### Hooks:
- `use` prefix: `useServices.ts`, `useCategories.ts`

### Utils:
- camelCase: `formatPrice.ts`, `validateForm.ts`

---

## 🎯 ROUTE STRUCTURE

### Public Routes:
```
/                           → Home page
/about                      → About us
/contact                    → Contact form
/services                   → All services
/services/[slug]            → Single service
/categories/[slug]          → Category page
/preisliste                 → Price calculator
```

### Admin Routes (Mövcud):
```
/admin                      → Dashboard
/admin/services             → Services management
/admin/categories           → Categories management
/admin/settings             → Settings
...
```

### API Routes:
```
/api/public/services        → Public services API
/api/public/categories      → Public categories API
/api/public/settings        → Public settings API
/api/v1/services            → Admin services API
...
```

---

## 🔐 ACCESS CONTROL

| Route Type | Authentication | RLS |
|------------|----------------|-----|
| `(public)/*` | ❌ No | ✅ Public data only |
| `(admin)/*` | ✅ Required | ✅ Admin/user roles |
| `/api/public/*` | ❌ No | ✅ Public data only |
| `/api/v1/*` | ✅ Required | ✅ Admin/user roles |

---

## 📦 NEW DEPENDENCIES

Migration zamanı əlavə ediləcək packages:

```json
{
  "dependencies": {
    "next-sitemap": "^4.2.3",         // Sitemap generator
    "@vercel/analytics": "^1.1.1"     // Analytics (optional)
  },
  "devDependencies": {
    "@types/node": "^20.10.0"         // Already exists
  }
}
```

---

**Last Updated:** 2026-01-29
