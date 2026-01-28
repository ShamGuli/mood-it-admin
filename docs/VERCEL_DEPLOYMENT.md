# 🚀 VERCEL DEPLOYMENT GUIDE

## 📋 **DEPLOYMENT ADDIMLAR**

### **1. Vercel Hesabı Yarat**
1. [vercel.com](https://vercel.com) səhifəsinə daxil ol
2. GitHub hesabınla qeydiyyatdan keç

---

### **2. GitHub Repository-ni Import Et**
1. Vercel Dashboard-a daxil ol
2. "New Project" düyməsinə klik et
3. GitHub-dan `mood-it-admin` repository-ni seç
4. "Import" düyməsinə klik et

---

### **3. Project Settings**

#### **Framework Preset:**
- Next.js

#### **Root Directory:**
- `admin`

#### **Build Command:**
```bash
npm run build
```

#### **Output Directory:**
```bash
.next
```

#### **Install Command:**
```bash
npm install
```

---

### **4. Environment Variables Əlavə Et**

Vercel-də **Environment Variables** bölməsinə daxil ol və aşağıdakı dəyişənləri əlavə et:

#### **Supabase Configuration:**

```
NEXT_PUBLIC_SUPABASE_URL=https://wkewujojitufawiibilt.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXd1am9qaXR1ZmF3aWliaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODQ5MDQsImV4cCI6MjA4NTE2MDkwNH0.nFcxjuX7pd4_UG8yFrBy_JGztDi1XpM1CbTod93_P_E
```

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXd1am9qaXR1ZmF3aWliaWx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTU4NDkwNCwiZXhwIjoyMDg1MTYwOTA0fQ.xjYY5n838NRxfnwCUqL8KPkB8p5R-WewFyQHIVZIqdI
```

```
NODE_ENV=production
```

**⚠️ QEYD:** Hər dəyişən üçün ayrıca sətir yaratmalısan!

---

### **5. Deploy Et**

1. "Deploy" düyməsinə klik et
2. Build prosesi bitənə qədər gözlə (3-5 dəqiqə)
3. Deploy tamamlandıqda, Vercel sizə URL verəcək:
   - **Admin Panel:** `https://your-project.vercel.app`
   - **Admin Login:** `https://your-project.vercel.app/login`

---

### **6. Custom Domain (İstəyə görə)**

Əgər öz domeniniz varsa:

1. Vercel Dashboard → Settings → Domains
2. Custom domain əlavə et (məsələn: `admin.moodit.at`)
3. DNS qeydlərini Vercel-in göstərdiyi kimi konfiqurasiya et

---

## 🔧 **SUPABASE KONFIQURASIYASI**

### **Supabase URL-ləri yenilə:**

1. Supabase Dashboard → Settings → API
2. **Allowed URLs**-ə Vercel URL-ini əlavə et:
   ```
   https://your-project.vercel.app
   ```

---

## 📊 **DEPLOYMENT STATUS**

### **Build Logs:**
Build zamanı problem olarsa, Vercel-də "Deployments" → "Build Logs" baxın

### **Runtime Logs:**
Canlı xətalar üçün: Vercel Dashboard → Logs

---

## ✅ **POST-DEPLOYMENT CHECKLIST**

- [ ] Admin panelə daxil olmaq mümkündür (`admin@moodit.at` / `Admin123!`)
- [ ] Dashboard statistikalar görünür
- [ ] Xidmətlər CRUD işləyir
- [ ] Kateqoriyalar CRUD işləyir
- [ ] Markalar və Modellər işləyir
- [ ] Profil səhifəsi işləyir
- [ ] Public API-lar işləyir (`/api/public/services`, `/api/public/preisliste`)

---

## 🆘 **PROBLEM HƏLLI**

### **Build Failed:**
```bash
# package.json-da bütün dependencies düzgündürmü?
npm install
npm run build  # local test
```

### **Environment Variables Issue:**
- Vercel-də environment variables düzgün əlavə edilib?
- Hər dəyişənin adı və dəyəri düzgündür?

### **Database Connection Failed:**
- Supabase URL və Key-lər düzgündür?
- RLS policies aktiv və düzgündür?

---

## 🎯 **NƏTICƏ**

Deployment uğurla tamamlandıqda:
- ✅ Admin Panel: `https://your-project.vercel.app`
- ✅ Public APIs: `https://your-project.vercel.app/api/public/*`
- ✅ Auto-deploy: Hər GitHub push-dan sonra avtomatik deploy

---

**UĞURLAR!** 🚀
