import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Phone, Clock, Mail } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { whatsappContactLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato · Estúdio Elaine Hahn" },
      { name: "description", content: "Fale com o Estúdio Elaine Hahn — WhatsApp, Instagram, endereço e horários de funcionamento em Cachoeiro de Itapemirim." },
      { property: "og:title", content: "Contato · Estúdio Elaine Hahn" },
      { property: "og:description", content: "WhatsApp, Instagram, endereço e horários." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory to-background" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <div className="eyebrow">Contato</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Vamos <span className="italic text-gold-deep">conversar</span>
            </h1>
            <p className="mt-7 text-foreground/70 text-lg max-w-xl">
              Tire suas dúvidas, conheça nossos serviços ou agende um horário pelos canais abaixo.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-5">
            <InfoCard icon={MessageCircle} title="WhatsApp" value="(28) 99975-3008" href={whatsappContactLink()} cta="Falar agora" featured />
            <InfoCard icon={Phone} title="Telefone" value="(28) 99975-3008" href="tel:+5528999753008" cta="Ligar" />
            <InfoCard icon={Instagram} title="Instagram" value="@elainehahn_" href="https://instagram.com/elainehahn_" cta="Seguir" />
            <InfoCard icon={Mail} title="E-mail" value="contato@estudioelainehahn.com.br" href="mailto:contato@estudioelainehahn.com.br" cta="Enviar e-mail" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3 text-gold-deep">
                  <MapPin className="h-5 w-5" />
                  <div className="eyebrow">Endereço</div>
                </div>
                <p className="mt-4 font-serif text-xl leading-snug">Cachoeiro de Itapemirim<br />Espírito Santo</p>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3 text-gold-deep">
                  <Clock className="h-5 w-5" />
                  <div className="eyebrow">Horário</div>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-foreground/75">
                  <li>Ter–Sex · 9h – 19h</li>
                  <li>Sábado · 9h – 17h</li>
                  <li className="text-muted-foreground">Dom/Seg · fechado</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border shadow-editorial h-[420px] lg:h-full min-h-[420px]">
              <iframe
                title="Mapa Cachoeiro de Itapemirim"
                src="https://www.google.com/maps?q=Cachoeiro+de+Itapemirim+ES&output=embed"
                className="h-full w-full"
                loading="lazy"
              />
            </div>
            <div className="mt-6 rounded-2xl bg-ink p-8 text-background shadow-editorial">
              <div className="eyebrow !text-gold-soft">Pronta para agendar?</div>
              <h3 className="mt-3 font-serif text-3xl">Reserve seu horário online em poucos cliques.</h3>
              <Button asChild className="mt-6 h-12 bg-gradient-gold text-ink hover:opacity-95 tracking-[0.2em] text-xs px-6">
                <Link to="/agendar">AGENDAR AGORA</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, href, cta, featured }: {
  icon: any; title: string; value: string; href: string; cta: string; featured?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 rounded-2xl border p-6 transition-all hover:shadow-editorial ${
        featured ? "border-gold/50 bg-gradient-to-br from-accent/40 to-card" : "border-border bg-card hover:border-gold/60"
      }`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${featured ? "bg-gradient-gold text-ink" : "bg-muted text-foreground"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="eyebrow">{title}</div>
        <div className="mt-1 truncate font-serif text-xl">{value}</div>
      </div>
      <span className="hidden text-[11px] uppercase tracking-[0.22em] text-gold-deep sm:block">{cta} →</span>
    </a>
  );
}
