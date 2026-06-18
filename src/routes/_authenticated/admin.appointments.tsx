import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Phone, Eye, MessageCircle, Mail, CalendarDays, Clock, User2, Scissors, Tag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  component: AppointmentsPage,
});

const STATUS_LABEL: Record<string, string> = { pending: "Pendente", confirmed: "Confirmado", done: "Concluído", cancelled: "Cancelado" };

type Appt = {
  id: string;
  appt_date: string;
  appt_time: string;
  client_name: string;
  client_phone: string | null;
  client_email?: string | null;
  service_name: string;
  professional_name: string;
  professional_id: string;
  price: number | null;
  status: string;
  notes?: string | null;
};

function AppointmentsPage() {
  const qc = useQueryClient();
  const [proFilter, setProFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Appt | null>(null);

  const list = useQuery({
    queryKey: ["appts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments").select("*").order("appt_date", { ascending: false }).order("appt_time");
      if (error) throw error;
      return data as Appt[];
    },
  });

  const pros = useQuery({
    queryKey: ["pros-all"],
    queryFn: async () => (await supabase.from("professionals").select("*")).data ?? [],
  });

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("appointments").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Atualizado");
    qc.invalidateQueries({ queryKey: ["appts"] });
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  }

  const filtered = list.data?.filter((a) =>
    (proFilter === "all" || a.professional_id === proFilter) &&
    (statusFilter === "all" || a.status === statusFilter)
  ) ?? [];

  function waLink(a: Appt) {
    const phone = (a.client_phone || "").replace(/\D/g, "");
    const num = phone.startsWith("55") ? phone : `55${phone}`;
    const msg =
      `Olá ${a.client_name.split(" ")[0]}, tudo bem? Confirmando seu agendamento no Estúdio Elaine Hahn:\n\n` +
      `Serviço: ${a.service_name}\n` +
      `Profissional: ${a.professional_name}\n` +
      `Dia: ${format(parseISO(a.appt_date), "dd/MM/yyyy", { locale: ptBR })}\n` +
      `Horário: ${a.appt_time.slice(0, 5)}\n\nAté breve!`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Agendamentos</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} agendamento(s)</p>
        </div>
        <div className="flex gap-2">
          <Select value={proFilter} onValueChange={setProFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Profissional" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as profissionais</SelectItem>
              {pros.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left">Profissional</th>
                <th className="px-4 py-3 text-left">Valor</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {format(parseISO(a.appt_date), "dd/MM", { locale: ptBR })} · {a.appt_time.slice(0,5)}
                  </td>
                  <td className="px-4 py-3">
                    <div>{a.client_name}</div>
                    {a.client_phone && (
                      <a href={`https://wa.me/${a.client_phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-admin-accent inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {a.client_phone}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3">{a.service_name}</td>
                  <td className="px-4 py-3">{a.professional_name}</td>
                  <td className="px-4 py-3">R$ {Number(a.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.status === "confirmed" ? "default" : a.status === "cancelled" ? "destructive" : "secondary"}>
                      {STATUS_LABEL[a.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" title="Ver detalhes" onClick={() => setSelected(a)}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" title="Confirmar" onClick={() => updateStatus(a.id, "confirmed")}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" title="Cancelar" onClick={() => updateStatus(a.id, "cancelled")}><X className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Nenhum agendamento.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="admin-theme flex w-full flex-col gap-0 p-0 sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="border-b p-6 text-left">
                <div className="flex items-center justify-between gap-3">
                  <SheetTitle className="font-serif text-2xl">{selected.client_name}</SheetTitle>
                  <Badge variant={selected.status === "confirmed" ? "default" : selected.status === "cancelled" ? "destructive" : "secondary"}>
                    {STATUS_LABEL[selected.status]}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="flex-1 space-y-1 overflow-y-auto p-6">
                <DetailRow icon={CalendarDays} label="Data" value={format(parseISO(selected.appt_date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })} />
                <DetailRow icon={Clock} label="Horário" value={selected.appt_time.slice(0, 5)} />
                <DetailRow icon={Scissors} label="Serviço" value={selected.service_name} />
                <DetailRow icon={User2} label="Profissional" value={selected.professional_name} />
                <DetailRow icon={Tag} label="Valor" value={`R$ ${Number(selected.price || 0).toFixed(2)}`} />
                <DetailRow icon={Phone} label="Telefone" value={selected.client_phone || "Não informado"} />
                {selected.client_email && <DetailRow icon={Mail} label="E-mail" value={selected.client_email} />}
                {selected.notes && (
                  <div className="pt-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Observações</div>
                    <p className="mt-1 text-sm text-foreground/80">{selected.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t p-6">
                {selected.client_phone && (
                  <Button asChild className="w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                    <a href={waLink(selected)} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> Chamar no WhatsApp
                    </a>
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => updateStatus(selected.id, "confirmed")}>
                    <Check className="mr-2 h-4 w-4" /> Confirmar
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selected.id, "cancelled")}>
                    <X className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/50 py-3 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-admin-accent" />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="text-sm font-medium first-letter:uppercase">{value}</div>
      </div>
    </div>
  );
}
