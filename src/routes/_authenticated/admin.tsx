import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Users, Image, DollarSign, Scissors, LogOut, Lock } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/appointments", label: "Agendamentos", icon: Calendar },
  { to: "/admin/clients", label: "Clientes", icon: Users },
  { to: "/admin/services", label: "Serviços", icon: Scissors },
  { to: "/admin/gallery", label: "Galeria", icon: Image },
  { to: "/admin/finance", label: "Financeiro", icon: DollarSign },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
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

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border bg-background p-4">
          <Link to="/"><Logo className="h-12 w-auto" /></Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent")}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 px-2 text-xs text-sidebar-foreground/60">{user.email}</div>
          <Button variant="ghost" onClick={signOut} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        {!roleQ.isLoading && !isAdmin ? (
          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-md rounded-lg border bg-card p-8 text-center shadow-luxe">
              <Lock className="mx-auto h-10 w-10 text-gold" />
              <h2 className="mt-4 font-serif text-2xl">Acesso pendente</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sua conta foi criada, mas ainda não tem permissão de administrador.
                Peça ao responsável pelo studio para liberar seu acesso.
              </p>
              <div className="mt-4 rounded bg-muted p-3 text-xs font-mono break-all">
                ID: {user.id}
              </div>
              <Button onClick={signOut} variant="outline" className="mt-6">Sair</Button>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
