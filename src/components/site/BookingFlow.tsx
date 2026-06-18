import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, startOfToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { servicesQuery, professionalsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { buildBookingWhatsAppLink } from "@/lib/whatsapp";
import { toast } from "sonner";
import { Check, Scissors, User2, CalendarDays, Clock, Loader2, ArrowRight, ArrowLeft, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const STEPS = [
  { n: 1, label: "Serviço", icon: Scissors },
  { n: 2, label: "Profissional", icon: User2 },
  { n: 3, label: "Data", icon: CalendarDays },
  { n: 4, label: "Horário", icon: Clock },
  { n: 5, label: "Revisão", icon: ClipboardCheck },
];

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

export function BookingFlow({
  embedded = false,
  initialServiceId,
  onClose,
}: {
  embedded?: boolean;
  initialServiceId?: string;
  onClose?: () => void;
}) {
  const services = useQuery(servicesQuery);
  const pros = useQuery(professionalsQuery);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { service?: string; pro?: string };

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string>(initialServiceId ?? "");
  const [proId, setProId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ link: string } | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
      setStep(2);
      return;
    }
    if (search.service && services.data?.some((s) => s.id === search.service)) setServiceId(search.service);
    if (search.pro && pros.data?.some((p) => p.id === search.pro)) setProId(search.pro);
  }, [search.service, search.pro, services.data, pros.data, initialServiceId]);

  const service = services.data?.find((s) => s.id === serviceId);
  const pro = pros.data?.find((p) => p.id === proId);
  const days = useMemo(() => Array.from({ length: 21 }, (_, i) => addDays(startOfToday(), i)), []);

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
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "mx-auto max-w-xl text-center",
          embedded ? "py-6" : "rounded-3xl border bg-card p-10 shadow-editorial sm:p-14",
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink text-background"
        >
          <Check className="h-7 w-7" />
        </motion.div>
        <h2 className="mt-7 font-serif text-4xl text-foreground sm:text-5xl">Reserva enviada</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground leading-relaxed">
          Seu horário foi registrado e o WhatsApp do studio foi aberto com o resumo. Aguarde a confirmação final da nossa equipe.
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-ivory p-5 text-left">
          <Row label="Serviço" value={service?.name} dark />
          <Row label="Profissional" value={pro?.name} dark />
          <Row label="Dia" value={date ? format(parseISO(date), "dd 'de' MMMM", { locale: ptBR }) : undefined} dark />
          <Row label="Horário" value={time} dark />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-md bg-ink px-6 text-[11px] font-semibold tracking-[0.22em] text-background hover:bg-ink/90">
            <a href={done.link} target="_blank" rel="noreferrer">REABRIR WHATSAPP</a>
          </Button>
          <Button
            variant="outline"
            onClick={() => (embedded && onClose ? onClose() : navigate({ to: "/" }))}
            className="h-11 rounded-md px-6 text-[11px] font-semibold tracking-[0.22em]"
          >
            {embedded ? "FECHAR" : "VOLTAR AO SITE"}
          </Button>
        </div>
      </motion.div>
    );
  }

  const progress = (step / STEPS.length) * 100;

  const flow = (
    <div className={embedded ? "" : "rounded-3xl border bg-card p-6 shadow-luxe sm:p-9"}>
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-deep">
          Passo {step} de {STEPS.length}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {STEPS[step - 1].label}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-gold"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step markers */}
      <ol className="mt-7 mb-9 grid grid-cols-5 gap-1.5">
        {STEPS.map((s) => {
          const active = step === s.n;
          const completed = step > s.n;
          return (
            <li key={s.n} className="flex flex-col items-center gap-2 text-center">
              <button
                type="button"
                onClick={() => completed && setStep(s.n)}
                disabled={!completed}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-xs transition-all",
                  completed && "border-ink bg-ink text-background",
                  active && !completed && "border-gold-deep bg-gold-deep text-background",
                  !active && !completed && "border-border bg-muted text-muted-foreground",
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </button>
              <span className={cn("hidden text-[9px] font-semibold uppercase tracking-[0.16em] sm:block", active || completed ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" {...fade} className="space-y-5">
            <SectionHead title="Escolha o serviço" subtitle="Selecione a experiência que você deseja viver." />
            <div className="grid gap-3 sm:grid-cols-2">
              {services.data?.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setServiceId(s.id); setStep(2); }}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all",
                    serviceId === s.id ? "border-gold-deep bg-accent/60 shadow-luxe" : "border-border hover:border-gold/60 hover:bg-accent/20",
                  )}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{s.category}</div>
                  <div className="mt-2 font-serif text-2xl leading-tight text-foreground">{s.name}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-gold-deep">R$ {Number(s.price).toFixed(0)}</span>
                    <span className="text-muted-foreground">{s.duration_min} min</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" {...fade} className="space-y-5">
            <SectionHead title="Escolha a profissional" subtitle="Quem vai cuidar de você?" />
            <div className="grid gap-3 sm:grid-cols-2">
              {pros.data?.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setProId(p.id); setStep(3); }}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                    proId === p.id ? "border-gold-deep bg-accent/60 shadow-luxe" : "border-border hover:border-gold/60",
                  )}
                >
                  {p.photo_url && <img src={p.photo_url} alt={p.name} className="h-16 w-16 shrink-0 rounded-full object-cover" />}
                  <div className="min-w-0">
                    <div className="font-serif text-2xl leading-tight text-foreground">{p.name}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{p.role_title}</div>
                  </div>
                </button>
              ))}
            </div>
            <Nav back={() => setStep(initialServiceId ? 1 : 1)} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" {...fade} className="space-y-5">
            <SectionHead title="Escolha a data" subtitle="Selecione o dia ideal para a sua visita." />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {days.map((d) => {
                const iso = format(d, "yyyy-MM-dd");
                const selected = date === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => { setDate(iso); setStep(4); }}
                    className={cn(
                      "rounded-2xl border px-2 py-3 text-center transition-all",
                      selected ? "border-gold-deep bg-ink text-background" : "border-border hover:border-gold/60",
                    )}
                  >
                    <div className={cn("text-[9px] font-semibold uppercase tracking-[0.16em]", selected ? "text-background/60" : "text-muted-foreground")}>
                      {format(d, "EEE", { locale: ptBR })}
                    </div>
                    <div className="mt-1 font-serif text-3xl leading-none text-current">{format(d, "dd")}</div>
                    <div className={cn("mt-1 text-[9px] font-medium uppercase", selected ? "text-background/60" : "text-muted-foreground")}>
                      {format(d, "MMM", { locale: ptBR })}
                    </div>
                  </button>
                );
              })}
            </div>
            <Nav back={() => setStep(2)} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" {...fade} className="space-y-5">
            <SectionHead title="Escolha o horário" subtitle="Horários disponíveis para o dia selecionado." />
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {SLOTS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTime(t); setStep(5); }}
                  className={cn(
                    "rounded-xl border py-3.5 text-sm font-medium transition-all",
                    time === t ? "border-gold-deep bg-ink text-background" : "border-border hover:border-gold/60",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <Nav back={() => setStep(3)} />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="s5" {...fade} className="space-y-6">
            <SectionHead title="Revisão e confirmação" subtitle="Confira os detalhes e informe seus dados para finalizar." />

            <div className="rounded-2xl border bg-ivory p-5">
              <Row label="Serviço" value={service?.name} dark />
              <Row label="Profissional" value={pro?.name} dark />
              <Row label="Dia" value={date ? format(parseISO(date), "dd 'de' MMMM", { locale: ptBR }) : undefined} dark />
              <Row label="Horário" value={time} dark />
              <div className="mt-4 flex items-baseline justify-between border-t border-border/70 pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Valor</span>
                <span className="font-serif text-3xl text-gold-deep">{service ? `R$ ${Number(service.price).toFixed(0)}` : "A definir"}</span>
              </div>
            </div>

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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={() => setStep(4)} className="text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={confirm}
                disabled={!name || submitting}
                className="h-12 rounded-md bg-ink px-7 text-[11px] font-semibold tracking-[0.22em] text-background hover:bg-ink/90"
              >
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> ENVIANDO…</> : "CONFIRMAR AGENDAMENTO"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (embedded) return flow;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {flow}

      {/* Sticky summary */}
      <aside className="lg:sticky lg:top-28 h-fit">
        <div className="rounded-3xl bg-ink p-7 text-background shadow-editorial">
          <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-soft">Sua reserva</div>
          <dl className="mt-6 space-y-4 text-sm">
            <Row label="Serviço" value={service?.name} />
            <Row label="Profissional" value={pro?.name} />
            <Row label="Dia" value={date ? format(parseISO(date), "dd 'de' MMMM", { locale: ptBR }) : undefined} />
            <Row label="Horário" value={time} />
          </dl>
          <div className="mt-7 border-t border-background/15 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-background/55">Valor</span>
              <span className="font-serif text-3xl text-gold-soft">
                {service ? `R$ ${Number(service.price).toFixed(0)}` : "A definir"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-serif text-3xl text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Row({ label, value, dark }: { label: string; value?: string; dark?: boolean }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-baseline gap-3 py-1">
      <dt className={cn("text-[10px] font-semibold uppercase tracking-[0.22em]", dark ? "text-muted-foreground" : "text-background/55")}>{label}</dt>
      <dd className={cn("font-serif text-lg", value ? (dark ? "text-foreground" : "text-background") : (dark ? "text-muted-foreground/50" : "text-background/35"))}>
        {value || "Selecionar"}
      </dd>
    </div>
  );
}

function Nav({ back }: { back: () => void }) {
  return (
    <div className="flex items-center pt-2">
      <Button type="button" variant="ghost" onClick={back} className="text-muted-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>
    </div>
  );
}
