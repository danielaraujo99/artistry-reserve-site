import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Phone, Clock, Mail, ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato · Estúdio Elaine Hahn" },
      { name: "description", content: "Fale com o Estúdio Elaine Hahn — WhatsApp de Elaine e Verônica, e-mail, Instagram, endereço e horários em Cachoeiro de Itapemirim." },
      { property: "og:title", content: "Contato · Estúdio Elaine Hahn" },
      { property: "og:description", content: "WhatsApp, e-mail, Instagram, endereço e horários." },
    ],
  }),
  component: ContatoPage,
});

const TEAM = [
  {
    name: "Elaine Hahn",
    role: "Hair Stylist · Loiros & Coloração",
    phone: "(28) 99975-3008",
    wa: "5528999753008",
    email: "elaine-hahn@hotmail.com",
    img: "/team/elaine.jpg",
  },
  {
    name: "Verônica Pereira",
    role: "Especialista em Mechas & Colorimetria",
    phone: "(28) 99930-6087",
    wa: "5528999306087",
    email: "Veronicapereiradeoliveira2@gmail.com",
    img: "/team/veronica.jpg",
  },
];

function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory to-background" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <div className="eyebrow">Contato</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Entre em contato <span className="italic text-gold-deep">conosco</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-foreground/70">
              Tire suas dúvidas, conheça nossos serviços ou agende um horário falando diretamente com nossas profissionais.
            </p>
          </div>
        </div>
      </section>

      {/* Professionals direct contact */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {TEAM.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-2xl border bg-card shadow-luxe">
                <div className="flex items-center gap-5 border-b border-border/60 p-6">
                  <img src={m.img} alt={m.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <h2 className="font-serif text-2xl leading-tight">{m.name}</h2>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <div className="divide-y divide-border/60">
                  <a
                    href={`https://wa.me/${m.wa}?text=${encodeURIComponent(`Olá ${m.name.split(" ")[0]}, gostaria de mais informações.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/30"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-ink">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">WhatsApp</span>
                      <span className="block truncate font-serif text-lg">{m.phone}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gold-deep transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a href={`mailto:${m.email}`} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-accent/30">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">E-mail</span>
                      <span className="block truncate font-serif text-lg lowercase">{m.email}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gold-deep transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio info + map */}
      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border bg-card p-6 shadow-luxe">
              <div className="flex items-center gap-3 text-gold-deep">
                <MapPin className="h-5 w-5" />
                <div className="eyebrow">Endereço</div>
              </div>
              <p className="mt-4 font-serif text-xl leading-snug">Cachoeiro de Itapemirim<br />Espírito Santo</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-luxe">
              <div className="flex items-center gap-3 text-gold-deep">
                <Clock className="h-5 w-5" />
                <div className="eyebrow">Horário de atendimento</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                <li className="flex justify-between"><span>Terça – Sexta</span><span className="font-medium">9h – 19h</span></li>
                <li className="flex justify-between"><span>Sábado</span><span className="font-medium">9h – 17h</span></li>
                <li className="flex justify-between text-muted-foreground"><span>Domingo / Segunda</span><span>Fechado</span></li>
              </ul>
            </div>

            <a
              href="https://instagram.com/elainehahn_"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-luxe transition-colors hover:border-gold/60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Instagram className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Instagram</span>
                <span className="block font-serif text-lg">@elainehahn_</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-gold-deep transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="h-[360px] overflow-hidden rounded-2xl border shadow-editorial sm:h-[480px] lg:h-full">
              <iframe
                title="Mapa Cachoeiro de Itapemirim"
                src="https://www.google.com/maps?q=Cachoeiro+de+Itapemirim+ES&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-ink py-16 text-background">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center md:px-8">
          <div className="eyebrow !text-gold-soft">Pronta para agendar?</div>
          <h3 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Reserve seu horário online em poucos cliques.
          </h3>
          <Button asChild className="h-12 rounded-md bg-gradient-gold px-8 text-[11px] font-semibold tracking-[0.22em] text-ink hover:opacity-95">
            <Link to="/agendar">AGENDAR AGORA <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <Phone className="hidden" />

      <Footer />
    </div>
  );
}
