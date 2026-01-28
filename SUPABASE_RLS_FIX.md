# 🔒 Supabase RLS Policy Fix - Services Table

## ❌ **PROBLEM:**

```
new row violates row-level security policy for table "services"
```

Admin authenticated olsa belə, `services` table-a INSERT edə bilmir.

---

## ✅ **HƏLL: Supabase SQL Editor-də bu SQL-i run edin:**

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Service read all" ON services;

-- CREATE POLICY: Authenticated users can read all services
CREATE POLICY "Authenticated can read all services" 
ON services
FOR SELECT 
TO authenticated
USING (true);

-- CREATE POLICY: Authenticated users can insert services
CREATE POLICY "Authenticated can insert services" 
ON services
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- CREATE POLICY: Authenticated users can update services
CREATE POLICY "Authenticated can update services" 
ON services
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- CREATE POLICY: Authenticated users can delete services
CREATE POLICY "Authenticated can delete services" 
ON services
FOR DELETE 
TO authenticated
USING (true);

-- PUBLIC: Anyone can read active services (for frontend)
CREATE POLICY "Public can read active services" 
ON services
FOR SELECT 
TO anon
USING (is_active = true);
```

---

## 🎯 **NƏ EDİR:**

1. **Authenticated users** (admin/technician) - FULL ACCESS (CRUD)
2. **Anonymous users** (public) - ONLY active services (READ)

---

## ✅ **VERIFY:**

```sql
-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'services';
```

5 policy görməlisiniz:
- ✅ Authenticated can read all services (SELECT)
- ✅ Authenticated can insert services (INSERT)
- ✅ Authenticated can update services (UPDATE)
- ✅ Authenticated can delete services (DELETE)
- ✅ Public can read active services (SELECT)

---

**Bu SQL-i Supabase SQL Editor-də run edin!**
