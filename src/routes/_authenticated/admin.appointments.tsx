import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Phone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  component: AppointmentsPage,
});

const STATUS_LABEL: Record<string, string> = { pending: "Pendente", confirmed: "Confirmado", done: "Concluído", cancelled: "Cancelado" };

function AppointmentsPage() {
  const qc = useQueryClient();
  const [proFilter, setProFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const list = useQuery({
    queryKey: ["appts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments").select("*").order("appt_date", { ascending: false }).order("appt_time");
      if (error) throw error;
      return data;
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
  }

  const filtered = list.data?.filter((a) =>
    (proFilter === "all" || a.professional_id === proFilter) &&
    (statusFilter === "all" || a.status === statusFilter)
  ) ?? [];

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
                        className="text-xs text-muted-foreground hover:text-gold inline-flex items-center gap-1">
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
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "confirmed")}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "cancelled")}><X className="h-4 w-4" /></Button>
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
    </div>
  );
}
