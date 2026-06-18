import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Award, MapPin, Star, Clock, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { servicesQuery, professionalsQuery, galleryQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio de Beleza Elaine Hahn — Cachoeiro de Itapemirim" },
      { name: "description", content: "Studio de beleza premium em Cachoeiro de Itapemirim — loiros, coloração, mechas e tratamentos com formação internacional Pivot Point e L'Oréal." },
      { property: "og:title", content: "Studio de Beleza Elaine Hahn" },
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

      {/* ============ HERO — Dark editorial ============ */}
      <section className="relative isolate overflow-hidden bg-ink text-background">
        {/* Background image with refined dark wash */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/gallery/destaque-002.jpeg"
            alt=""
            className="h-full w-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pt-32 pb-24 md:px-8 lg:grid-cols-12 lg:gap-12 lg:pt-40 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/5 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-background/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Studio de Beleza · Elaine Hahn
            </div>
            <h1 className="mt-7 font-display text-[2.75rem] leading-[1.02] tracking-[-0.025em] sm:text-6xl lg:text-[5.5rem] lg:leading-[0.98]">
              Beleza que<br />
              <span className="text-gold-soft">conta a sua história</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-background/70 sm:text-lg">
              Em Cachoeiro de Itapemirim, um espaço pensado para você desacelerar e viver uma experiência personalizada de cuidado, técnica internacional e autoestima.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 px-7 bg-background text-ink hover:bg-background/90 tracking-[0.22em] text-[11px] font-semibold rounded-md">
                <Link to="/agendar">AGENDAR HORÁRIO <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background tracking-[0.22em] text-[11px] font-semibold rounded-md">
                <Link to="/galeria">VER TRANSFORMAÇÕES</Link>
              </Button>
            </div>

            <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-background/15 pt-8">
              {[
                { v: "10+", l: "Anos de mercado" },
                { v: "2K+", l: "Clientes atendidas" },
                { v: "5.0", l: "Avaliação média" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-semibold text-gold-soft sm:text-4xl">{s.v}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-background/55">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right photo card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative lg:col-span-5 lg:pl-6"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-background/15 shadow-editorial">
              <img src="/gallery/destaque-005.jpeg" alt="Trabalho do studio" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6">
                <div className="flex items-center gap-3 text-background">
                  <Award className="h-5 w-5 text-gold-soft shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">Formação internacional</div>
                    <div className="font-display text-base font-medium">Pivot Point · L'Oréal Professionnel</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block absolute -bottom-5 -left-5 rounded-xl bg-background text-ink p-4 shadow-editorial">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-foreground/55">+200 avaliações 5 estrelas</div>
            </div>
          </motion.div>
        </div>

        {/* Formations strip */}
        <div className="relative border-t border-background/10 bg-ink/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-3 px-5 py-5 md:px-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-background/40">Formações & marcas parceiras</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-background/75">
              {FORMATIONS.map((f) => (
                <span key={f} className="font-display tracking-[0.05em] text-base font-medium">{f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="eyebrow">Nossos serviços</div>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] lg:text-5xl">
                Excelência em<br />cada detalhe.
              </h2>
              <p className="mt-6 text-foreground/70 leading-relaxed">
                Loiros e coloração de alta performance, cortes editorialmente desenhados e tratamentos restauradores, pensados para você.
              </p>
              <Button asChild className="mt-8 h-12 bg-ink text-background hover:bg-ink/90 tracking-[0.22em] text-[11px] font-semibold px-6 rounded-md">
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
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                  >
                    <Link
                      to="/servicos"
                      className="group relative flex h-full flex-col justify-between rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-gold-deep hover:shadow-editorial sm:p-7"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                          <Scissors className="h-3 w-3 text-gold-deep" /> {s.category}
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.02em]">{s.name}</h3>
                        {s.description && <p className="mt-3 text-sm text-foreground/65 line-clamp-2 leading-relaxed">{s.description}</p>}
                      </div>
                      <div className="mt-7 flex items-end justify-between border-t border-border/60 pt-4">
                        <div>
                          <div className="font-display text-xl font-semibold text-gold-deep">R$ {Number(s.price).toFixed(0)}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            <Clock className="h-3 w-3" /> {s.duration_min}min · a partir
                          </div>
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
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
            <div className="min-w-0">
              <div className="eyebrow">Galeria</div>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.025em] lg:text-5xl">Transformações</h2>
            </div>
            <Link to="/galeria" className="hidden text-[11px] uppercase tracking-[0.22em] font-medium text-foreground/70 hover:text-gold-deep sm:inline-flex items-center gap-2">
              Ver galeria completa <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-4 max-w-md text-foreground/65">Resultados reais de clientes reais. Cada cor, cada corte, uma assinatura.</p>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
            {gallery.data?.slice(0, 8).map((g) => (
              <Link
                key={g.id}
                to="/galeria"
                className="group relative aspect-square overflow-hidden rounded-lg shadow-luxe bg-muted"
              >
                <img
                  src={g.image_url}
                  alt={g.title || "Transformação"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Button asChild variant="outline" className="tracking-[0.2em] text-xs font-semibold">
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
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.025em] lg:text-5xl">Mãos que assinam</h2>
            <p className="mt-5 text-foreground/70">Duas trajetórias, uma mesma busca pela excelência. Conheça as profissionais que tornam cada atendimento único.</p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-14">
            {pros.data?.slice(0, 2).map((p) => (
              <div key={p.id} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-editorial">
                  <img src={p.photo_url || ""} alt={p.name} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-6 text-background">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">{p.role_title}</div>
                    <div className="mt-1 font-display text-2xl font-semibold">{p.name}</div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {p.specialties?.slice(0, 2).map((sp) => (
                      <span key={sp} className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground/70 font-medium">{sp}</span>
                    ))}
                  </div>
                  <Link to="/agendar" search={{ pro: p.id }} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-gold-deep hover:text-foreground">
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
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.025em] lg:text-5xl">O que dizem nossas clientes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Marina", text: "Saio do estúdio renovada todas as vezes. O cuidado e a técnica fazem toda diferença no resultado." },
              { name: "Camila", text: "Encontrei finalmente o tom de loiro dos meus sonhos. Atendimento de altíssimo nível, recomendo sem dúvidas." },
              { name: "Beatriz", text: "Ambiente lindo, equipe maravilhosa e um trabalho impecável. Virei cliente fiel." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border bg-card p-7 transition-shadow hover:shadow-editorial">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-5 font-display text-lg leading-snug font-medium text-foreground/85">"{t.text}"</p>
                <div className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BAND — refined dark ============ */}
      <section className="relative overflow-hidden bg-ink py-24 text-background">
        <img src="/gallery/destaque-008.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/95 via-ink/85 to-ink" />

        <div className="relative mx-auto max-w-5xl px-5 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold-soft font-semibold">
                Pronta para começar?
              </div>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
                Sua próxima<br />experiência de beleza<br /><span className="text-gold-soft">começa aqui.</span>
              </h2>
              <p className="mt-6 max-w-lg text-background/65 leading-relaxed">
                Reserve seu horário em poucos cliques e viva o cuidado que o studio Elaine Hahn entrega há mais de uma década em Cachoeiro de Itapemirim.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Button asChild size="lg" className="h-12 w-full justify-center lg:w-[260px] bg-background text-ink hover:bg-background/90 tracking-[0.22em] text-[11px] font-semibold rounded-md">
                <Link to="/agendar">AGENDAR AGORA <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 w-full justify-center lg:w-[260px] border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background tracking-[0.22em] text-[11px] font-semibold rounded-md">
                <Link to="/contato"><MapPin className="mr-2 h-4 w-4" /> COMO CHEGAR</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
