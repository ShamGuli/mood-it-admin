# 🏗️ System Architecture - Mood IT

**Version:** 1.0.0  
**Date:** January 28, 2026  
**Status:** Design Phase

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Deployment Architecture](#deployment-architecture)
7. [Scalability](#scalability)

---

## 1. OVERVIEW

### 1.1 System Purpose

Mood IT Backend & Admin Panel system provides:
- **Dynamic Content Management** - Update website content without code changes
- **Service Catalog Management** - Manage categories, brands, models, and services
- **Booking System** - Handle customer service requests
- **Admin Dashboard** - Monitor business metrics and manage operations
- **RESTful API** - Serve data to frontend applications

### 1.2 Architecture Style

**Monorepo Structure** with:
- **Frontend (Public)**: Next.js Static/SSG pages
- **Admin Panel**: Next.js App (separate deployment)
- **Backend API**: Next.js API Routes OR Express.js (decision pending)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                        USERS                               │
│                                                            │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐       │
│  │ Customer │      │  Admin   │      │Technician│       │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘       │
└───────┼─────────────────┼─────────────────┼──────────────┘
        │                 │                 │
        │                 │                 │
        ▼                 ▼                 ▼
┌────────────────┐ ┌──────────────────┐ ┌────────────────┐
│   Public Web   │ │  Admin Panel     │ │   Mobile App   │
│   (Next.js)    │ │  (Next.js)       │ │   (Future)     │
│                │ │                  │ │                │
│  - Home        │ │  - Dashboard     │ │  - View Orders │
│  - Services    │ │  - Services CRUD │ │  - Update      │
│  - Booking     │ │  - Bookings      │ │    Status      │
│  - Contact     │ │  - Content CMS   │ │                │
└───────┬────────┘ └────────┬─────────┘ └───────┬────────┘
        │                   │                    │
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │      API GATEWAY              │
            │    (Next.js API Routes)       │
            │                               │
            │  - /api/v1/auth/*            │
            │  - /api/v1/services/*        │
            │  - /api/v1/bookings/*        │
            │  - /api/v1/content/*         │
            │  - /api/v1/settings/*        │
            └───────────────┬───────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │   Supabase   │  │  Email API   │
│   Database   │  │   Storage    │  │  (SendGrid)  │
│ (PostgreSQL) │  │   (Files)    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

### 2.2 Component Architecture

#### 2.2.1 Frontend (Public Website)

**Path:** `/frontend` or root HTML files

**Technology:** Next.js 14 (Static/SSG) OR Static HTML (current)

**Responsibilities:**
- Display service catalog (dynamic from API)
- Booking form (submit to API)
- Contact form
- Content loaded from CMS API

**Pages:**
- `/` - Home
- `/about` - About
- `/services` - All services
- `/services/[slug]` - Single service
- `/preisliste` - Pricing wizard
- `/contact` - Contact

**Data Fetching:**
```typescript
// Example: Load services on page load
const services = await fetch('/api/v1/services?is_active=true')
  .then(res => res.json());
```

---

#### 2.2.2 Admin Panel

**Path:** `/admin`

**Technology:** Next.js 14 (App Router) + TypeScript

**Folder Structure:**
```
admin/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Sidebar + TopBar
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── services/
│   │   │   │   ├── page.tsx        # List
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Edit
│   │   │   ├── bookings/
│   │   │   ├── content/
│   │   │   └── settings/
│   │   └── api/                    # Optional: API routes
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── forms/                  # Form components
│   │   ├── layout/                 # Sidebar, TopBar, etc.
│   │   └── charts/                 # Chart components
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── api.ts                  # API client
│   │   └── utils.ts                # Utility functions
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useServices.ts
│   │   └── useBookings.ts
│   ├── store/
│   │   └── authStore.ts            # Zustand store
│   └── types/
│       └── index.ts                # TypeScript types
├── public/
└── package.json
```

**Key Features:**
- Server Components (default)
- Client Components where needed (forms, interactive UI)
- Route protection with middleware
- Real-time updates (Supabase subscriptions)

---

#### 2.2.3 Backend API

**Option A: Next.js API Routes** (Recommended)

**Path:** `/admin/src/app/api` OR `/backend/api`

**Structure:**
```
api/
├── v1/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── me/route.ts
│   ├── services/
│   │   ├── route.ts              # GET, POST
│   │   └── [id]/route.ts         # GET, PUT, DELETE
│   ├── bookings/
│   ├── categories/
│   └── content/
```

**Example Route:**
```typescript
// api/v1/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();
  
  // Validation with Zod
  const validated = serviceSchema.parse(body);
  
  const { data, error } = await supabase
    .from('services')
    .insert(validated)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
  
  return NextResponse.json({ success: true, data }, { status: 201 });
}
```

---

**Option B: Express.js** (Standalone Backend)

**Path:** `/backend`

**Structure:**
```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── services.routes.ts
│   │   │   └── bookings.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── services.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   └── validators/
│   │       └── service.validator.ts
│   ├── services/
│   │   ├── supabase.service.ts
│   │   └── email.service.ts
│   ├── utils/
│   └── types/
├── package.json
└── tsconfig.json
```

**Example Controller:**
```typescript
// controllers/services.controller.ts
export const getServices = async (req: Request, res: Response) => {
  const { category_id, is_active } = req.query;
  
  let query = supabase.from('services').select('*');
  
  if (category_id) query = query.eq('category_id', category_id);
  if (is_active) query = query.eq('is_active', is_active);
  
  const { data, error } = await query;
  
  if (error) {
    return res.status(500).json({ success: false, error });
  }
  
  return res.json({ success: true, data });
};
```

---

#### 2.2.4 Database Layer (Supabase)

**Connection:**
```typescript
// lib/supabase/server.ts (for Server Components/API Routes)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

```typescript
// lib/supabase/client.ts (for Client Components)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Query Examples:**
```typescript
// Select with join
const { data } = await supabase
  .from('services')
  .select(`
    *,
    category:service_categories(id, name_de)
  `)
  .eq('is_active', true);

// Insert
const { data, error } = await supabase
  .from('bookings')
  .insert({
    customer_name: 'John Doe',
    customer_phone: '+43 123',
    service_id: 'uuid'
  })
  .select()
  .single();

// Update
const { error } = await supabase
  .from('bookings')
  .update({ status: 'confirmed' })
  .eq('id', bookingId);

// Real-time subscription
const channel = supabase
  .channel('bookings')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookings'
  }, (payload) => {
    console.log('New booking:', payload.new);
  })
  .subscribe();
```

---

## 3. TECHNOLOGY STACK

### 3.1 Frontend Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | React framework, SSR/SSG |
| **Language** | TypeScript | Type safety |
| **UI Library** | Material-UI v5 | Pre-built components |
| **Styling** | Emotion (CSS-in-JS) | Component styling |
| **State Management** | Zustand | Global state (auth, etc.) |
| **Data Fetching** | TanStack Query | API calls, caching |
| **Forms** | React Hook Form | Form handling |
| **Validation** | Zod | Schema validation |
| **Charts** | Recharts | Data visualization |

### 3.2 Backend Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 20+ | JavaScript runtime |
| **Framework** | Next.js API Routes | API endpoints |
| **Language** | TypeScript | Type safety |
| **Database** | Supabase (PostgreSQL) | Data persistence |
| **ORM** | Supabase Client SDK | Database queries |
| **Authentication** | Supabase Auth | User auth (JWT) |
| **Storage** | Supabase Storage | File uploads |
| **Email** | SendGrid / Resend | Transactional emails |
| **Validation** | Zod | Input validation |

### 3.3 DevOps & Tools

| Category | Tool | Purpose |
|----------|------|---------|
| **Version Control** | Git + GitHub | Code repository |
| **CI/CD** | GitHub Actions | Automated deployment |
| **Hosting (Admin)** | Vercel | Next.js hosting |
| **Hosting (Public)** | Vercel / Netlify | Static hosting |
| **Database** | Supabase Cloud | Managed PostgreSQL |
| **Monitoring** | Vercel Analytics | Performance monitoring |
| **Error Tracking** | Sentry (optional) | Error reporting |

---

## 4. DATA FLOW

### 4.1 Booking Creation Flow

```
┌──────────┐
│ Customer │
│  (Web)   │
└────┬─────┘
     │ 1. Fill booking form
     │
     ▼
┌─────────────────┐
│ Booking Form    │
│ (React)         │
└────┬────────────┘
     │ 2. Submit (POST /api/v1/bookings)
     │
     ▼
┌─────────────────┐
│ API Endpoint    │
│ (Next.js Route) │
└────┬────────────┘
     │ 3. Validate input (Zod)
     │
     ▼
┌─────────────────┐
│ Supabase Client │
│ (Insert Query)  │
└────┬────────────┘
     │ 4. Insert into bookings table
     │
     ▼
┌─────────────────┐
│ PostgreSQL      │
│ (Database)      │
└────┬────────────┘
     │ 5. Return created booking
     │
     ▼
┌─────────────────┐
│ Email Service   │
│ (SendGrid)      │
└────┬────────────┘
     │ 6. Send confirmation email
     │
     ▼
┌──────────┐
│ Customer │ Receives email
└──────────┘

     ║ 7. Real-time notification
     ▼
┌──────────┐
│  Admin   │ Dashboard updates
└──────────┘
```

---

### 4.2 Admin Content Update Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │ 1. Edit content in CMS
     │
     ▼
┌─────────────────┐
│ Content Editor  │
│ (Rich Text)     │
└────┬────────────┘
     │ 2. Save (PUT /api/v1/content/:page/:section)
     │
     ▼
┌─────────────────┐
│ API Endpoint    │
│ (Auth Required) │
└────┬────────────┘
     │ 3. Verify JWT token
     │ 4. Check admin role
     │
     ▼
┌─────────────────┐
│ Supabase Client │
│ (Update Query)  │
└────┬────────────┘
     │ 5. Update content_pages table
     │
     ▼
┌─────────────────┐
│ PostgreSQL      │
└────┬────────────┘
     │ 6. Return success
     │
     ▼
┌──────────┐
│  Admin   │ Toast notification
└──────────┘

     ║ 7. Next page visit
     ▼
┌──────────┐
│ Customer │ Sees updated content
└──────────┘
```

---

## 5. SECURITY ARCHITECTURE

### 5.1 Authentication Flow (JWT)

```
┌──────────┐
│  Admin   │ 1. Enter email/password
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Login Endpoint  │ 2. Validate credentials
│ POST /api/auth  │
│    /login       │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Supabase Auth   │ 3. Check user exists
│                 │ 4. Verify password hash
└────┬────────────┘
     │ 5. Generate JWT tokens
     │    - Access Token (15 min)
     │    - Refresh Token (7 days)
     ▼
┌──────────┐
│  Admin   │ 6. Store tokens (httpOnly cookie)
└────┬─────┘
     │
     │ 7. API Request with token
     ▼
┌─────────────────┐
│ Protected API   │ 8. Verify JWT signature
│                 │ 9. Check expiry
│                 │ 10. Decode user info
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ RLS Policies    │ 11. Check user role
│ (Supabase)      │ 12. Filter data by role
└─────────────────┘
```

### 5.2 Row Level Security (RLS)

**Example Policy:**
```sql
-- Admins can do everything
CREATE POLICY "Admins full access" ON services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.is_active = true
    )
  );

-- Public can only view active services
CREATE POLICY "Public read active services" ON services
  FOR SELECT
  USING (is_active = true);

-- Technicians can update bookings assigned to them
CREATE POLICY "Technicians update own bookings" ON bookings
  FOR UPDATE
  USING (
    assigned_to = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'technician')
    )
  );
```

### 5.3 Input Validation

**Zod Schema Example:**
```typescript
import { z } from 'zod';

export const serviceSchema = z.object({
  category_id: z.string().uuid(),
  name_de: z.string().min(3).max(255),
  name_en: z.string().max(255).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  price_min: z.number().positive(),
  price_max: z.number().positive(),
  features: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
}).refine(data => data.price_max >= data.price_min, {
  message: "Max price must be >= min price",
  path: ["price_max"],
});

// Usage in API
const validated = serviceSchema.parse(requestBody);
```

### 5.4 Rate Limiting

**Middleware Example:**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "15 m"),
});

export async function rateLimitMiddleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }
}
```

---

## 6. DEPLOYMENT ARCHITECTURE

### 6.1 Production Deployment

```
┌─────────────────────────────────────────┐
│            GitHub Repository             │
│                                          │
│  - Push to main branch                   │
└────────────┬────────────────────────────┘
             │
             │ Trigger CI/CD
             ▼
┌─────────────────────────────────────────┐
│         GitHub Actions                   │
│                                          │
│  1. Run tests                            │
│  2. Build Next.js projects               │
│  3. Deploy to Vercel                     │
└────────────┬────────────────────────────┘
             │
    ┌────────┴─────────┐
    │                  │
    ▼                  ▼
┌─────────┐      ┌──────────┐
│ Vercel  │      │  Vercel  │
│ (Admin) │      │ (Public) │
│         │      │          │
│ admin.  │      │ moodit.  │
│ moodit  │      │ at       │
│ .at     │      │          │
└────┬────┘      └────┬─────┘
     │                │
     └────────┬───────┘
              │
              │ Connect to
              ▼
    ┌─────────────────┐
    │   Supabase      │
    │   (Database +   │
    │    Storage +    │
    │    Auth)        │
    └─────────────────┘
```

### 6.2 Environment Variables

**Admin Panel (.env.local):**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (server-only)

# API
NEXT_PUBLIC_API_URL=https://admin.moodit.at/api

# Email
SENDGRID_API_KEY=SG.xxx

# Auth
JWT_SECRET=your-secret-key
```

**Public Website (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://admin.moodit.at/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 6.3 Vercel Configuration

**Admin Panel (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

---

## 7. SCALABILITY

### 7.1 Database Optimization

**Indexing Strategy:**
- Primary keys (UUID) automatically indexed
- Foreign keys indexed
- Frequently queried columns indexed
- Composite indexes for common queries

**Query Optimization:**
- Use select() to limit columns
- Pagination for large datasets
- Connection pooling (Supabase handles)

**Caching:**
- React Query client-side caching (5 min default)
- Stale-while-revalidate strategy
- Cache invalidation on mutations

### 7.2 Horizontal Scaling

**Current (MVP):**
- Single Next.js deployment
- Supabase Pro plan (99.9% uptime)

**Future (Growth):**
- Load balancer (Vercel automatic)
- CDN for static assets (Vercel automatic)
- Read replicas (Supabase add-on)
- Redis for session storage (optional)

### 7.3 Monitoring & Alerts

**Metrics to Track:**
- API response times (p50, p95, p99)
- Error rates (by endpoint)
- Database query performance
- User session duration
- Booking conversion rate

**Alerting:**
- Sentry for error tracking
- Vercel Analytics for performance
- Supabase Dashboard for DB metrics
- Email alerts on critical errors

---

## 8. BACKUP & DISASTER RECOVERY

### 8.1 Backup Strategy

**Database:**
- Supabase automatic daily backups (7-day retention)
- Weekly manual exports (pg_dump)
- Store backups in separate cloud (AWS S3)

**Files (Supabase Storage):**
- Automatic replication (Supabase)
- Weekly sync to external storage

### 8.2 Recovery Plan

**RTO (Recovery Time Objective):** 1 hour  
**RPO (Recovery Point Objective):** 24 hours

**Steps:**
1. Identify issue (monitoring alerts)
2. Assess data loss (last backup time)
3. Restore from Supabase backup
4. Verify data integrity
5. Resume operations
6. Post-mortem analysis

---

**Architecture Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Architect:** Mood IT Dev Team

---

© 2026 Mood IT - Confidential