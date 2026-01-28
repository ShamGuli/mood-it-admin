-- Drop existing policies
DROP POLICY IF EXISTS "Service read all" ON services;

-- Authenticated users can read all services
CREATE POLICY "Authenticated can read all services" 
ON services
FOR SELECT 
TO authenticated
USING (true);

-- Authenticated users can insert services
CREATE POLICY "Authenticated can insert services" 
ON services
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Authenticated users can update services
CREATE POLICY "Authenticated can update services" 
ON services
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete services
CREATE POLICY "Authenticated can delete services" 
ON services
FOR DELETE 
TO authenticated
USING (true);

-- Public can read active services
CREATE POLICY "Public can read active services" 
ON services
FOR SELECT 
TO anon
USING (is_active = true);
