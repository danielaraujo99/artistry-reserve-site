import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/appointments": "Agendamentos",
  "/admin/clients": "Clientes",
  "/admin/services": "Serviços",
  "/admin/gallery": "Galeria",
  "/admin/finance": "Financeiro",
  "/admin/bills": "Financeiro · Contas a pagar",
};

function AdminLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = Route.useRouteContext();

  const roleQ = useQuery({
    queryKey: ["my-role", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      return data ?? [];
    },
  });
  const isAdmin = roleQ.data?.some((r) => r.role === "admin");

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (roleQ.isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Carregando…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory p-6">
        <div className="max-w-md rounded-2xl border bg-card p-10 text-center shadow-editorial">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-ink">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-6 font-serif text-3xl">Acesso pendente</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua conta não possui permissão de administrador. Peça ao responsável pelo estúdio para liberar seu acesso.
          </p>
          <div className="mt-5 rounded bg-muted p-3 text-[11px] font-mono break-all">{user.id}</div>
          <Button onClick={signOut} variant="outline" className="mt-6 tracking-[0.18em] text-xs">SAIR</Button>
        </div>
      </div>
    );
  }

  const pageTitle = PAGE_TITLES[pathname] ?? "Painel";

  return (
    <SidebarProvider className="admin-theme" style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <AdminSidebar email={user.email ?? undefined} onSignOut={signOut} />
      <SidebarInset className="bg-muted/30">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/85 backdrop-blur px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="hidden md:block h-5 w-px bg-border" />
          <div className="min-w-0">
            <div className="truncate font-display text-base font-semibold leading-none tracking-[-0.01em]">{pageTitle}</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Logo className="h-8 w-auto hidden sm:block" />
          </div>
        </header>
        <main className="min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
