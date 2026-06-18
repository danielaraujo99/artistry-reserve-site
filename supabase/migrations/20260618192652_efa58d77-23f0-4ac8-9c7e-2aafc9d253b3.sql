
-- PROFESSIONALS
INSERT INTO public.professionals (name, role_title, bio, photo_url, specialties, sort_order, active)
SELECT * FROM (VALUES
  ('Elaine Hahn', 'Hair Stylist · Loiros & Coloração',
    'Fundadora do estúdio, com mais de uma década de carreira e formação internacional pela Pivot Point e L''Oréal Professionnel. Especialista em loiros sob medida e coloração autoral.',
    '/main/Elaine.png', ARRAY['Loiros','Coloração','Cortes femininos','Finalização'], 1, true),
  ('Verônica Pereira', 'Especialista em Mechas & Colorimetria',
    'Hair colorist apaixonada por nuances e luminosidade. Especialista em mechas, balayage e correções de cor com técnica refinada e olhar editorial.',
    '/main/Veronica.png', ARRAY['Mechas','Balayage','Colorimetria','Tratamentos'], 2, true)
) AS v(name, role_title, bio, photo_url, specialties, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM public.professionals);

-- SERVICES
INSERT INTO public.services (name, description, category, duration_min, price, sort_order, active)
SELECT * FROM (VALUES
  ('Loiro Premium',        'Loiro sob medida com técnica autoral e tonalização editorial.',  'Loiros & Coloração', 240, 650.00, 1, true),
  ('Coloração',            'Coloração permanente com produtos profissionais de alta performance.', 'Loiros & Coloração', 150, 320.00, 2, true),
  ('Mechas / Balayage',    'Mechas iluminadas, balayage e ombré com acabamento editorial.',  'Loiros & Coloração', 210, 480.00, 3, true),
  ('Correção de Cor',      'Correção e neutralização de cor para resultados naturais.',      'Loiros & Coloração', 240, 580.00, 4, true),
  ('Corte Feminino',       'Corte personalizado conforme formato de rosto e estilo de vida.', 'Cortes',             60,  150.00, 5, true),
  ('Escova / Finalização', 'Finalização editorial com escova modeladora.',                    'Finalização',        45,  90.00,  6, true),
  ('Hidratação Profunda',  'Tratamento intensivo de reconstrução e nutrição capilar.',        'Tratamentos',        60,  180.00, 7, true),
  ('Botox Capilar',        'Tratamento de alinhamento e brilho com efeito imediato.',         'Tratamentos',        90,  220.00, 8, true)
) AS v(name, description, category, duration_min, price, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM public.services);

-- GALLERY
INSERT INTO public.gallery_items (image_url, title, sort_order, active)
SELECT * FROM (VALUES
  ('/gallery/destaque-001.jpg',  'Loiro editorial',     1, true),
  ('/gallery/destaque-002.jpeg', 'Mechas iluminadas',   2, true),
  ('/gallery/destaque-003.jpeg', 'Balayage natural',    3, true),
  ('/gallery/destaque-004.jpeg', 'Coloração autoral',   4, true),
  ('/gallery/destaque-005.jpeg', 'Finalização',         5, true),
  ('/gallery/destaque-006.jpeg', 'Loiro premium',       6, true),
  ('/gallery/destaque-007.jpeg', 'Corte feminino',      7, true),
  ('/gallery/destaque-008.jpeg', 'Tratamento capilar',  8, true),
  ('/gallery/destaque-009.jpeg', 'Transformação',       9, true)
) AS v(image_url, title, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items);
