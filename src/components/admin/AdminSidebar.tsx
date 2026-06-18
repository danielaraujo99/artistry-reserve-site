import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Users, ImageIcon, DollarSign, Scissors, LogOut } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

const main = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/appointments", label: "Agendamentos", icon: Calendar },
  { to: "/admin/clients", label: "Clientes", icon: Users },
];
const catalog = [
  { to: "/admin/services", label: "Serviços", icon: Scissors },
  { to: "/admin/gallery", label: "Galeria", icon: ImageIcon },
];
const finance = [
  { to: "/admin/finance", label: "Financeiro", icon: DollarSign },
];

export function AdminSidebar({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Finance section: both /admin/finance and /admin/bills should mark Financeiro active
  const isActive = (p: string, exact?: boolean) => {
    if (p === "/admin/finance") return pathname === "/admin/finance" || pathname === "/admin/bills";
    return exact ? pathname === p : pathname === p || pathname.startsWith(p + "/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-4">
        <Link to="/admin" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-accent text-white font-display text-lg font-semibold">A</span>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Admin Panel
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Section label="Operação" items={main} isActive={isActive} />
        <Section label="Catálogo" items={catalog} isActive={isActive} />
        <Section label="Finanças" items={finance} isActive={isActive} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="mb-2 px-2 text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/40 font-semibold group-data-[collapsible=icon]:hidden truncate">
          {email}
        </div>
        <Button variant="ghost" onClick={onSignOut} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4 mr-2 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

function Section({ label, items, isActive }: {
  label: string;
  items: { to: string; label: string; icon: any; exact?: boolean }[];
  isActive: (p: string, exact?: boolean) => boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/45 text-[10px] uppercase tracking-[0.24em] font-semibold">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((i) => (
            <SidebarMenuItem key={i.to}>
              <SidebarMenuButton asChild isActive={isActive(i.to, i.exact)} tooltip={i.label}>
                <Link to={i.to} className="flex items-center gap-3">
                  <i.icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{i.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
