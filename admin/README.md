# Mood IT Admin Panel

Professional admin panel for Mood IT tech service management system.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## 📁 Project Structure

```
admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   └── login/         # Login page
│   │   ├── (dashboard)/       # Dashboard routes
│   │   │   └── dashboard/     # Dashboard pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # React Query, MUI providers
│   ├── components/            # React components
│   │   ├── layout/           # Sidebar, TopBar
│   │   ├── ui/               # Reusable UI components
│   │   ├── forms/            # Form components
│   │   └── charts/           # Chart components
│   ├── lib/                   # Utilities
│   │   ├── supabase/         # Supabase clients
│   │   └── utils/            # Helper functions
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand state management
│   ├── types/                 # TypeScript types
│   └── constants/             # Constants, theme
├── public/                    # Static files
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎨 Features

### Implemented
- ✅ Authentication (Supabase Auth)
- ✅ Dashboard with statistics
- ✅ Sidebar navigation
- ✅ Services management (list view)
- ✅ API routes (services)
- ✅ Material-UI theme
- ✅ TypeScript
- ✅ React Query for data fetching

### To Do
- [ ] Full CRUD for services
- [ ] Categories management
- [ ] Brands & Models management
- [ ] Bookings management
- [ ] Content CMS
- [ ] Settings page
- [ ] User management
- [ ] Charts (Recharts)
- [ ] Real-time updates

## 🔐 Default Login

After setting up the database, you can create an admin user:

```sql
INSERT INTO users (email, password_hash, full_name, role, is_active)
VALUES (
  'admin@moodit.at',
  -- Password: Admin123! (use Supabase Auth to hash)
  'your-hashed-password',
  'Admin User',
  'admin',
  true
);
```

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI v5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## 🛠️ Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## 📦 Deployment

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) in the main project docs.

---

**Version**: 1.0.0  
**Author**: Mood IT Dev Team  
**License**: Proprietary
