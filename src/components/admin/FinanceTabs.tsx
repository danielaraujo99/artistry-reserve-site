import { Link, useRouterState } from "@tanstack/react-router";
import { Receipt, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/finance", label: "Lançamentos", icon: Wallet },
  { to: "/admin/bills", label: "Contas a pagar", icon: Receipt },
] as const;

export function FinanceTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="inline-flex items-center rounded-lg border bg-card p-1">
      {tabs.map((t) => {
        const active = pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors",
              active ? "bg-ink text-background" : "text-foreground/65 hover:text-foreground",
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
