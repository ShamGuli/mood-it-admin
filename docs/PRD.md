# 📋 Mood IT - Product Requirements Document (PRD)

**Version:** 1.0.0  
**Date:** January 28, 2026  
**Status:** Draft  
**Project:** Mood IT Admin Panel & Backend System

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview
Mood IT is a professional tech repair service center based in Wels, Austria. This project aims to build a comprehensive backend system and admin panel to manage the existing static HTML website, enabling dynamic content management, service bookings, pricing management, and customer relationship management.

### 1.2 Business Goals
- **Automate Service Management**: Replace manual updates with dynamic CMS
- **Streamline Booking Process**: Online booking system with real-time notifications
- **Improve Operational Efficiency**: Centralized admin panel for all operations
- **Scale Business**: Support for multiple technicians and locations (future)
- **Data-Driven Decisions**: Analytics and reporting capabilities

### 1.3 Target Users
1. **Admin Users** - Full access to all features
2. **Technicians** - Service updates, booking management
3. **Customers** - Public-facing booking and contact forms
4. **Marketing Team** - Content management (future)

### 1.4 Success Criteria
- ✅ Admin can manage all services without touching code
- ✅ Bookings processed automatically with email notifications
- ✅ Page load time < 2 seconds
- ✅ 99.9% system uptime
- ✅ Zero data breaches
- ✅ Mobile-responsive admin panel

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Admin Panel Features

#### 2.1.1 Dashboard
- **Overview Cards**: Total bookings, revenue, active services, customers
- **Charts**: 
  - Bookings trend (last 30 days)
  - Service popularity (pie chart)
  - Revenue by category (bar chart)
- **Recent Activity**: Latest bookings (real-time updates)
- **Quick Actions**: Add service, view pending bookings, manage content

#### 2.1.2 Service Management
- **CRUD Operations**: Create, Read, Update, Delete services
- **Fields**:
  - Name (German/English)
  - Category (dropdown)
  - Description (rich text editor)
  - Features (array of strings)
  - Price range (min/max)
  - Duration (e.g., "1-2 Stunden")
  - Icon (FontAwesome selector)
  - Status (Active/Inactive)
- **Features**:
  - Bulk operations (delete, activate, deactivate)
  - Search and filter
  - Pagination (20 items per page)
  - Drag-and-drop reordering
  - Duplicate service function

#### 2.1.3 Category Management
- **CRUD Operations**: Manage service categories
- **Fields**:
  - Name (DE/EN)
  - Slug (auto-generated, editable)
  - Icon (FontAwesome)
  - Description (DE/EN)
  - Display order (drag-and-drop)
  - Active status
- **Features**:
  - Category with service count
  - Cannot delete category with active services (warning)

#### 2.1.4 Brand & Model Management
- **Hierarchical Structure**: Categories → Brands → Models
- **Brand Fields**:
  - Name
  - Category assignment
  - Logo upload
  - Active status
- **Model Fields**:
  - Name
  - Brand assignment
  - Release year
  - Active status
- **Features**:
  - Nested view (collapsible tree)
  - Bulk import (CSV)

#### 2.1.5 Booking/Order Management
- **View Modes**: Table, Calendar, Kanban board
- **Filters**:
  - Status (Pending, Confirmed, In Progress, Completed, Cancelled)
  - Date range
  - Service category
  - Customer name/phone
- **Booking Details**:
  - Customer info (name, email, phone, WhatsApp)
  - Device info (category, brand, model)
  - Service selected
  - Estimated price
  - Final price (editable)
  - Status workflow
  - Booking date/time
  - Notes (customer + internal)
- **Actions**:
  - Update status with automatic notifications
  - Send email/SMS to customer
  - Print invoice (future)
  - Export to PDF

#### 2.1.6 Content Management (CMS)
- **Page Management**: 
  - Home, About, Contact, Service pages
  - Section-based editing (Hero, Features, CTA, etc.)
- **Fields**:
  - Section key (unique identifier)
  - Content (rich text editor - TinyMCE/Quill)
  - Language (DE/EN)
  - Media (image upload)
- **Features**:
  - Live preview (iframe)
  - Version history (future)
  - Scheduled publishing (future)
  - SEO fields (meta title, description, keywords)

#### 2.1.7 Settings
- **Business Information**:
  - Company name, address, phone, email
  - WhatsApp number
  - Business hours (per day)
  - Holiday calendar
- **Email Settings**:
  - SMTP configuration
  - Email templates (booking confirmation, status updates)
  - Template variables
- **Notification Settings**:
  - Email notifications (on/off)
  - SMS notifications (future)
  - WhatsApp notifications (future)
- **System Settings**:
  - Default language
  - Currency
  - Timezone
  - Maintenance mode

#### 2.1.8 User Management
- **User Roles**:
  - Admin (full access)
  - Technician (limited access: bookings, services)
  - Customer (read-only, future)
- **CRUD Operations**: Manage users
- **Fields**:
  - Full name, email, phone
  - Role assignment
  - Password reset
  - Active status
- **Activity Logs**: Track user actions (who changed what, when)

---

### 2.2 Backend API Features

#### 2.2.1 Authentication & Authorization
- **JWT-based authentication** (Supabase Auth)
- **Role-based access control (RBAC)**
- **Protected routes** with middleware
- **Password reset** via email
- **Session management**

#### 2.2.2 RESTful API Endpoints
See `API_DOCUMENTATION.md` for detailed endpoints.

**Core Resources:**
- `/api/auth/*` - Authentication
- `/api/services/*` - Service management
- `/api/categories/*` - Category management
- `/api/brands/*` - Brand management
- `/api/models/*` - Model management
- `/api/bookings/*` - Booking management
- `/api/content/*` - Content management
- `/api/settings/*` - Settings management
- `/api/users/*` - User management
- `/api/analytics/*` - Dashboard statistics

#### 2.2.3 Real-time Features (Optional)
- **Supabase Subscriptions**:
  - Real-time booking updates on dashboard
  - Live notification when new booking arrives
  - Service availability updates

#### 2.2.4 Email Integration
- **Email Service**: SendGrid / Mailgun / Resend
- **Templates**:
  - Booking confirmation
  - Status update notifications
  - Password reset
  - Welcome email
- **Variables**: Dynamic content (customer name, service, price, etc.)

#### 2.2.5 WhatsApp Integration
- **WhatsApp Business API** (optional)
- **Features**:
  - Send booking confirmations via WhatsApp
  - Status update messages
  - Quick reply templates

#### 2.2.6 File Upload
- **Supabase Storage**:
  - Service images
  - Brand logos
  - Content media
- **Validation**:
  - File type (JPEG, PNG, WebP, SVG)
  - File size (max 5MB)
  - Image optimization (resize, compress)

---

### 2.3 Frontend Features (Public-facing)

#### 2.3.1 Dynamic Content Loading
- **Pages**: Home, About, Service pages loaded from CMS
- **Service Cards**: Dynamic from database
- **Pricing Wizard**: Dynamic brands/models/services

#### 2.3.2 Booking System
- **Preisliste Wizard** (existing):
  - Step 1: Select category
  - Step 2: Select brand/model
  - Step 3: Select service
  - Step 4: Submit booking (Email + WhatsApp options)
- **Backend Integration**:
  - Form validation
  - API submission
  - Confirmation page
  - Email notification

#### 2.3.3 Contact Form
- **Fields**: Name, Email, Phone, Message
- **Features**:
  - Client-side validation
  - reCAPTCHA (spam protection)
  - Auto-reply email
  - Admin notification

---

## 3. TECHNICAL STACK

### 3.1 Frontend (Admin Panel)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI v5 / Ant Design
- **State Management**: Zustand / React Context
- **Form Handling**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Chart.js / Recharts
- **Rich Text Editor**: TinyMCE / Quill
- **Date Picker**: date-fns / Day.js
- **Icons**: FontAwesome / Material Icons

### 3.2 Backend
- **Option 1**: Next.js 14 API Routes (recommended)
- **Option 2**: Express.js + Node.js (standalone)
- **Language**: TypeScript
- **Database ORM**: Supabase Client SDK
- **Authentication**: Supabase Auth (JWT)
- **File Storage**: Supabase Storage
- **Email**: SendGrid / Resend
- **Validation**: Zod

### 3.3 Database
- **Primary**: Supabase (PostgreSQL)
- **Features**:
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Built-in authentication
  - Storage buckets
- **Migrations**: Supabase CLI / SQL scripts

### 3.4 DevOps & Deployment
- **Hosting**: Vercel (Next.js) / Railway (Node.js)
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics / Sentry
- **Environment**: Development, Staging, Production

---

## 4. DATABASE DESIGN

See `DATABASE_SCHEMA.md` for detailed schema.

**Core Tables:**
1. `users` - Admin/technician accounts
2. `service_categories` - Service categories (Telefon, PlayStation, etc.)
3. `services` - Individual services (Display replacement, etc.)
4. `brands` - Device brands (Apple, Samsung, etc.)
5. `models` - Device models (iPhone 15, Galaxy S24, etc.)
6. `bookings` - Customer bookings/orders
7. `content_pages` - CMS content (page sections)
8. `settings` - System settings (key-value pairs)

**Relationships:**
- Categories → Services (1:N)
- Categories → Brands (1:N)
- Brands → Models (1:N)
- Bookings → Category/Brand/Model/Service (N:1)

---

## 5. SECURITY REQUIREMENTS

### 5.1 Authentication
- ✅ JWT tokens with short expiry (15 min access, 7 day refresh)
- ✅ Secure password hashing (bcrypt)
- ✅ Password strength requirements (min 8 chars, uppercase, number, special char)
- ✅ Account lockout after 5 failed attempts
- ✅ Email verification (optional)

### 5.2 Authorization
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes (middleware)
- ✅ Supabase Row Level Security (RLS)
- ✅ Frontend route guards

### 5.3 Data Protection
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (sanitize inputs)
- ✅ CSRF protection (tokens)
- ✅ Input validation (Zod schemas)
- ✅ Rate limiting (100 requests/15min per IP)
- ✅ HTTPS only (SSL certificate)

### 5.4 Privacy
- ✅ GDPR compliance (data export/delete)
- ✅ Privacy policy (future)
- ✅ Cookie consent (future)

---

## 6. PERFORMANCE REQUIREMENTS

### 6.1 Response Times
- **API Endpoints**: < 300ms (p95)
- **Admin Panel Page Load**: < 2 seconds
- **Public Website**: < 1.5 seconds
- **Database Queries**: < 100ms

### 6.2 Scalability
- **Concurrent Users**: Support 100+ simultaneous users
- **Bookings**: Handle 1000+ bookings/day
- **Database**: 100K+ records without performance degradation

### 6.3 Availability
- **Uptime**: 99.9% (8.76 hours downtime/year max)
- **Backup**: Daily automated backups (Supabase)
- **Recovery**: < 1 hour RTO (Recovery Time Objective)

---

## 7. UI/UX REQUIREMENTS

### 7.1 Design Principles
- **Clean & Modern**: Minimal, professional design
- **Brand Colors**: Purple gradient (#8a4fff), Blue (#4185DD)
- **Responsive**: Desktop-first, mobile-responsive
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark Mode**: Support dark theme (optional)

### 7.2 Admin Panel UX
- **Dashboard**: Overview at a glance
- **Navigation**: Sidebar with icons + labels
- **Feedback**: Toast notifications for actions
- **Loading States**: Skeleton loaders
- **Error Handling**: User-friendly error messages
- **Search**: Global search across entities
- **Keyboard Shortcuts**: Speed up workflows

### 7.3 Public Website UX
- **Fast**: Optimized images, lazy loading
- **Intuitive**: Clear navigation, CTAs
- **Mobile-friendly**: Touch-optimized
- **Accessible**: Semantic HTML, ARIA labels

---

## 8. DEVELOPMENT PHASES

### Phase 1: Foundation (Week 1-2)
- ✅ Project setup (Next.js, TypeScript, Supabase)
- ✅ Database schema design
- ✅ Authentication system
- ✅ Basic API endpoints (CRUD)

### Phase 2: Admin Panel Core (Week 3-4)
- ✅ Dashboard with statistics
- ✅ Service management (CRUD)
- ✅ Category management
- ✅ Brand/Model management

### Phase 3: Booking System (Week 5-6)
- ✅ Booking management (admin)
- ✅ Frontend integration (booking form)
- ✅ Email notifications
- ✅ Status workflow

### Phase 4: Content Management (Week 7-8)
- ✅ CMS for page content
- ✅ Media upload
- ✅ SEO settings
- ✅ Dynamic content loading

### Phase 5: Polish & Launch (Week 9-10)
- ✅ Testing (unit, integration, E2E)
- ✅ Performance optimization
- ✅ Security audit
- ✅ Documentation
- ✅ Deployment
- ✅ Training (admin users)

---

## 9. FUTURE ENHANCEMENTS (Post-MVP)

### 9.1 Customer Portal
- Customer login
- Order history
- Invoice download
- Device tracking

### 9.2 Multi-language
- English version
- Language switcher
- Translated content (CMS)

### 9.3 Payment Integration
- Stripe / PayPal
- Online payment for services
- Invoicing system

### 9.4 Advanced Features
- Live chat support
- SMS notifications
- Warranty management
- Inventory tracking
- Multi-location support
- Mobile app (React Native)

---

## 10. RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data breach | High | Low | Strong security, regular audits |
| System downtime | High | Low | Supabase 99.9% SLA, monitoring |
| Supabase API limits | Medium | Medium | Optimize queries, caching |
| User adoption | Medium | Low | Training, intuitive UI |
| Scope creep | Medium | Medium | Strict phase gates, MVP focus |

---

## 11. ACCEPTANCE CRITERIA

### 11.1 Admin Panel
- [ ] Admin can login/logout securely
- [ ] Admin can add/edit/delete services
- [ ] Admin can manage bookings (update status)
- [ ] Admin can edit page content (CMS)
- [ ] Dashboard shows real-time statistics
- [ ] All forms have validation
- [ ] Responsive on tablet/mobile

### 11.2 Public Website
- [ ] All pages load dynamically from CMS
- [ ] Booking form submits successfully
- [ ] Email confirmations sent automatically
- [ ] Services display correctly from database
- [ ] Page load time < 2 seconds
- [ ] Mobile-friendly

### 11.3 Backend
- [ ] All API endpoints return correct data
- [ ] Authentication works (JWT)
- [ ] RLS policies protect data
- [ ] Database queries optimized
- [ ] Error handling implemented

---

## 12. GLOSSARY

- **CMS**: Content Management System
- **CRUD**: Create, Read, Update, Delete
- **JWT**: JSON Web Token
- **RBAC**: Role-Based Access Control
- **RLS**: Row Level Security (Supabase)
- **RTO**: Recovery Time Objective
- **WCAG**: Web Content Accessibility Guidelines

---

**Document Owner**: Development Team  
**Stakeholders**: Mood IT Management, Technicians  
**Next Review**: February 15, 2026

---

© 2026 Mood IT - Confidential