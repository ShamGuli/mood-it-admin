# 🛠️ Mood IT - Tech Service Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Status](https://img.shields.io/badge/status-In%20Development-yellow.svg)

**Professional tech repair service website with comprehensive admin panel and backend system.**

---

## 📋 Project Overview

Mood IT is a full-stack web application for managing a tech repair service business located in Wels, Austria. The system includes:

- 🌐 **Public Website** - Service catalog, booking system, contact forms
- 🎛️ **Admin Panel** - Comprehensive management dashboard
- 🔌 **RESTful API** - Backend services for all operations
- 💾 **Database** - Supabase (PostgreSQL) with Row Level Security
- 📧 **Email Integration** - Automated notifications and confirmations

---

## ✨ Key Features

### Public Website
- ✅ Dynamic service catalog (7 categories)
- ✅ Interactive pricing wizard (3-step booking)
- ✅ Responsive design (mobile-first)
- ✅ German language primary
- ✅ Real-time availability
- ✅ Contact forms with validation

### Admin Panel
- ✅ **Dashboard** - Business metrics, charts, recent activity
- ✅ **Service Management** - CRUD operations for services
- ✅ **Category Management** - Organize service categories
- ✅ **Brand & Model Management** - Device taxonomy
- ✅ **Booking Management** - Track customer orders, update status
- ✅ **Content Management System** - Edit website content without code
- ✅ **Settings** - Business info, email templates, system config
- ✅ **User Management** - Admin and technician accounts

### Backend
- ✅ RESTful API with JWT authentication
- ✅ Role-based access control (Admin, Technician, Customer)
- ✅ Real-time updates (Supabase subscriptions)
- ✅ Email notifications (SendGrid)
- ✅ File upload (Supabase Storage)
- ✅ Rate limiting and security

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI v5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Database**: Supabase (PostgreSQL 15)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: Supabase Storage
- **Email**: SendGrid / Resend

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Version Control**: Git + GitHub
- **Monitoring**: Vercel Analytics

---

## 📁 Project Structure

```
mood/
├── docs/                           # 📚 Documentation
│   ├── PRD.md                     # Product requirements
│   ├── ARCHITECTURE.md            # System architecture
│   ├── DATABASE_SCHEMA.md         # Database design
│   ├── API_DOCUMENTATION.md       # API reference
│   ├── ADMIN_PANEL_SPECS.md       # Admin UI/UX specs
│   └── DEPLOYMENT.md              # Deployment guide
│
├── admin/                          # 🎛️ Admin Panel (Next.js)
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utilities
│   │   ├── hooks/                 # Custom hooks
│   │   └── types/                 # TypeScript types
│   └── package.json
│
├── frontend/                       # 🌐 Public Website
│   ├── index.html
│   ├── about.html
│   ├── preisliste.html
│   ├── service-*.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── migrations/                     # 💾 Database migrations
│   ├── 001_create_users.sql
│   ├── 002_create_categories.sql
│   └── ...
│
├── .cursorrules                    # 🤖 Cursor AI coding rules
├── .gitignore
└── README.md                       # 📖 This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Vercel account (for deployment)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mood-it.git
   cd mood-it
   ```

2. **Install dependencies**
   ```bash
   cd admin
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run database migrations**
   ```bash
   # See docs/DATABASE_SCHEMA.md for SQL scripts
   # Apply in Supabase SQL Editor
   ```

5. **Start development server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

---

## 📚 Documentation

All detailed documentation is in the `/docs` folder:

| Document | Description |
|----------|-------------|
| **[PRD.md](docs/PRD.md)** | Product Requirements Document |
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | System architecture and design |
| **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** | Complete database schema with SQL |
| **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** | API endpoints and examples |
| **[ADMIN_PANEL_SPECS.md](docs/ADMIN_PANEL_SPECS.md)** | Admin panel UI/UX specifications |
| **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Deployment and operations guide |

---

## 🗄️ Database Schema

**Core Tables:**
- `users` - Admin and technician accounts
- `service_categories` - Service categories (Telefon, PlayStation, etc.)
- `services` - Individual services (Display replacement, etc.)
- `brands` - Device brands (Apple, Samsung, etc.)
- `models` - Device models (iPhone 15, Galaxy S24, etc.)
- `bookings` - Customer service bookings
- `content_pages` - Dynamic CMS content
- `settings` - System configuration

**See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for complete schema.**

---

## 🔌 API Endpoints

**Base URL**: `/api/v1`

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### Services
- `GET /services` - List all services
- `POST /services` - Create service (admin)
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Bookings
- `GET /bookings` - List bookings (admin)
- `POST /bookings` - Create booking (public)
- `PUT /bookings/:id/status` - Update status

**See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference.**

---

## 🎨 Design System

### Brand Colors
- **Primary Purple**: `#8a4fff`
- **Primary Blue**: `#4185DD`
- **Primary Pink**: `#B42FDA`
- **Gradient**: `linear-gradient(135deg, #4185DD, #B42FDA)`

### Typography
- **Font**: Poppins (Google Fonts)
- **Sizes**: 12px - 36px

### Spacing
- **Scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px

**See [ADMIN_PANEL_SPECS.md](docs/ADMIN_PANEL_SPECS.md) for complete design system.**

---

## 🔒 Security

### Authentication
- JWT-based authentication (Supabase Auth)
- Role-based access control (Admin, Technician, Customer)
- Secure password hashing (bcrypt)

### Authorization
- Row Level Security (RLS) policies on all tables
- Protected API routes
- Input validation (Zod schemas)

### Data Protection
- HTTPS only (SSL certificate)
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized inputs)
- CSRF protection
- Rate limiting (100 req/15min public, 1000 req/15min authenticated)

---

## 🧪 Testing

### Manual Testing
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### Testing Checklist
- [ ] Login/logout works
- [ ] CRUD operations work
- [ ] Form validation works
- [ ] File uploads work
- [ ] Email notifications sent
- [ ] Mobile responsive
- [ ] Accessibility (keyboard navigation)

---

## 🚢 Deployment

### Production Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Vercel auto-deploys on push to main
   - Or manually: `vercel --prod`

3. **Configure environment variables** in Vercel dashboard

4. **Set up custom domain**
   - Admin: `admin.moodit.at`
   - Public: `moodit.at`

**See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guide.**

---

## 📊 Project Status

### ✅ Completed
- [x] Project documentation (PRD, Architecture, Database, API)
- [x] Database schema design
- [x] API endpoint design
- [x] Admin panel UI/UX specifications
- [x] Cursor AI coding rules

### 🚧 In Progress
- [ ] Admin panel development (Next.js)
- [ ] Backend API implementation
- [ ] Database setup and migrations
- [ ] Frontend integration
- [ ] Testing

### 📅 Planned
- [ ] Beta testing
- [ ] Production deployment
- [ ] User training
- [ ] Performance optimization
- [ ] Mobile app (future)

---

## 🤝 Contributing

This is a proprietary project for Mood IT. Internal development only.

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "feat: your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request
6. Code review → Merge to main

### Coding Standards
- Follow `.cursorrules` guidelines
- Write TypeScript (no JavaScript)
- Add JSDoc comments for functions
- Test manually before committing
- Follow Material-UI design patterns

---

## 📝 Development Rules

**Key principles from `.cursorrules`:**

✅ **DO:**
- Use TypeScript strictly
- Validate all inputs (Zod)
- Handle errors gracefully
- Use Next.js 14 App Router
- Follow Material-UI patterns
- Write German UI text, English code

❌ **DON'T:**
- Use `any` type
- Ignore TypeScript errors
- Hardcode sensitive data
- Skip input validation
- Forget error handling

---

## 🛠️ Maintenance

### Backups
- **Database**: Automatic daily backups (Supabase)
- **Manual backups**: Weekly (see DEPLOYMENT.md)

### Monitoring
- **Vercel Analytics**: Performance, traffic
- **Supabase Dashboard**: Database metrics
- **Sentry**: Error tracking (optional)

### Updates
- **Dependencies**: Monthly security updates
- **Next.js**: Quarterly major version updates
- **Supabase**: Automatic (managed service)

---

## 📞 Support & Contact

**Development Team:**
- Email: dev@moodit.at
- GitHub Issues: [Create Issue](https://github.com/your-username/mood-it/issues)

**Business:**
- Website: https://moodit.at
- Email: info@moodit.at
- Phone: +994 50 555 55 55
- Address: Wels, Österreich

---

## 📄 License

**Proprietary** - © 2026 Mood IT. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Supabase** - Backend-as-a-Service
- **Material-UI** - React component library
- **Vercel** - Hosting platform
- **Cursor AI** - AI-powered development

---

**Version**: 1.0.0  
**Last Updated**: January 28, 2026  
**Status**: In Development

---

**Built with ❤️ by the Mood IT Team**