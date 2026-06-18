import { createServerFn } from "@tanstack/react-start";

export const seedAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = "admin@painel.com";
  const password = "admin1";

  // Look up existing user
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list?.users.find((u) => u.email === email);

  if (!user) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user!;
  } else {
    await supabaseAdmin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  }

  // Ensure admin role
  const { data: existing } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!existing) {
    await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "admin" });
  }
  return { ok: true, userId: user.id, email };
});
