
-- Seed admin user for the panel
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'admin@painel.com';
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
      'admin@painel.com', crypt('admin1', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false,
      '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at
    ) VALUES (
      gen_random_uuid(), v_uid,
      jsonb_build_object('sub', v_uid::text, 'email', 'admin@painel.com', 'email_verified', true),
      'email', v_uid::text, now(), now(), now()
    );
  ELSE
    UPDATE auth.users
       SET encrypted_password = crypt('admin1', gen_salt('bf')),
           email_confirmed_at = COALESCE(email_confirmed_at, now()),
           updated_at = now()
     WHERE id = v_uid;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_uid, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
