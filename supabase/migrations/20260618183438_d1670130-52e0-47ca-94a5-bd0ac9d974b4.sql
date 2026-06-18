CREATE POLICY "Authenticated can upload gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Authenticated can read gallery" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated can delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');