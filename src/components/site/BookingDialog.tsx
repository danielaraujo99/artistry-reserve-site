import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { servicesQuery, professionalsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { buildBookingWhatsAppLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { Check, ChevronRight, Scissors, User2, CalendarDays, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SLOTS = ["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00","18:00"];

export function BookingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const services = useQuery(servicesQuery);
  const pros = useQuery(professionalsQuery);
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string>("");
  const [proId, setProId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1); setServiceId(""); setProId(""); setDate(""); setTime(""); setName(""); setPhone("");
      }, 200);
    }
  }, [open]);

  const service = services.data?.find((s) => s.id === serviceId);
  const pro = pros.data?.find((p) => p.id === proId);

  const days = useMemo(() => {
    const today = startOfToday();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i));
  }, []);

  async function confirm() {
    if (!service || !pro || !date || !time || !name) return;
    setSubmitting(true);
    const dateLabel = format(new Date(date), "dd/MM/yyyy");
    try {
      const { error } = await supabase.from("appointments").insert({
        client_name: name,
        client_phone: phone || null,
        service_id: service.id,
        service_name: service.name,
        professional_id: pro.id,
        professional_name: pro.name,
        appt_date: date,
        appt_time: time,
        price: service.price,
      });
      if (error) throw error;
      toast.success("Agendamento realizado com sucesso!");
      const url = buildBookingWhatsAppLink({
        date: dateLabel, time, service: service.name, professional: pro.name, clientName: name,
      });
      window.open(url, "_blank");
      onOpenChange(false);
    } catch (e: any) {
      toast.error("Erro ao agendar: " + e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-panel">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" /> Agendar
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Escolha o serviço e a profissional"}
            {step === 2 && "Selecione data e horário"}
            {step === 3 && "Confirme seus dados"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pb-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-2">
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs",
                step >= n ? "bg-gradient-gold text-ink" : "bg-muted text-muted-foreground")}>
                {step > n ? <Check className="h-4 w-4" /> : n}
              </div>
              {n < 3 && <div className={cn("h-px flex-1", step > n ? "bg-gold" : "bg-border")} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground"><Scissors className="inline h-3 w-3 mr-1" /> Serviço</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {services.data?.map((s) => (
                  <button key={s.id} onClick={() => setServiceId(s.id)}
                    className={cn("group rounded-md border p-3 text-left transition-all",
                      serviceId === s.id ? "border-gold bg-accent shadow-luxe" : "border-border hover:border-gold/50")}>
                    <div className="font-serif text-lg">{s.name}</div>
                    <div className="text-xs text-muted-foreground">R$ {Number(s.price).toFixed(0)} · {s.duration_min}min</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground"><User2 className="inline h-3 w-3 mr-1" /> Profissional</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {pros.data?.map((p) => (
                  <button key={p.id} onClick={() => setProId(p.id)}
                    className={cn("flex items-center gap-3 rounded-md border p-3 text-left transition-all",
                      proId === p.id ? "border-gold bg-accent shadow-luxe" : "border-border hover:border-gold/50")}>
                    {p.photo_url && <img src={p.photo_url} alt={p.name} className="h-12 w-12 rounded-full object-cover" />}
                    <div>
                      <div className="font-serif text-base leading-tight">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role_title}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button disabled={!serviceId || !proId} onClick={() => setStep(2)} className="bg-ink text-background hover:bg-ink/90">
                Continuar <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground"><CalendarDays className="inline h-3 w-3 mr-1" /> Data</Label>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {days.map((d) => {
                  const iso = format(d, "yyyy-MM-dd");
                  return (
                    <button key={iso} onClick={() => setDate(iso)}
                      className={cn("min-w-[68px] rounded-md border px-3 py-2 text-center transition-all",
                        date === iso ? "border-gold bg-accent" : "border-border hover:border-gold/50")}>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{format(d, "EEE", { locale: ptBR })}</div>
                      <div className="font-serif text-xl">{format(d, "dd")}</div>
                      <div className="text-[10px] text-muted-foreground">{format(d, "MMM", { locale: ptBR })}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground"><Clock className="inline h-3 w-3 mr-1" /> Horário</Label>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {SLOTS.map((t) => (
                  <button key={t} onClick={() => setTime(t)}
                    className={cn("rounded-md border py-2 text-sm transition-all",
                      time === t ? "border-gold bg-accent" : "border-border hover:border-gold/50")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>Voltar</Button>
              <Button disabled={!date || !time} onClick={() => setStep(3)} className="bg-ink text-background hover:bg-ink/90">
                Continuar <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-md border bg-accent/40 p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Resumo</div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-muted-foreground">Serviço</dt><dd className="font-medium">{service?.name}</dd>
                <dt className="text-muted-foreground">Profissional</dt><dd className="font-medium">{pro?.name}</dd>
                <dt className="text-muted-foreground">Dia</dt><dd className="font-medium">{date && format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</dd>
                <dt className="text-muted-foreground">Hora</dt><dd className="font-medium">{time}</dd>
                <dt className="text-muted-foreground">Valor</dt><dd className="font-medium">R$ {Number(service?.price || 0).toFixed(2)}</dd>
              </dl>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Seu nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
              </div>
              <div>
                <Label>WhatsApp (opcional)</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(28) 9 9999-9999" />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>Voltar</Button>
              <Button disabled={!name || submitting} onClick={confirm} className="bg-gradient-gold text-ink hover:opacity-90">
                {submitting ? "Enviando..." : "Confirmar agendamento"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
