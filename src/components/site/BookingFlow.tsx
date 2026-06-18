import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { servicesQuery, professionalsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { buildBookingWhatsAppLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { Check, Scissors, User2, CalendarDays, Clock, Loader2, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const STEPS = [
  { n: 1, label: "Serviço", icon: Scissors },
  { n: 2, label: "Profissional", icon: User2 },
  { n: 3, label: "Data & hora", icon: CalendarDays },
  { n: 4, label: "Confirmação", icon: Check },
];

export function BookingFlow() {
  const services = useQuery(servicesQuery);
  const pros = useQuery(professionalsQuery);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { service?: string; pro?: string };

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string>("");
  const [proId, setProId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ link: string } | null>(null);

  // deep-link presets
  useEffect(() => {
    if (search.service && services.data?.some((s) => s.id === search.service)) setServiceId(search.service);
    if (search.pro && pros.data?.some((p) => p.id === search.pro)) setProId(search.pro);
  }, [search.service, search.pro, services.data, pros.data]);

  const service = services.data?.find((s) => s.id === serviceId);
  const pro = pros.data?.find((p) => p.id === proId);

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i)), []);

  async function confirm() {
    if (!service || !pro || !date || !time || !name) return;
    setSubmitting(true);
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
      const link = buildBookingWhatsAppLink({
        date: format(parseISO(date), "dd/MM/yyyy"),
        time,
        service: service.name,
        professional: pro.name,
        clientName: name,
      });
      toast.success("Agendamento registrado!");
      setDone({ link });
      window.open(link, "_blank");
    } catch (e: any) {
      toast.error("Erro ao agendar: " + e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-card p-10 text-center shadow-editorial">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold text-ink">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-6 font-serif text-4xl">Reserva enviada</h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Seu pedido de horário foi registrado. Já abrimos o WhatsApp do estúdio para a confirmação final.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-ink text-background tracking-[0.2em] text-xs h-11 px-6">
            <a href={done.link} target="_blank" rel="noreferrer">Reabrir WhatsApp</a>
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: "/" })} className="h-11 px-6">Voltar ao site</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      {/* Stepper + content */}
      <div className="rounded-2xl border bg-card p-6 sm:p-10 shadow-editorial">
        {/* progress */}
        <ol className="grid grid-cols-4 gap-2 mb-10">
          {STEPS.map((s) => {
            const active = step === s.n;
            const completed = step > s.n;
            return (
              <li key={s.n} className="flex flex-col items-center text-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-xs transition-all",
                    completed && "border-gold bg-gradient-gold text-ink",
                    active && !completed && "border-foreground bg-foreground text-background",
                    !active && !completed && "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={cn("text-[10px] uppercase tracking-[0.18em]", active || completed ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className="space-y-4">
            <SectionHead title="Escolha o serviço" subtitle="Selecione qual experiência você deseja viver no estúdio." />
            <div className="grid gap-3 sm:grid-cols-2">
              {services.data?.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={cn(
                    "group rounded-xl border p-5 text-left transition-all",
                    serviceId === s.id
                      ? "border-gold bg-accent/60 shadow-luxe"
                      : "border-border hover:border-gold/60 hover:bg-accent/20",
                  )}
                >
                  <div className="eyebrow !text-[10px] !tracking-[0.22em] text-muted-foreground">{s.category}</div>
                  <div className="mt-2 font-serif text-2xl leading-tight">{s.name}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-foreground/80">R$ {Number(s.price).toFixed(0)}</span>
                    <span className="text-muted-foreground">{s.duration_min}min</span>
                  </div>
                </button>
              ))}
            </div>
            <Nav next={() => setStep(2)} nextDisabled={!serviceId} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <SectionHead title="Escolha a profissional" subtitle="Quem vai cuidar de você hoje?" />
            <div className="grid gap-3 sm:grid-cols-2">
              {pros.data?.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProId(p.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    proId === p.id ? "border-gold bg-accent/60 shadow-luxe" : "border-border hover:border-gold/60",
                  )}
                >
                  {p.photo_url && <img src={p.photo_url} alt={p.name} className="h-16 w-16 rounded-full object-cover shrink-0" />}
                  <div className="min-w-0">
                    <div className="font-serif text-xl leading-tight">{p.name}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">{p.role_title}</div>
                  </div>
                </button>
              ))}
            </div>
            <Nav back={() => setStep(1)} next={() => setStep(3)} nextDisabled={!proId} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <SectionHead title="Data & horário" subtitle="Selecione um dia e um horário disponível." />
            <div>
              <Label className="eyebrow">Data</Label>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                {days.map((d) => {
                  const iso = format(d, "yyyy-MM-dd");
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setDate(iso)}
                      className={cn(
                        "min-w-[78px] snap-start rounded-xl border px-3 py-3 text-center transition-all",
                        date === iso ? "border-gold bg-accent/60" : "border-border hover:border-gold/60",
                      )}
                    >
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{format(d, "EEE", { locale: ptBR })}</div>
                      <div className="mt-1 font-serif text-2xl">{format(d, "dd")}</div>
                      <div className="text-[10px] text-muted-foreground">{format(d, "MMM", { locale: ptBR })}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label className="eyebrow"><Clock className="inline h-3 w-3 mr-1" /> Horário</Label>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={cn(
                      "rounded-lg border py-3 text-sm transition-all",
                      time === t ? "border-gold bg-accent/60" : "border-border hover:border-gold/60",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Nav back={() => setStep(2)} next={() => setStep(4)} nextDisabled={!date || !time} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <SectionHead title="Seus dados" subtitle="Para finalizar o seu agendamento." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="eyebrow">Nome completo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como devemos te chamar?" className="h-12" />
              </div>
              <div className="space-y-1.5">
                <Label className="eyebrow">WhatsApp</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(28) 9 9999-9999" className="h-12" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep(3)} className="text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={confirm}
                disabled={!name || submitting}
                className="h-12 px-6 bg-gradient-gold text-ink hover:opacity-95 tracking-[0.2em] text-xs"
              >
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> ENVIANDO…</> : "CONFIRMAR AGENDAMENTO"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 h-fit">
        <div className="rounded-2xl border bg-gradient-ink p-8 text-background shadow-editorial">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold-soft">
            <Sparkles className="h-3 w-3" /> Sua reserva
          </div>
          <dl className="mt-6 space-y-5 text-sm">
            <Row label="Serviço" value={service?.name} />
            <Row label="Profissional" value={pro?.name} />
            <Row label="Dia" value={date ? format(parseISO(date), "dd 'de' MMMM", { locale: ptBR }) : undefined} />
            <Row label="Horário" value={time} />
          </dl>
          <div className="mt-8 border-t border-background/15 pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-[0.22em] text-background/55">Valor</span>
              <span className="font-serif text-3xl text-gold-soft">
                {service ? `R$ ${Number(service.price).toFixed(0)}` : "—"}
              </span>
            </div>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-background/55">
            Após confirmar, seu pedido será registrado e abriremos o WhatsApp do estúdio para a confirmação final.
          </p>
        </div>
      </aside>
    </div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-baseline gap-3">
      <dt className="text-[11px] uppercase tracking-[0.22em] text-background/55">{label}</dt>
      <dd className={cn("font-serif text-lg", value ? "text-background" : "text-background/30")}>
        {value || "Selecionar"}
      </dd>
    </div>
  );
}

function Nav({ back, next, nextDisabled }: { back?: () => void; next: () => void; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center justify-between pt-4">
      {back ? (
        <Button type="button" variant="ghost" onClick={back} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      ) : <span />}
      <Button onClick={next} disabled={nextDisabled} className="h-11 px-6 bg-ink text-background tracking-[0.2em] text-xs">
        CONTINUAR <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
