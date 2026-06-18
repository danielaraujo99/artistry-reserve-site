import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Check, AlertCircle, CalendarClock, Trash2, Receipt } from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/bills")({
  component: BillsPage,
});

const CATEGORIES = [
  "Aluguel", "Fornecedores", "Produtos", "Salários", "Marketing",
  "Energia", "Internet", "Manutenção", "Impostos", "Outros",
];

const STATUS_LABEL: Record<string, string> = { pending: "Pendente", paid: "Pago", overdue: "Atrasado" };

function BillsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "pending" | "paid">("all");

  const list = useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bills").select("*").order("due_date");
      if (error) throw error;
      return data;
    },
  });

  const today = new Date();
  const enriched = useMemo(() => (list.data ?? []).map((b) => {
    const due = parseISO(b.due_date);
    const days = differenceInCalendarDays(due, today);
    let status = b.status;
    if (b.status !== "paid" && days < 0) status = "overdue";
    return { ...b, status, days };
  }), [list.data]);

  const filtered = enriched.filter((b) => tab === "all" || (tab === "pending" ? b.status !== "paid" : b.status === "paid"));

  const totals = {
    pending: enriched.filter((b) => b.status === "pending").reduce((s, b) => s + Number(b.amount), 0),
    overdue: enriched.filter((b) => b.status === "overdue").reduce((s, b) => s + Number(b.amount), 0),
    paidMonth: enriched.filter((b) => b.status === "paid" && b.paid_at && parseISO(b.paid_at).getMonth() === today.getMonth()).reduce((s, b) => s + Number(b.amount), 0),
  };

  const byCategory = Object.entries(
    enriched.filter((b) => b.status !== "paid").reduce<Record<string, number>>((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + Number(b.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  const colors = ["oklch(0.72 0.09 75)", "oklch(0.55 0.04 60)", "oklch(0.82 0.05 80)", "oklch(0.35 0.02 60)", "oklch(0.65 0.06 50)", "oklch(0.58 0.10 70)"];

  async function markPaid(id: string) {
    const { error } = await supabase.from("bills").update({ status: "paid", paid_at: format(today, "yyyy-MM-dd") }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Conta marcada como paga");
    qc.invalidateQueries({ queryKey: ["bills"] });
  }

  async function removeBill(id: string) {
    const { error } = await supabase.from("bills").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["bills"] });
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-4xl">Contas a pagar</h1>
          <p className="text-sm text-muted-foreground">Controle de despesas com vencimento.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ink text-background hover:bg-ink/90 tracking-[0.18em] text-xs h-11 px-5">
              <Plus className="h-4 w-4 mr-2" /> NOVA CONTA
            </Button>
          </DialogTrigger>
          <BillFormDialog onSaved={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["bills"] }); }} />
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi label="A pagar (pendente)" value={`R$ ${totals.pending.toFixed(2)}`} icon={CalendarClock} />
        <Kpi label="Atrasadas" value={`R$ ${totals.overdue.toFixed(2)}`} icon={AlertCircle} tone="danger" />
        <Kpi label="Pago no mês" value={`R$ ${totals.paidMonth.toFixed(2)}`} icon={Check} tone="ok" />
        <Kpi label="Total de contas" value={enriched.length.toString()} icon={Receipt} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="font-serif">Contas</CardTitle>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Em aberto</TabsTrigger>
                <TabsTrigger value="paid">Pagas</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Vencimento</th>
                    <th className="px-4 py-3 text-left">Conta</th>
                    <th className="px-4 py-3 text-left">Categoria</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">{format(parseISO(b.due_date), "dd MMM", { locale: ptBR })}</div>
                        {b.status !== "paid" && (
                          <div className={cn("text-[11px]",
                            b.days < 0 ? "text-destructive" : b.days <= 3 ? "text-gold-deep" : "text-muted-foreground")}>
                            {b.days < 0 ? `${Math.abs(b.days)}d atrasada` : b.days === 0 ? "vence hoje" : `em ${b.days}d`}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{b.title}</div>
                        {b.supplier && <div className="text-xs text-muted-foreground">{b.supplier}</div>}
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline">{b.category}</Badge></td>
                      <td className="px-4 py-3 text-right font-mono">R$ {Number(b.amount).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={b.status === "paid" ? "default" : b.status === "overdue" ? "destructive" : "secondary"}>
                          {STATUS_LABEL[b.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          {b.status !== "paid" && (
                            <Button size="sm" variant="ghost" onClick={() => markPaid(b.id)} title="Marcar como pago">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => removeBill(b.id)} title="Excluir">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Nenhuma conta nesta visão.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-serif">Em aberto por categoria</CardTitle></CardHeader>
          <CardContent className="h-72">
            {byCategory.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Sem contas em aberto</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {byCategory.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `R$ ${Number(v).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone }: { label: string; value: string; icon: any; tone?: "ok" | "danger" }) {
  return (
    <Card className={cn(tone === "danger" && "border-destructive/40", tone === "ok" && "border-emerald-500/30")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
            <div className="mt-2 font-serif text-2xl truncate">{value}</div>
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
            tone === "danger" ? "bg-destructive/10 text-destructive" : tone === "ok" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-foreground")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BillFormDialog({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    title: "", supplier: "", category: "Outros", amount: "", due_date: format(new Date(), "yyyy-MM-dd"), notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.title || !form.amount || !form.due_date) return toast.error("Preencha os campos obrigatórios");
    setSaving(true);
    const { error } = await supabase.from("bills").insert({
      title: form.title,
      supplier: form.supplier || null,
      category: form.category,
      amount: Number(form.amount),
      due_date: form.due_date,
      notes: form.notes || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada");
    onSaved();
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle className="font-serif text-2xl">Nova conta a pagar</DialogTitle></DialogHeader>
      <div className="grid gap-4 py-2">
        <div className="space-y-1.5"><Label>Título *</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Aluguel novembro" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Fornecedor</Label>
            <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Categoria</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Valor (R$) *</Label>
            <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Vencimento *</Label>
            <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
        </div>
        <div className="space-y-1.5"><Label>Observações</Label>
          <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      </div>
      <DialogFooter>
        <Button onClick={save} disabled={saving} className="bg-ink text-background hover:bg-ink/90">
          {saving ? "Salvando…" : "Salvar conta"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
