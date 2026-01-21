-- Create storage bucket for public assets (QR codes PIX)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-assets',
  'public-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
);

-- Storage policies for public-assets bucket
-- Allow public read access to all files in public-assets bucket
CREATE POLICY "Public read access to public assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-assets');

-- Allow service role to insert/update/delete files in public-assets bucket
CREATE POLICY "Service role full access to public assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'public-assets' AND 
    auth.role() = 'service_role'
  );

-- Allow authenticated users (admin) to upload files
CREATE POLICY "Authenticated users can upload to public assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'public-assets' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users (admin) to update files
CREATE POLICY "Authenticated users can update public assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'public-assets' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users (admin) to delete files
CREATE POLICY "Authenticated users can delete public assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'public-assets' AND 
    auth.role() = 'authenticated'
  );