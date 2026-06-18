import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Sparkles, Award, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BookingDialog } from "@/components/site/BookingDialog";
import { servicesQuery, professionalsQuery, galleryQuery } from "@/lib/queries";
import { whatsappContactLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Estúdio Elaine Hahn — Beleza Premium em Cachoeiro" },
      { name: "description", content: "Loiros, coloração, mechas e tratamentos capilares com técnica internacional. Agende online no Estúdio Elaine Hahn." },
    ],
  }),
  component: Home,
});

function Home() {
  const services = useQuery(servicesQuery);
  const pros = useQuery(professionalsQuery);
  const gallery = useQuery(galleryQuery);
  const [booking, setBooking] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10">
          <img src="/gallery/destaque-006.jpeg" alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        </div>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground/70 backdrop-blur">
              <Sparkles className="h-3 w-3 text-gold" /> Estúdio de beleza premium
            </div>
            <h1 className="mt-6 font-serif text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-8xl">
              Realce sua<br /><span className="italic text-gold">beleza natural</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-foreground/70 sm:text-lg">
              Um refúgio de bem-estar e cuidados exclusivos. Técnica internacional em loiros, coloração e mechas, com atendimento humanizado.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" onClick={() => setBooking(true)} className="bg-ink text-background hover:bg-ink/90 px-8">
                AGENDAR <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="border-foreground/20 hover:border-gold">
                <a href="#galeria">Ver transformações</a>
              </Button>
            </div>
            <div className="mt-16 grid max-w-md grid-cols-3 gap-6 text-center">
              <div><div className="font-serif text-3xl text-gold">10+</div><div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Anos</div></div>
              <div><div className="font-serif text-3xl text-gold">2K+</div><div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Clientes</div></div>
              <div><div className="font-serif text-3xl text-gold">5★</div><div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Avaliação</div></div>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative h-[600px]">
              <div className="absolute right-0 top-0 h-72 w-56 overflow-hidden rounded-md shadow-luxe">
                <img src="/gallery/destaque-002.jpeg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-10 left-0 h-80 w-64 overflow-hidden rounded-md shadow-luxe">
                <img src="/gallery/destaque-004.jpeg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute bottom-32 right-12 glass-panel rounded-md p-4 shadow-luxe">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold" />
                  <div>
                    <div className="font-serif text-sm">Pivot Point</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Formação Internacional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="text-[11px] uppercase tracking-[0.25em] text-gold">Nossos serviços</div>
              <h2 className="mt-3 font-serif text-5xl leading-tight">Excelência<br />em cada detalhe</h2>
              <p className="mt-4 text-foreground/70">Conheça nossa seleção de serviços exclusivos, com destaque para loiros e coloração de alta performance.</p>
              <Button onClick={() => setBooking(true)} className="mt-8 bg-ink text-background hover:bg-ink/90">
                Agendar serviço <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="md:col-span-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {services.data?.map((s, i) => (
                  <div key={s.id}
                    className={`group relative overflow-hidden rounded-md border bg-card p-6 transition-all hover:border-gold hover:shadow-luxe ${
                      i === 2 || i === 3 ? "sm:row-span-2 sm:pb-12" : ""
                    }`}>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.category}</div>
                    <h3 className="mt-2 font-serif text-3xl">{s.name}</h3>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-light">R$ {Number(s.price).toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">a partir · {s.duration_min}min</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="bg-accent/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-gold">Galeria</div>
              <h2 className="mt-3 font-serif text-5xl">Transformações</h2>
            </div>
            <p className="max-w-md text-foreground/70">Resultados reais de clientes reais. Cada cor, cada corte, uma assinatura.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.data?.map((g, i) => (
              <div key={g.id}
                className={`group relative overflow-hidden rounded-md ${i === 0 || i === 7 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <img src={g.image_url} alt={g.title || "Transformação"} loading="lazy"
                  className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFISSIONAIS */}
      <section id="profissionais" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="text-[11px] uppercase tracking-[0.25em] text-gold">Profissionais</div>
            <h2 className="mt-3 font-serif text-5xl">Mãos que assinam</h2>
          </div>
          <div className="space-y-24">
            {pros.data?.map((p, i) => (
              <div key={p.id} className={`grid items-center gap-12 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative">
                  <img src={p.photo_url || ""} alt={p.name}
                    className="aspect-[4/5] w-full rounded-md object-cover shadow-luxe" />
                  <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 bg-gradient-gold md:block" style={{ zIndex: -1 }} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-gold">{p.role_title}</div>
                  <h3 className="mt-3 font-serif text-5xl">{p.name}</h3>
                  <p className="mt-5 text-foreground/70">{p.bio}</p>
                  <ul className="mt-6 space-y-2">
                    {p.specialties?.map((sp) => (
                      <li key={sp} className="flex items-center gap-2 text-sm">
                        <span className="h-1 w-6 bg-gold" /> {sp}
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => setBooking(true)} variant="outline" className="mt-8 border-foreground/20 hover:border-gold">
                    Agendar com {p.name.split(" ")[0]}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="bg-ink py-24 text-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-gold">O Estúdio</div>
            <h2 className="mt-3 font-serif text-5xl">Um refúgio de bem-estar<br /><span className="italic text-gold-soft">e sofisticação</span></h2>
            <p className="mt-6 text-background/70">
              Nossa missão é oferecer uma experiência personalizada, unindo conhecimento técnico de alto nível a um atendimento acolhedor e humanizado.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Heart className="h-6 w-6 text-gold" />
                <div>
                  <div className="font-serif text-lg">Acolhimento</div>
                  <div className="text-sm text-background/60">Cada cliente é única.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="h-6 w-6 text-gold" />
                <div>
                  <div className="font-serif text-lg">Formação internacional</div>
                  <div className="text-sm text-background/60">Pivot Point & L'Oréal.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="/gallery/destaque-001.jpg" alt="" className="aspect-[3/4] rounded-md object-cover" />
            <img src="/gallery/destaque-003.jpeg" alt="" className="mt-12 aspect-[3/4] rounded-md object-cover" />
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <a href={whatsappContactLink()} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-ink shadow-luxe transition-transform hover:scale-110">
        <MessageCircle className="h-6 w-6" />
      </a>

      <BookingDialog open={booking} onOpenChange={setBooking} />
    </div>
  );
}
