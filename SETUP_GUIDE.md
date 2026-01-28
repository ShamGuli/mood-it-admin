# 🚀 Mood IT - Setup Guide

**Tebrikler!** Admin panel strukturu tamamilə yaradıldı. İndi sadəcə bir neçə addımda işə salacaqsınız.

---

## ✅ **HAZIRKİ STATUS:**

- ✅ **Documentation** - 180KB (6 comprehensive .md files)
- ✅ **Admin Panel** - 40+ files, Next.js 14 + TypeScript
- ✅ **Dependencies** - npm packages installed
- ⏳ **Database** - Setup lazımdır (5 dəqiqə)
- ⏳ **Environment** - Supabase keys lazımdır

---

## 📋 **SETUP ADDMLARI (15 dəqiqə):**

### **1️⃣ Supabase Database Setup**

#### **A) Supabase Project Yarat:**
1. https://supabase.com/dashboard açın
2. "New Project" basın
3. Məlumatları doldurun:
   - **Name:** mood-it-production
   - **Database Password:** (güçlü şifrə yaradın)
   - **Region:** Europe (Frankfurt)
   - **Plan:** Pro (sizin planda var)
4. "Create new project" basın (~2 dəqiqə gözləyin)

#### **B) Database Schema Yaradın:**
1. Supabase Dashboard → **SQL Editor** açın
2. "New query" basın
3. Bu faylı açın: `D:\Cursor-project\mood\docs\DATABASE_SCHEMA.md`
4. SQL kodları **ardıcıl** olaraq kopyalayıb run edin:

**Sıra ilə:**
```sql
-- 1. İlk öncə CREATE TABLE statements
CREATE TABLE users (...);
CREATE TABLE service_categories (...);
CREATE TABLE services (...);
-- və s.

-- 2. Sonra CREATE TRIGGER statements
CREATE TRIGGER update_users_updated_at ...

-- 3. Sonra CREATE INDEX statements
CREATE INDEX idx_users_email ON users(email);
-- və s.

-- 4. Sonra Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- və s.

-- 5. Sonra CREATE POLICY statements
CREATE POLICY "Public read active services" ...
-- və s.

-- 6. Axırda Seed data (test data)
INSERT INTO service_categories ...
INSERT INTO services ...
```

**⚠️ VACIB:** Hər SQL bloku ayrıca run edin, bütün birlikdə yox!

#### **C) İlk Admin User Yaradın:**

**Üsul 1: Supabase Dashboard-da**
1. Supabase → **Authentication** → **Users**
2. "Add user" → "Create new user"
3. Email: `admin@moodit.at`
4. Password: `Admin123!` (və ya öz şifrəniz)
5. Auto Confirm User: ✅ (enabled)
6. "Create user" basın

Sonra SQL Editor-də:
```sql
-- User ID-ni Supabase Auth-dan kopyalayın və buraya yapışdırın
INSERT INTO users (id, email, full_name, role, is_active)
VALUES (
  'USER_ID_FROM_AUTH_PANEL',  -- Məs: '550e8400-e29b-41d4-a716-446655440000'
  'admin@moodit.at',
  'Admin User',
  'admin',
  true
);
```

**Üsul 2: SQL ilə** (əgər Supabase Auth API istifadə edirsinizsə)
```sql
-- Supabase Dashboard -> SQL Editor
-- Note: Password hash yaratmaq üçün Supabase Auth istifadə edin
```

---

### **2️⃣ Environment Variables (.env.local)**

1. `D:\Cursor-project\mood\admin\.env.local` faylını açın
2. Supabase keys-ləri əlavə edin:

**Keys-ləri harada tapmaq olar:**
- Supabase Dashboard → **Settings** → **API**

**Kopyalayın və yapışdırın:**
```env
# Project URL (Supabase Dashboard -> Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co

# Anon/Public Key (Supabase Dashboard -> Settings -> API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# Service Role Key (Supabase Dashboard -> Settings -> API - Secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# Qalanları saxlayın
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-random-secret-here-123456789
```

**Save edin!**

---

### **3️⃣ Run Development Server**

PowerShell açın:
```powershell
cd D:\Cursor-project\mood\admin
npm run dev
```

**Output görməlisiniz:**
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

Browser açın: **http://localhost:3000**

**Login:**
- Email: `admin@moodit.at`
- Password: `Admin123!` (və ya sizin yaratdığınız)

---

## 🎉 **UĞURLU OLSANIZ:**

Görməlisiniz:
1. ✅ Login page (purple gradient)
2. ✅ Dashboard (statistics cards)
3. ✅ Sidebar navigation (8 menu items)
4. ✅ Services page (list view)

---

## 🐛 **PROBLEMLƏR VƏ HƏLLƏR:**

### **Problem 1: "Invalid login credentials"**
**Səbəb:** User database-də yoxdur və ya password səhvdir
**Həll:** 
- Supabase → Authentication → Users → Yoxlayın user var?
- SQL-də `users` table-də yoxlayın: `SELECT * FROM users WHERE email = 'admin@moodit.at';`
- User ID-lərin eyni olduğunu yoxlayın (Auth panel vs users table)

### **Problem 2: "Network error" / "Failed to fetch"**
**Səbəb:** Supabase keys səhvdir və ya .env.local oxunmayıb
**Həll:**
- `.env.local` faylında keys-ləri yoxlayın
- Dev server-i restart edin (Ctrl+C, sonra `npm run dev`)
- Browser cache-i təmizləyin (Ctrl+Shift+Delete)

### **Problem 3: Database queries not working**
**Səbəb:** RLS policies aktivdir, amma user role yoxdur
**Həll:**
```sql
-- SQL Editor-də:
SELECT * FROM users WHERE email = 'admin@moodit.at';
-- role = 'admin' olduğunu yoxlayın
-- is_active = true olduğunu yoxlayın
```

### **Problem 4: "Module not found" errors**
**Səbəb:** node_modules tam yüklənməyib
**Həll:**
```powershell
cd admin
rm -r node_modules
npm install
```

---

## 📚 **SONRAKI ADDIMLAR:**

### **Immediate (İndi):**
1. ✅ Database setup et
2. ✅ .env.local keys əlavə et
3. ✅ npm run dev ilə test et
4. ✅ Login olub dashboard-a bax

### **Qısa Müddət (1-2 saat):**
1. Services-də real data əlavə et (SQL INSERT)
2. Categories yaradın
3. Brands & Models əlavə edin
4. Test booking yarat

### **Orta Müddət (1-2 gün):**
1. Services CRUD modal tamamla (Add/Edit)
2. Bookings management səhifəsi
3. Charts əlavə et (Recharts)
4. File upload funksionallığı

### **Uzun Müddət (1-2 həftə):**
1. Content CMS tamamla
2. Email notifications (SendGrid)
3. Production deployment (Vercel)
4. Domain setup (moodit.at)

---

## 🔧 **DEVELOPMENT KOMANDLARI:**

```powershell
# Development server
npm run dev

# Production build
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint

# Install new package
npm install package-name
```

---

## 📖 **FƏYDALİ LİNKLƏR:**

- **Documentation:** `D:\Cursor-project\mood\docs\`
- **Admin README:** `D:\Cursor-project\mood\admin\README.md`
- **Database Schema:** `D:\Cursor-project\mood\docs\DATABASE_SCHEMA.md`
- **API Docs:** `D:\Cursor-project\mood\docs\API_DOCUMENTATION.md`

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Documentation: https://supabase.com/docs

**Next.js:**
- Documentation: https://nextjs.org/docs
- Learn: https://nextjs.org/learn

---

## 🆘 **KÖMƏK LAZIMDIR?**

Məni çağırın və problemi deyin:
- "Database connection error"
- "Login not working"
- "Services page empty"
- və s.

Mən dərhal kömək edəcəm! 🚀

---

**Setup Version:** 1.0  
**Last Updated:** January 28, 2026  
**Status:** Ready for Setup

---

© 2026 Mood IT - Good Luck! 🎉
