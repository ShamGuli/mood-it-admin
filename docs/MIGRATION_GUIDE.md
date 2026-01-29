# HTML → NEXT.JS MIGRATION GUIDE

## 🎯 MİGRATİON PRİNSİPLƏRİ

Bu guide HTML səhifələrini Next.js component-lərə çevirmək üçün best practices.

---

## 📋 GENERAL RULES

### 1. File Structure
```
HTML:     public/index.html
Next.js:  app/(public)/page.tsx
```

### 2. Component Naming
- PascalCase: `Header.tsx`, `ServiceCard.tsx`
- Pages: `page.tsx`, `layout.tsx`

### 3. Data Fetching
```typescript
// SSG (Static Site Generation) - Recommended
export async function generateStaticParams() { }

// SSR (Server-Side Rendering) - When needed
export default async function Page() { }

// ISR (Incremental Static Regeneration)
export const revalidate = 60; // seconds
```

---

## 🔄 MIGRATION PATTERNS

### Pattern 1: Static HTML → SSG Page

**Before (HTML):**
```html
<!-- public/about.html -->
<!DOCTYPE html>
<html>
<head>
    <title>About Us</title>
    <meta name="description" content="About our company">
</head>
<body>
    <h1>About Us</h1>
    <p>Company information...</p>
</body>
</html>
```

**After (Next.js):**
```tsx
// app/(public)/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About our company',
};

export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Company information...</p>
    </div>
  );
}
```

---

### Pattern 2: Dynamic Content → API + SSG

**Before (HTML + JS):**
```html
<!-- public/services.html -->
<div id="services-container"></div>

<script>
fetch('/api/public/services')
  .then(res => res.json())
  .then(data => {
    // Render services
  });
</script>
```

**After (Next.js):**
```tsx
// app/(public)/services/page.tsx
import { supabase } from '@/lib/supabase/client';

async function getServices() {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true);
  return data;
}

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60;
```

---

### Pattern 3: Dynamic Routes

**Before (HTML):**
```
public/service-smartphone.html
public/service-notebook.html
public/service-playstation.html
```

**After (Next.js):**
```tsx
// app/(public)/services/[slug]/page.tsx

interface Props {
  params: { slug: string };
}

async function getService(slug: string) {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params.slug);
  
  return (
    <div>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
    </div>
  );
}

// Generate static pages for all services
export async function generateStaticParams() {
  const { data: services } = await supabase
    .from('services')
    .select('slug');
    
  return services.map(service => ({
    slug: service.slug,
  }));
}

export const revalidate = 60;
```

---

### Pattern 4: Forms → Server Actions

**Before (HTML + JS):**
```html
<form id="contactForm">
  <input type="text" name="name" />
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
});
</script>
```

**After (Next.js - Client Component):**
```tsx
// app/(public)/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      alert('Form submitted!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Pattern 5: SEO Meta Tags

**Before (HTML):**
```html
<head>
  <title>Service Page</title>
  <meta name="description" content="Service description">
  <meta property="og:title" content="Service Page">
</head>
```

**After (Next.js):**
```tsx
// app/(public)/services/[slug]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.slug);
  
  return {
    title: service.name,
    description: service.description,
    openGraph: {
      title: service.name,
      description: service.description,
      images: [service.image_url],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  // ...
}
```

---

### Pattern 6: Layouts

**Before (HTML - Repeated code):**
```html
<!-- Every HTML file has this -->
<header>
  <nav>...</nav>
</header>

<main>
  <!-- Page content -->
</main>

<footer>...</footer>
```

**After (Next.js - Shared Layout):**
```tsx
// app/(public)/layout.tsx
import Header from '@/components/public/Layout/Header';
import Footer from '@/components/public/Layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

---

## 🎨 CSS MIGRATION

### Before (HTML)
```html
<link href="css/custom.css" rel="stylesheet">
<link href="css/bootstrap.min.css" rel="stylesheet">
```

### After (Next.js)

**Option 1: Global CSS**
```tsx
// app/layout.tsx
import '@/styles/globals.css';
import '@/styles/bootstrap.css';
```

**Option 2: CSS Modules**
```tsx
// components/ServiceCard.tsx
import styles from './ServiceCard.module.css';

export default function ServiceCard() {
  return <div className={styles.card}>...</div>;
}
```

---

## 🖼️ IMAGE OPTIMIZATION

### Before (HTML)
```html
<img src="images/service.jpg" alt="Service">
```

### After (Next.js)
```tsx
import Image from 'next/image';

<Image
  src="/images/service.jpg"
  alt="Service"
  width={800}
  height={600}
  priority={false}
/>
```

---

## 🔗 LINKS

### Before (HTML)
```html
<a href="/about.html">About</a>
```

### After (Next.js)
```tsx
import Link from 'next/link';

<Link href="/about">About</Link>
```

---

## 🗂️ DATA FETCHING DECISION TREE

```
Need dynamic data?
├─ Yes
│  ├─ Changes frequently? (< 1 min)
│  │  ├─ Yes → SSR (Server-Side Rendering)
│  │  └─ No → SSG with ISR (revalidate: 60)
│  └─ Static content?
│     └─ SSG (Static Site Generation)
└─ No → Static page (no data fetch)
```

---

## 📊 COMPONENT TYPES

### Server Component (Default)
```tsx
// app/(public)/page.tsx
export default async function HomePage() {
  const data = await fetchData(); // Direct fetch
  return <div>{data}</div>;
}
```

### Client Component
```tsx
// components/ContactForm.tsx
'use client'; // Must declare

import { useState } from 'react';

export default function ContactForm() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

---

## 🚦 WHEN TO USE

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Fetch data | ✅ | ❌ (use hooks) |
| useState/useEffect | ❌ | ✅ |
| Access database | ✅ | ❌ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| SEO | ✅ | ⚠️ (limited) |

---

## ✅ CHECKLIST PER PAGE

When migrating a page, ensure:

- [ ] Meta tags configured (title, description, OG)
- [ ] Data fetching strategy chosen (SSG/SSR/ISR)
- [ ] Layout applied
- [ ] Links use `<Link>` component
- [ ] Images use `<Image>` component
- [ ] Forms handled (client component if interactive)
- [ ] SEO structured data added
- [ ] Mobile responsive tested
- [ ] Lighthouse score 90+

---

## 🎯 BEST PRACTICES

1. **Prefer Server Components** - Faster, better SEO
2. **Use ISR** - Automatic revalidation (revalidate: 60)
3. **Lazy load images** - Better performance
4. **Dynamic imports** - Code splitting
5. **Error boundaries** - `error.tsx` files
6. **Loading states** - `loading.tsx` files

---

## 📝 EXAMPLE: COMPLETE MIGRATION

**Before: `public/services.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Our Services</title>
    <meta name="description" content="View all our services">
    <link href="css/custom.css" rel="stylesheet">
</head>
<body>
    <header>
        <nav>...</nav>
    </header>
    
    <main>
        <h1>Our Services</h1>
        <div id="services-grid"></div>
    </main>
    
    <footer>...</footer>
    
    <script src="js/api-client.js"></script>
    <script>
        loadServices();
    </script>
</body>
</html>
```

**After: `app/(public)/services/page.tsx`**
```tsx
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ServiceCard from '@/components/public/Services/ServiceCard';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Our Services',
  description: 'View all our professional repair services',
  openGraph: {
    title: 'Our Services',
    description: 'Professional tech repair services',
  },
};

// Fetch services data
async function getServices() {
  const supabase = createClient();
  const { data } = await supabase
    .from('services')
    .select('*, category:service_categories(*)')
    .eq('is_active', true)
    .order('display_order');
  return data || [];
}

// Page component
export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <div className="services-page">
      <h1>Our Services</h1>
      
      <div className="services-grid">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60;
```

**ServiceCard Component: `components/public/Services/ServiceCard.tsx`**
```tsx
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  service: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price_display: string;
    icon: string;
  };
}

export default function ServiceCard({ service }: Props) {
  return (
    <Link href={`/services/${service.slug}`} className="service-card">
      <div className="service-icon">
        <i className={service.icon}></i>
      </div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <span className="price">{service.price_display}</span>
    </Link>
  );
}
```

---

## 🔍 DEBUGGING TIPS

### Check Build Output
```bash
npm run build
```
Look for:
- ○ (Static) - SSG
- λ (Server) - SSR
- ƒ (Dynamic) - Dynamic rendering

### Verify ISR
Check page headers:
```
X-Vercel-Cache: STALE
```

### Test SEO
- View page source (Ctrl+U)
- Meta tags should be visible
- Content should be in HTML (not loaded by JS)

---

**Migration Date:** 2026-01-29  
**Next.js Version:** 14.2.35  
**App Router:** Yes
