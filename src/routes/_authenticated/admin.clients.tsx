import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const [q, setQ] = useState("");
  const appts = useQuery({
    queryKey: ["appts-for-clients"],
    queryFn: async () => (await supabase.from("appointments").select("*").order("appt_date", { ascending: false })).data ?? [],
  });

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; phone: string | null; lastVisit: string; total: number; visits: number }>();
    for (const a of appts.data ?? []) {
      const key = (a.client_phone || "") + "|" + a.client_name;
      const prev = map.get(key);
      map.set(key, {
        name: a.client_name,
        phone: a.client_phone,
        lastVisit: prev?.lastVisit ?? a.appt_date,
        total: (prev?.total || 0) + Number(a.price || 0),
        visits: (prev?.visits || 0) + 1,
      });
    }
    return Array.from(map.values())
      .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || (c.phone || "").includes(q))
      .sort((a, b) => b.visits - a.visits);
  }, [appts.data, q]);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Clientes</h1>
          <p className="text-sm text-muted-foreground">{clients.length} cliente(s)</p>
        </div>
        <Input placeholder="Buscar por nome ou telefone..." value={q} onChange={(e) => setQ(e.target.value)} className="w-80" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((c, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-serif text-xl">{c.name}</div>
                {c.phone && (
                  <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold">
                    <Phone className="h-3 w-3" /> {c.phone}
                  </a>
                )}
              </div>
              <div className="rounded bg-gradient-gold px-2 py-1 text-xs text-ink">{c.visits}x</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Total gasto</div>
                <div className="font-medium text-foreground">R$ {c.total.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Última visita</div>
                <div className="font-medium text-foreground">{c.lastVisit}</div>
              </div>
            </div>
          </Card>
        ))}
        {clients.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground">Nenhum cliente ainda.</div>}
      </div>
    </div>
  );
}
