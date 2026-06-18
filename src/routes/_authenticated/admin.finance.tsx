import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { format, parseISO, startOfMonth } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FinanceTabs } from "@/components/admin/FinanceTabs";

export const Route = createFileRoute("/_authenticated/admin/finance")({
  component: FinancePage,
});

function FinancePage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "income", category: "", description: "", amount: "", tx_date: format(new Date(), "yyyy-MM-dd"), paid: true });

  const tx = useQuery({
    queryKey: ["tx"],
    queryFn: async () => (await supabase.from("transactions").select("*").order("tx_date", { ascending: false })).data ?? [],
  });

  const totals = useMemo(() => {
    const inc = (tx.data ?? []).filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const exp = (tx.data ?? []).filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const pending = (tx.data ?? []).filter((t) => !t.paid).reduce((s, t) => s + Number(t.amount), 0);
    return { inc, exp, pending, net: inc - exp };
  }, [tx.data]);

  const byMonth = useMemo(() => {
    const map = new Map<string, { month: string; receita: number; despesa: number }>();
    for (const t of tx.data ?? []) {
      const k = format(startOfMonth(parseISO(t.tx_date)), "MMM/yy");
      const cur = map.get(k) || { month: k, receita: 0, despesa: 0 };
      if (t.type === "income") cur.receita += Number(t.amount); else cur.despesa += Number(t.amount);
      map.set(k, cur);
    }
    return Array.from(map.values()).slice(-12);
  }, [tx.data]);

  async function save() {
    if (!form.amount) return toast.error("Informe o valor");
    const { error } = await supabase.from("transactions").insert({
      type: form.type as any, category: form.category || null, description: form.description || null,
      amount: Number(form.amount), tx_date: form.tx_date, paid: form.paid,
    });
    if (error) return toast.error(error.message);
    toast.success("Lançamento salvo");
    setOpen(false);
    setForm({ type: "income", category: "", description: "", amount: "", tx_date: format(new Date(), "yyyy-MM-dd"), paid: true });
    qc.invalidateQueries({ queryKey: ["tx"] });
  }
  async function del(id: string) {
    if (!confirm("Excluir lançamento?")) return;
    await supabase.from("transactions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["tx"] });
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.02em]">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Receitas, despesas e contas a pagar</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ink text-background"><Plus className="mr-1 h-4 w-4" /> Novo lançamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif text-2xl">Novo lançamento</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
              </div>
              <div><Label>Categoria</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Ex: Aluguel, Serviços, Produtos" /></div>
              <div><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Data</Label><Input type="date" value={form.tx_date} onChange={(e) => setForm({ ...form, tx_date: e.target.value })} /></div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} /> Pago
                  </label>
                </div>
              </div>
              <Button onClick={save} className="bg-gradient-gold text-ink">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6"><FinanceTabs /></div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Receita" value={`R$ ${totals.inc.toFixed(2)}`} icon={TrendingUp} color="text-emerald-600" />
        <StatCard label="Despesas" value={`R$ ${totals.exp.toFixed(2)}`} icon={TrendingDown} color="text-destructive" />
        <StatCard label="Lucro líquido" value={`R$ ${totals.net.toFixed(2)}`} icon={Wallet} color="text-gold" accent />
        <StatCard label="A pagar/receber" value={`R$ ${totals.pending.toFixed(2)}`} icon={Wallet} color="text-amber-600" />
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-serif text-xl mb-4">Evolução mensal</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={byMonth}>
              <defs>
                <linearGradient id="fi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.72 0.08 75)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.72 0.08 75)" stopOpacity={0} /></linearGradient>
                <linearGradient id="fe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.22 27)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.55 0.22 27)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 70)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="receita" stroke="oklch(0.72 0.08 75)" fill="url(#fi)" strokeWidth={2} />
              <Area type="monotone" dataKey="despesa" stroke="oklch(0.55 0.22 27)" fill="url(#fe)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Categoria</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tx.data?.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-3">{format(parseISO(t.tx_date), "dd/MM/yyyy")}</td>
                <td className="px-4 py-3">
                  <Badge variant={t.type === "income" ? "default" : "destructive"}>{t.type === "income" ? "Receita" : "Despesa"}</Badge>
                </td>
                <td className="px-4 py-3">{t.category || "—"}</td>
                <td className="px-4 py-3">{t.description || "—"}</td>
                <td className={`px-4 py-3 text-right font-medium ${t.type === "income" ? "text-emerald-600" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "−"} R$ {Number(t.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={t.paid ? "secondary" : "outline"}>{t.paid ? "Pago" : "Pendente"}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => del(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {tx.data?.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Nenhum lançamento.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, accent }: any) {
  return (
    <Card className={accent ? "border-gold/40" : ""}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className="mt-2 font-serif text-2xl">{value}</div>
          </div>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </Card>
  );
}
