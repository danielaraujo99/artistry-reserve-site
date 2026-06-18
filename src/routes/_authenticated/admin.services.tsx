import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", duration_min: "60" });

  const list = useQuery({
    queryKey: ["services-admin"],
    queryFn: async () => (await supabase.from("services").select("*").order("sort_order")).data ?? [],
  });

  async function save() {
    if (!form.name) return;
    const next = (list.data?.length || 0) + 1;
    const { error } = await supabase.from("services").insert({
      name: form.name, category: form.category || null,
      price: Number(form.price || 0), duration_min: Number(form.duration_min || 60), sort_order: next,
    });
    if (error) return toast.error(error.message);
    toast.success("Serviço criado");
    setOpen(false); setForm({ name: "", category: "", price: "", duration_min: "60" });
    qc.invalidateQueries({ queryKey: ["services-admin"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  }
  async function del(id: string) {
    if (!confirm("Remover serviço?")) return;
    await supabase.from("services").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["services-admin"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="font-serif text-4xl">Serviços</h1>
          <p className="text-sm text-muted-foreground">Catálogo de serviços oferecidos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-ink text-background"><Plus className="mr-1 h-4 w-4" /> Novo</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif text-2xl">Novo serviço</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Categoria</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Duração (min)</Label><Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: e.target.value })} /></div>
              </div>
              <Button onClick={save} className="bg-gradient-gold text-ink">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.data?.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.category}</div>
                <div className="font-serif text-2xl">{s.name}</div>
                <div className="mt-2 text-sm text-muted-foreground">R$ {Number(s.price).toFixed(2)} · {s.duration_min}min</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
