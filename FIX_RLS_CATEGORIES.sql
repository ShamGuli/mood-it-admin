-- Drop existing policies
DROP POLICY IF EXISTS "Public read active categories" ON service_categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON service_categories;

-- Authenticated users can read all categories
CREATE POLICY "Authenticated can read all categories" 
ON service_categories
FOR SELECT 
TO authenticated
USING (true);

-- Authenticated users can insert categories
CREATE POLICY "Authenticated can insert categories" 
ON service_categories
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Authenticated users can update categories
CREATE POLICY "Authenticated can update categories" 
ON service_categories
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete categories
CREATE POLICY "Authenticated can delete categories" 
ON service_categories
FOR DELETE 
TO authenticated
USING (true);

-- Public can read active categories
CREATE POLICY "Public can read active categories" 
ON service_categories
FOR SELECT 
TO anon
USING (is_active = true);
