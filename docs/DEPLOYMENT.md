# 🚀 Deployment Guide - Mood IT

**Version:** 1.0.0  
**Last Updated:** January 28, 2026

---

## 📋 Prerequisites

- [x] Supabase Pro account (database ready)
- [x] Vercel account (for hosting)
- [x] GitHub account (repository)
- [x] SendGrid account (email service)
- [x] Domain registered (moodit.at)

---

## 1. SUPABASE SETUP

### 1.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill details:
   - Name: `mood-it-production`
   - Database Password: (generate strong password)
   - Region: Europe (Frankfurt)
   - Plan: Pro
4. Wait for setup (~2 minutes)

### 1.2 Apply Database Migrations

**Option A: Supabase CLI** (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Apply migrations
cd migrations
supabase db push
```

**Option B: SQL Editor** (Manual)
1. Open Supabase Dashboard → SQL Editor
2. Copy content from `docs/DATABASE_SCHEMA.md`
3. Run each SQL block sequentially:
   - Create tables
   - Create triggers
   - Create indexes
   - Enable RLS
   - Create RLS policies
   - Seed initial data

### 1.3 Configure Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('service-images', 'service-images', true),
  ('brand-logos', 'brand-logos', true),
  ('content-media', 'content-media', true),
  ('user-avatars', 'user-avatars', false);

-- Set policies (public read)
CREATE POLICY "Public read service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Admins upload service images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' 
    AND auth.role() = 'authenticated'
  );
```

### 1.4 Get Supabase Keys

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (safe for browser)
   - **service_role key**: `eyJhbGc...` (server-only, secret!)

---

## 2. GITHUB REPOSITORY SETUP

### 2.1 Initialize Git (if not done)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Mood IT project structure"

# Create GitHub repo (via GitHub web interface)
# Then link:
git remote add origin https://github.com/your-username/mood-it.git
git branch -M main
git push -u origin main
```

### 2.2 Create .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.production

# Next.js
.next/
out/
build/
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temp
*.zip
*.tmp
```

---

## 3. ADMIN PANEL DEPLOYMENT (Vercel)

### 3.1 Install Dependencies

```bash
cd admin
npm install
```

### 3.2 Create `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (secret!)

# App
NEXT_PUBLIC_APP_URL=https://admin.moodit.at

# Email
SENDGRID_API_KEY=SG.xxx

# Auth
JWT_SECRET=your-random-secret-key-here
```

### 3.3 Build Locally (Test)

```bash
npm run build
npm run start

# Open http://localhost:3000
# Verify everything works
```

### 3.4 Deploy to Vercel

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd admin
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: mood-it-admin
# - Directory: ./
# - Override settings? No

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SENDGRID_API_KEY
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

**Via Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select `mood-it` repo
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables (from `.env.local`)
6. Click "Deploy"
7. Wait ~2 minutes
8. Get deployment URL: `https://mood-it-admin.vercel.app`

### 3.5 Configure Custom Domain

1. Vercel Dashboard → Project Settings → Domains
2. Add domain: `admin.moodit.at`
3. Copy DNS records (CNAME or A record)
4. Go to your domain registrar (e.g., GoDaddy)
5. Add DNS records:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```
6. Wait for DNS propagation (5-30 minutes)
7. Verify: https://admin.moodit.at

---

## 4. PUBLIC WEBSITE DEPLOYMENT

### 4.1 Option A: Static Hosting (Current HTML)

**Deploy to Vercel:**
```bash
# In project root (where HTML files are)
vercel

# Settings:
# - Build Command: (leave empty)
# - Output Directory: ./ (or public/)
# - Install Command: (leave empty)

# Custom domain: moodit.at or www.moodit.at
```

**Deploy to Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Drag & drop folder OR link to Git
# Custom domain: moodit.at
```

### 4.2 Option B: Next.js Migration (Future)

When migrating HTML to Next.js:

**Structure:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── preisliste/
│   │   └── contact/
│   ├── components/
│   └── lib/
├── public/                     # Static assets (images, css, js)
└── package.json
```

**Deploy:**
Same as admin panel (Vercel), but with domain `moodit.at`

---

## 5. DATABASE BACKUPS

### 5.1 Automatic Backups (Supabase)

Supabase Pro includes:
- Daily automated backups
- 7-day retention
- Point-in-time recovery (PITR)

### 5.2 Manual Backups

**Weekly Backup Script:**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
SUPABASE_PROJECT="your-project-ref"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
supabase db dump --project-ref $SUPABASE_PROJECT > "$BACKUP_DIR/backup_$DATE.sql"

# Compress
gzip "$BACKUP_DIR/backup_$DATE.sql"

# Upload to cloud storage (optional)
# aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" s3://mood-it-backups/

echo "Backup completed: backup_$DATE.sql.gz"
```

**Schedule with cron (Linux/Mac):**
```bash
# Run every Sunday at 2 AM
0 2 * * 0 /path/to/backup.sh
```

---

## 6. CI/CD PIPELINE (GitHub Actions)

### 6.1 Create Workflow File

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        working-directory: ./admin
        run: npm ci
        
      - name: Run TypeScript check
        working-directory: ./admin
        run: npm run type-check
        
      - name: Run linter
        working-directory: ./admin
        run: npm run lint
        
      - name: Build
        working-directory: ./admin
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./admin
          vercel-args: '--prod'
```

### 6.2 Add Secrets

1. GitHub Repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `VERCEL_TOKEN` (from Vercel Account Settings)
   - `VERCEL_ORG_ID` (from Vercel Project Settings)
   - `VERCEL_PROJECT_ID` (from Vercel Project Settings)

---

## 7. MONITORING & ALERTS

### 7.1 Vercel Analytics

1. Vercel Dashboard → Analytics
2. Enable Web Analytics
3. View metrics:
   - Page views
   - Unique visitors
   - Performance (Core Web Vitals)
   - Top pages

### 7.2 Supabase Monitoring

1. Supabase Dashboard → Database → Monitoring
2. Track:
   - Database size
   - Active connections
   - Query performance
   - API usage

### 7.3 Error Tracking (Sentry - Optional)

**Install:**
```bash
npm install @sentry/nextjs
```

**Configure:**
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://xxx@xxx.ingest.sentry.io/xxx',
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

## 8. POST-DEPLOYMENT CHECKLIST

### 8.1 Functional Testing

- [ ] Admin login works
- [ ] Dashboard loads with data
- [ ] Create/Edit/Delete service works
- [ ] Booking form submission works
- [ ] Email notifications sent
- [ ] File uploads work
- [ ] Search/filters work
- [ ] Mobile responsive

### 8.2 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables not exposed
- [ ] RLS policies enabled
- [ ] Rate limiting active
- [ ] CORS configured correctly
- [ ] No console.log in production
- [ ] Error messages don't expose sensitive data

### 8.3 Performance Checklist

- [ ] Page load time < 2 seconds
- [ ] Images optimized (WebP, lazy loading)
- [ ] API response time < 300ms
- [ ] Database queries indexed
- [ ] CDN enabled (Vercel automatic)

### 8.4 SEO Checklist

- [ ] Meta tags present (title, description)
- [ ] Open Graph tags
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Google Analytics (optional)

---

## 9. TROUBLESHOOTING

### 9.1 Build Errors

**TypeScript errors:**
```bash
# Check errors
npm run type-check

# Fix and rebuild
npm run build
```

**Missing environment variables:**
- Verify all required env vars in Vercel dashboard
- Redeploy after adding vars

### 9.2 Database Connection Issues

**Check Supabase status:**
- https://status.supabase.com

**Connection string:**
```typescript
// Test connection
const { data, error } = await supabase.from('users').select('count');
console.log('DB Connection:', error ? 'Failed' : 'Success');
```

### 9.3 Deployment Failed

**Vercel logs:**
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. View logs
4. Fix issue and redeploy

**Common issues:**
- Build command failed → Check package.json scripts
- Out of memory → Increase Node.js memory limit
- Missing dependencies → Run `npm install` locally

---

## 10. ROLLBACK PROCEDURE

### 10.1 Vercel Rollback

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." menu → "Promote to Production"
4. Confirm

### 10.2 Database Rollback

**Restore from backup:**
```bash
# Download backup
supabase db dump --project-ref xxx > backup.sql

# Restore (in Supabase SQL Editor)
# Paste content of backup.sql and run
```

**Point-in-time recovery:**
1. Supabase Dashboard → Database → Backups
2. Select timestamp
3. Click "Restore"
4. Confirm

---

## 11. MAINTENANCE MODE

### 11.1 Enable Maintenance

**Option A: Vercel Maintenance Page**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware() {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  if (maintenanceMode) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
}
```

**Option B: Database Setting**
```sql
UPDATE settings 
SET value = 'true' 
WHERE key = 'maintenance_mode';
```

### 11.2 Maintenance Page

Create `app/maintenance/page.tsx`:
```tsx
export default function Maintenance() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>🔧 Wartungsarbeiten</h1>
      <p>Wir führen gerade Wartungsarbeiten durch.</p>
      <p>Bitte versuchen Sie es später erneut.</p>
    </div>
  );
}
```

---

## 12. SCALING CONSIDERATIONS

### 12.1 Current Limits

**Vercel (Hobby/Pro):**
- Bandwidth: 100GB/month (Pro: 1TB)
- Builds: 100/day (Pro: 3000)
- Serverless Function Execution: 100GB-Hrs (Pro: 1000GB-Hrs)

**Supabase (Pro):**
- Database: 8GB storage (expandable)
- API requests: Unlimited
- Storage: 100GB (expandable)
- Concurrent connections: 200

### 12.2 When to Scale

**Signs you need to scale:**
- 500+ bookings/day
- Page load > 3 seconds
- Database storage > 80%
- API response time > 500ms

**Scaling options:**
- Upgrade Vercel plan
- Add Supabase read replicas
- Implement Redis caching
- Move to dedicated hosting

---

## 13. SUPPORT & CONTACTS

**Hosting:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/dashboard/support

**Development Team:**
- Email: dev@moodit.at
- GitHub Issues: https://github.com/your-username/mood-it/issues

**Emergency Contacts:**
- On-call Developer: +43 XXX XXX XXX
- Database Admin: [email]

---

**Deployment Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Next Review:** February 28, 2026

---

© 2026 Mood IT - Confidential