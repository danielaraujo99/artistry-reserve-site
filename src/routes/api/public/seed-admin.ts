import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/seed-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const email = "admin@painel.com";
        const password = "admin1";

        const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        if (listErr) return new Response(JSON.stringify({ error: listErr.message }), { status: 500 });
        let user = list?.users.find((u) => u.email === email);

        if (!user) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email, password, email_confirm: true,
          });
          if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
          user = data.user!;
        } else {
          await supabaseAdmin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
        }

        const { data: existing } = await supabaseAdmin
          .from("user_roles").select("id")
          .eq("user_id", user.id).eq("role", "admin").maybeSingle();
        if (!existing) {
          await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "admin" });
        }
        return new Response(JSON.stringify({ ok: true, userId: user.id, email }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
