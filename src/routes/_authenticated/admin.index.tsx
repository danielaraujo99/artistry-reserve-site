import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [appts, tx] = await Promise.all([
        supabase.from("appointments").select("*").order("appt_date", { ascending: false }),
        supabase.from("transactions").select("*"),
      ]);
      return { appts: appts.data ?? [], tx: tx.data ?? [] };
    },
  });

  const monthStart = startOfMonth(new Date());
  const apptThisMonth = stats.data?.appts.filter((a) => parseISO(a.appt_date) >= monthStart) ?? [];
  const income = stats.data?.tx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const expense = stats.data?.tx.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0) ?? 0;
  const uniqueClients = new Set(stats.data?.appts.map((a) => a.client_phone || a.client_name)).size;

  // last 6 months income vs expense
  const monthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const s = startOfMonth(d), e = endOfMonth(d);
    const inc = (stats.data?.tx ?? []).filter((t) => t.type === "income" && parseISO(t.tx_date) >= s && parseISO(t.tx_date) <= e).reduce((sum, t) => sum + Number(t.amount), 0);
    const exp = (stats.data?.tx ?? []).filter((t) => t.type === "expense" && parseISO(t.tx_date) >= s && parseISO(t.tx_date) <= e).reduce((sum, t) => sum + Number(t.amount), 0);
    const cnt = (stats.data?.appts ?? []).filter((a) => parseISO(a.appt_date) >= s && parseISO(a.appt_date) <= e).length;
    return { month: format(d, "MMM", { locale: ptBR }), receita: inc, despesa: exp, agendamentos: cnt };
  });

  const byService = Object.entries(
    (stats.data?.appts ?? []).reduce<Record<string, number>>((acc, a) => {
      acc[a.service_name] = (acc[a.service_name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const colors = ["oklch(0.72 0.08 75)", "oklch(0.55 0.04 60)", "oklch(0.82 0.05 80)", "oklch(0.35 0.02 60)", "oklch(0.65 0.06 50)"];

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do estúdio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Agendamentos no mês" value={apptThisMonth.length.toString()} icon={Calendar} />
        <StatCard label="Receita total" value={`R$ ${income.toFixed(2)}`} icon={DollarSign} accent />
        <StatCard label="Despesas" value={`R$ ${expense.toFixed(2)}`} icon={TrendingUp} />
        <StatCard label="Clientes únicos" value={uniqueClients.toString()} icon={Users} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-serif">Receita vs Despesa (6 meses)</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.08 75)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.08 75)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 27)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 27)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 70)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.012 60)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.012 60)" fontSize={12} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.9 0.01 70)", borderRadius: 6 }} />
                <Area type="monotone" dataKey="receita" stroke="oklch(0.72 0.08 75)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="despesa" stroke="oklch(0.55 0.22 27)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-serif">Serviços mais agendados</CardTitle></CardHeader>
          <CardContent className="h-80">
            {byService.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sem dados ainda</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byService} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {byService.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="font-serif">Agendamentos por mês</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 70)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.012 60)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.012 60)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="agendamentos" fill="oklch(0.18 0.01 60)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: boolean }) {
  return (
    <Card className={accent ? "border-gold/40" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className="mt-2 font-serif text-3xl">{value}</div>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", accent ? "bg-gradient-gold text-ink" : "bg-muted")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";
