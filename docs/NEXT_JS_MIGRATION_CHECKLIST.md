# NEXT.JS MIGRATION CHECKLIST

## ✅ PROGRESS TRACKER

**Status Legend:**
- ✅ Tamamlandı
- 🔄 Davam edir
- ⏳ Gözləyir
- ❌ Problemli

---

## 📋 PHASE 1: HAZIRLIK
**Status:** 🔄 Davam edir  
**Başlama:** 2026-01-29  
**Bitmə:** -

### Dokumentasiya
- [x] `NEXT_JS_MIGRATION_PLAN.md` yaradıldı
- [x] `NEXT_JS_FILE_STRUCTURE.md` yaradıldı
- [x] `NEXT_JS_MIGRATION_CHECKLIST.md` yaradıldı (bu fayl)
- [ ] `MIGRATION_GUIDE.md` yaradılacaq

### TODO List
- [ ] TodoWrite tool ilə task list yaratmaq

### Struktur Hazırlığı
- [ ] `src/components/public/` folder yaratmaq
- [ ] `src/components/public/Layout/` folder yaratmaq
- [ ] `src/components/public/SEO/` folder yaratmaq
- [ ] `src/lib/seo/` folder yaratmaq
- [ ] `src/hooks/` folder yaratmaq
- [ ] `src/styles/public/` folder yaratmaq

### Git
- [ ] Git commit: "docs: Add Next.js migration documentation"

---

## 📋 PHASE 2: LAYOUT VƏ COMPONENTS
**Status:** ⏳ Gözləyir

### Layout Components
- [ ] `components/public/Layout/Header.tsx`
- [ ] `components/public/Layout/Footer.tsx`
- [ ] `components/public/Layout/Navigation.tsx`
- [ ] `components/public/Layout/index.tsx`

### SEO Components
- [ ] `components/public/SEO/MetaTags.tsx`
- [ ] `components/public/SEO/StructuredData.tsx`

### Helper Functions
- [ ] `lib/seo/generateMetadata.ts`
- [ ] `lib/seo/structuredData.ts`

### Test
- [ ] Header render test
- [ ] Footer API data test
- [ ] Navigation links test

### Git
- [ ] Git commit: "feat: Add public layout components"

---

## 📋 PHASE 3: ANA SƏHİFƏ
**Status:** ⏳ Gözləyir

### Page Setup
- [ ] `app/(public)/layout.tsx` yaratmaq
- [ ] `app/(public)/page.tsx` yaratmaq (SSG)

### Components
- [ ] Hero section component
- [ ] Partner brands section
- [ ] Services showcase (API integration)
- [ ] Statistics/counters
- [ ] Mission/Vision section
- [ ] CTA section

### Data Fetching
- [ ] `getStaticProps()` - services
- [ ] `getStaticProps()` - settings
- [ ] ISR konfiqurasiya (revalidate: 60)

### SEO
- [ ] Meta tags
- [ ] Structured data (LocalBusiness)
- [ ] Open Graph tags

### Test
- [ ] `/` route render
- [ ] Services data display
- [ ] Footer dinamik
- [ ] Lighthouse SEO score

### Git
- [ ] Git commit: "feat: Add dynamic home page"

---

## 📋 PHASE 4: HAQQIMIZDA
**Status:** ⏳ Gözləyir

### Page Setup
- [ ] `app/(public)/about/page.tsx` (SSG)

### Components
- [ ] About content component
- [ ] Team section (future: database)
- [ ] Timeline/History

### SEO
- [ ] Meta tags
- [ ] Structured data

### Test
- [ ] `/about` render
- [ ] Layout düzgün

### Git
- [ ] Git commit: "feat: Add about page"

---

## 📋 PHASE 5: ƏLAQƏ
**Status:** ⏳ Gözləyir

### Page Setup
- [ ] `app/(public)/contact/page.tsx` (SSR)

### Components
- [ ] `components/public/Contact/ContactForm.tsx`
- [ ] `components/public/Contact/ContactInfo.tsx`
- [ ] `components/public/Contact/GoogleMap.tsx`

### API Integration
- [ ] Contact info (Settings API)
- [ ] Form submission handler

### Test
- [ ] `/contact` render
- [ ] Form validation
- [ ] Form submission
- [ ] Contact data API

### Git
- [ ] Git commit: "feat: Add contact page with dynamic form"

---

## 📋 PHASE 6: XİDMƏT SƏHİFƏLƏRİ
**Status:** ⏳ Gözləyir

### Services Index
- [ ] `app/(public)/services/page.tsx` (SSG)
- [ ] `components/public/Services/ServiceGrid.tsx`
- [ ] `components/public/Services/ServiceCard.tsx`
- [ ] `components/public/Services/CategoryFilter.tsx`

### Single Service
- [ ] `app/(public)/services/[slug]/page.tsx` (SSG)
- [ ] `generateStaticParams()` implementation
- [ ] `components/public/Services/ServiceDetail.tsx`
- [ ] `components/public/Services/RelatedServices.tsx`

### Data Fetching
- [ ] `useServices` hook
- [ ] ISR konfiqurasiya

### SEO
- [ ] Dynamic meta tags
- [ ] Structured data (Service schema)

### Test
- [ ] `/services` render və filter
- [ ] `/services/[slug]` dynamic routes
- [ ] SEO per service

### Git
- [ ] Git commit: "feat: Add dynamic service pages"

---

## 📋 PHASE 7: KATEQORİYA SƏHİFƏLƏRİ
**Status:** ⏳ Gözləyir

### Page Setup
- [ ] `app/(public)/categories/[slug]/page.tsx` (SSG)
- [ ] `generateStaticParams()` - categories

### Components
- [ ] Category header
- [ ] Services in category (filtered)
- [ ] Brands/Models display

### Data Fetching
- [ ] `useCategories` hook

### SEO
- [ ] Dynamic meta tags per category

### Test
- [ ] `/categories/smartphone` test
- [ ] Category filtering
- [ ] SEO

### Git
- [ ] Git commit: "feat: Add category pages"

---

## 📋 PHASE 8: QİYMƏT KALKULYATORU
**Status:** ⏳ Gözləyir

### Page Setup
- [ ] `app/(public)/preisliste/page.tsx` (SSR)

### Components
- [ ] `components/public/Preisliste/WizardStep.tsx`
- [ ] `components/public/Preisliste/CategorySelect.tsx`
- [ ] `components/public/Preisliste/BrandSelect.tsx`
- [ ] `components/public/Preisliste/ModelSelect.tsx`
- [ ] `components/public/Preisliste/ServiceSelect.tsx`
- [ ] `components/public/Preisliste/PriceSummary.tsx`

### Logic
- [ ] Multi-step wizard state management
- [ ] Dynamic data loading
- [ ] Price calculation
- [ ] Form submission

### Test
- [ ] Wizard flow
- [ ] Dynamic selects
- [ ] Price calculation
- [ ] Form submission

### Git
- [ ] Git commit: "feat: Add price calculator wizard"

---

## 📋 PHASE 9: SEO OPTIMALLAŞDIRMA
**Status:** ⏳ Gözləyir

### Sitemap
- [ ] `next-sitemap` package install
- [ ] `next-sitemap.config.js` yaratmaq
- [ ] Dynamic sitemap generator
- [ ] `/sitemap.xml` test

### Robots.txt
- [ ] `public/robots.txt` generator
- [ ] Sitemap URL əlavə et

### Structured Data
- [ ] LocalBusiness schema (home)
- [ ] Service schema (services)
- [ ] Organization schema (about)

### Meta Tags
- [ ] Open Graph images
- [ ] Twitter Card meta
- [ ] Canonical URLs

### Test
- [ ] Google Search Console test
- [ ] Lighthouse SEO 90+

### Git
- [ ] Git commit: "feat: Add SEO optimization"

---

## 📋 PHASE 10: IMAGE OPTIMALLAŞDIRMA
**Status:** ⏳ Gözləyir

### Image Component
- [ ] `<img>` → `<Image>` (Next.js)
- [ ] Image sizes konfiqurasiya
- [ ] Lazy loading

### Configuration
- [ ] `next.config.js` image settings
- [ ] Image domains whitelist

### Test
- [ ] Image load performance
- [ ] Responsive images

### Git
- [ ] Git commit: "feat: Optimize images with Next.js Image"

---

## 📋 PHASE 11: CSS MİGRATİON
**Status:** ⏳ Gözləyir

### CSS Organization
- [ ] `src/styles/globals.css` yaratmaq
- [ ] Import existing CSS
- [ ] Organize by component

### Test
- [ ] Styles render düzgün
- [ ] Responsive test

### Git
- [ ] Git commit: "feat: Migrate CSS to Next.js"

---

## 📋 PHASE 12: TESTING & BUG FIXES
**Status:** ⏳ Gözləyir

### Functional Testing
- [ ] All routes work
- [ ] Forms submit
- [ ] API calls successful
- [ ] Links work

### Visual Testing
- [ ] Mobile responsive
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Dark mode (if applicable)

### Performance Testing
- [ ] Lighthouse Performance 85+
- [ ] Lighthouse SEO 90+
- [ ] Lighthouse Accessibility 90+

### Bug Fixes
- [ ] List and fix bugs
- [ ] Regression testing

### Git
- [ ] Git commit: "fix: Bug fixes and testing"

---

## 📋 PHASE 13: DEPLOYMENT
**Status:** ⏳ Gözləyir

### Pre-Deployment
- [ ] `public/` HTML files archive/delete
- [ ] `npm run build` success
- [ ] Environment variables check

### Vercel Deployment
- [ ] Deploy to Vercel
- [ ] Environment variables set
- [ ] Preview URL test

### Post-Deployment
- [ ] Production URL test
- [ ] Google Search Console submit sitemap
- [ ] Analytics setup (optional)

### Documentation
- [ ] Update README.md
- [ ] Update DEPLOYMENT.md
- [ ] Migration summary

### Git
- [ ] Git commit: "chore: Production deployment"
- [ ] Git tag: `v2.0.0-nextjs`

---

## 📊 OVERALL PROGRESS

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1 | 🔄 | 75% |
| Phase 2 | ⏳ | 0% |
| Phase 3 | ⏳ | 0% |
| Phase 4 | ⏳ | 0% |
| Phase 5 | ⏳ | 0% |
| Phase 6 | ⏳ | 0% |
| Phase 7 | ⏳ | 0% |
| Phase 8 | ⏳ | 0% |
| Phase 9 | ⏳ | 0% |
| Phase 10 | ⏳ | 0% |
| Phase 11 | ⏳ | 0% |
| Phase 12 | ⏳ | 0% |
| Phase 13 | ⏳ | 0% |

**Overall:** 5.7% Complete

---

## 🎯 NEXT STEPS

1. ✅ Finish Phase 1 documentation
2. ⏳ Create TODO list
3. ⏳ Create layout components
4. ⏳ Test and commit

---

**Last Updated:** 2026-01-29  
**Next Update:** After Phase 1 completion
