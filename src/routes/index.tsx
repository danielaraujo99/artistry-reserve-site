import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Award, MessageCircle, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { servicesQuery, professionalsQuery, galleryQuery } from "@/lib/queries";
import { whatsappContactLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Estúdio Elaine Hahn — Beleza Premium em Cachoeiro de Itapemirim" },
      { name: "description", content: "Estúdio de beleza premium especialista em loiros, coloração, mechas e tratamentos capilares com técnica internacional Pivot Point e L'Oréal." },
      { property: "og:title", content: "Estúdio Elaine Hahn — Beleza Premium" },
      { property: "og:description", content: "Loiros, coloração, mechas e tratamentos com assinatura premium." },
    ],
  }),
  component: Home,
});

const FORMATIONS = ["Pivot Point", "L'Oréal Professionnel", "SOFT Hair", "ICloiral"];

function Home() {
  const services = useQuery(servicesQuery);
  const pros = useQuery(professionalsQuery);
  const gallery = useQuery(galleryQuery);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-28 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory via-background to-background" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 md:px-8 lg:grid-cols-12 lg:gap-16 lg:pb-32 lg:pt-16">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-background/70 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.25em] text-foreground/75 backdrop-blur">
              <Sparkles className="h-3 w-3 text-gold" /> Beauty Studio · Cachoeiro – ES
            </div>
            <h1 className="mt-7 font-serif text-[3.25rem] leading-[0.92] text-foreground sm:text-7xl lg:text-[5.75rem]">
              Realce a sua<br />
              <span className="italic text-gold-deep">beleza natural</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-foreground/70 sm:text-lg">
              Um refúgio de bem-estar e cuidados exclusivos. Técnica internacional em loiros, coloração e mechas, com atendimento humano e personalizado.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 bg-ink text-background hover:bg-ink/85 px-7 tracking-[0.2em] text-xs">
                <Link to="/agendar">AGENDAR HORÁRIO <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-foreground/20 hover:border-gold tracking-[0.2em] text-xs px-7">
                <Link to="/servicos">VER SERVIÇOS</Link>
              </Button>
            </div>

            <div className="mt-14 grid max-w-md grid-cols-3 gap-4">
              {[
                { v: "10+", l: "Anos" },
                { v: "2K+", l: "Clientes" },
                { v: "5★", l: "Avaliação" },
              ].map((s) => (
                <div key={s.l} className="text-center sm:text-left">
                  <div className="font-serif text-4xl text-gold-deep">{s.v}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Editorial collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative lg:col-span-6"
          >
            <div className="relative mx-auto grid h-[420px] max-w-md grid-cols-6 grid-rows-6 gap-3 sm:h-[520px] lg:h-[640px] lg:max-w-none">
              <div className="col-span-4 row-span-4 overflow-hidden rounded-2xl shadow-editorial">
                <img src="/gallery/destaque-002.jpeg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden rounded-2xl shadow-editorial">
                <img src="/gallery/destaque-004.jpeg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-2 row-span-3 overflow-hidden rounded-2xl shadow-editorial">
                <img src="/gallery/destaque-005.jpeg" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="col-span-4 row-span-2 overflow-hidden rounded-2xl shadow-editorial">
                <img src="/gallery/destaque-007.jpeg" alt="" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="glass-panel absolute -bottom-4 left-4 hidden items-center gap-3 rounded-xl px-4 py-3 shadow-editorial sm:flex lg:left-auto lg:right-2">
              <Award className="h-5 w-5 text-gold-deep" />
              <div>
                <div className="font-serif text-sm leading-tight">Pivot Point</div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Formação Internacional</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Formations strip */}
        <div className="border-y border-border/60 bg-background">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-3 px-5 py-5 md:px-8">
            <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Formações & marcas</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm tracking-[0.12em] text-foreground/75">
              {FORMATIONS.map((f) => (
                <span key={f} className="font-serif text-lg italic">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="eyebrow">Nossos serviços</div>
              <h2 className="mt-4 font-serif text-5xl leading-[1.02] lg:text-6xl">
                Excelência<br />em cada<br /><span className="italic text-gold-deep">detalhe</span>
              </h2>
              <div className="hairline mt-8 w-24" />
              <p className="mt-6 text-foreground/70 leading-relaxed">
                Conheça nossa seleção de serviços exclusivos, com destaque para loiros e coloração de alta performance, cortes editorialmente desenhados e tratamentos restauradores.
              </p>
              <Button asChild className="mt-8 h-12 bg-ink text-background hover:bg-ink/90 tracking-[0.2em] text-xs px-6">
                <Link to="/servicos">VER CATÁLOGO COMPLETO <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {services.data?.slice(0, 4).map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Link
                      to="/agendar"
                      search={{ service: s.id }}
                      className="group relative flex h-full flex-col justify-between rounded-2xl border bg-card p-6 transition-all hover:border-gold hover:shadow-editorial sm:p-7"
                    >
                      <div>
                        <div className="eyebrow !text-[10px] !text-muted-foreground">{s.category}</div>
                        <h3 className="mt-3 font-serif text-3xl leading-tight">{s.name}</h3>
                        {s.description && <p className="mt-3 text-sm text-foreground/65 line-clamp-2">{s.description}</p>}
                      </div>
                      <div className="mt-8 flex items-end justify-between border-t border-border/60 pt-4">
                        <div>
                          <div className="font-serif text-2xl text-gold-deep">R$ {Number(s.price).toFixed(0)}</div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">a partir · {s.duration_min}min</div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gold-deep transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 sm:flex sm:flex-wrap sm:justify-between">
            <div className="min-w-0">
              <div className="eyebrow">Galeria</div>
              <h2 className="mt-3 font-serif text-5xl lg:text-6xl">Transformações</h2>
            </div>
            <Link to="/galeria" className="hidden text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-gold-deep sm:inline-flex items-center gap-2">
              Ver galeria completa <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-4 max-w-md text-foreground/70">Resultados reais de clientes reais. Cada cor, cada corte, uma assinatura.</p>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.data?.slice(0, 6).map((g, i) => (
              <Link
                key={g.id}
                to="/galeria"
                className={`group relative overflow-hidden rounded-xl shadow-luxe ${
                  i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"
                }`}
              >
                <img src={g.image_url} alt={g.title || "Transformação"} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Button asChild variant="outline" className="tracking-[0.2em] text-xs">
              <Link to="/galeria">VER GALERIA COMPLETA</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============ PROFESSIONALS ============ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow">Profissionais</div>
            <h2 className="mt-4 font-serif text-5xl lg:text-6xl">Mãos que <span className="italic text-gold-deep">assinam</span></h2>
            <p className="mt-5 text-foreground/70">Duas trajetórias, uma mesma busca pela excelência. Conheça as profissionais que tornam cada atendimento único.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
            {pros.data?.slice(0, 2).map((p) => (
              <div key={p.id} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-editorial">
                  <img src={p.photo_url || ""} alt={p.name} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent p-6 text-background">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">{p.role_title}</div>
                    <div className="mt-1 font-serif text-3xl">{p.name}</div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {p.specialties?.slice(0, 2).map((sp) => (
                      <span key={sp} className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground/70">{sp}</span>
                    ))}
                  </div>
                  <Link to="/agendar" search={{ pro: p.id }} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold-deep hover:text-foreground">
                    Agendar <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-ivory py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 max-w-xl">
            <div className="eyebrow">Depoimentos</div>
            <h2 className="mt-4 font-serif text-5xl">O que dizem<br />nossas <span className="italic text-gold-deep">clientes</span></h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Marina", text: "Saio do estúdio renovada todas as vezes. O cuidado e a técnica fazem toda diferença no resultado." },
              { name: "Camila", text: "Encontrei finalmente o tom de loiro dos meus sonhos. Atendimento de altíssimo nível, recomendo sem dúvidas." },
              { name: "Beatriz", text: "Ambiente lindo, equipe maravilhosa e um trabalho impecável. Virei cliente fiel." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border bg-card p-7">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-5 font-serif text-xl leading-snug text-foreground/85">"{t.text}"</p>
                <div className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="relative overflow-hidden bg-ink py-28 text-background">
        <img src="/gallery/destaque-008.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/90" />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <div className="eyebrow !text-gold-soft">Sua próxima experiência</div>
          <h2 className="mt-5 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Pronta para se<br /><span className="italic text-gold-soft">surpreender</span>?
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-background/70">
            Reserve agora seu horário e viva uma experiência editorial de cuidado e beleza no nosso estúdio em Cachoeiro de Itapemirim.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 bg-gradient-gold text-ink hover:opacity-95 tracking-[0.2em] text-xs px-7">
              <Link to="/agendar">AGENDAR AGORA <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-background/30 text-background hover:bg-background/10 tracking-[0.2em] text-xs px-7">
              <Link to="/contato"><MapPin className="mr-2 h-4 w-4" /> COMO CHEGAR</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <a href={whatsappContactLink()} target="_blank" rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-ink shadow-editorial transition-transform hover:scale-110">
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
