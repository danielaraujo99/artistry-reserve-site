import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Award, Heart, Sparkles } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { professionalsQuery } from "@/lib/queries";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · Estúdio Elaine Hahn" },
      { name: "description", content: "Conheça a história do Estúdio Elaine Hahn e as profissionais Elaine e Verônica — formação internacional Pivot Point e L'Oréal." },
      { property: "og:title", content: "Sobre · Estúdio Elaine Hahn" },
      { property: "og:description", content: "Nossa história, nossos valores e quem está por trás de cada atendimento." },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { v: "10+", l: "Anos de mercado" },
  { v: "2K+", l: "Clientes atendidas" },
  { v: "5.0", l: "Avaliação média" },
];

const VALUES = [
  { icon: Heart, title: "Acolhimento", text: "Cada cliente é única, e seu tempo no estúdio é desenhado para isso — sem pressa, com escuta real." },
  { icon: Award, title: "Formação internacional", text: "Aperfeiçoamento contínuo com Pivot Point, L'Oréal Professionnel e SOFT Hair." },
  { icon: Sparkles, title: "Resultado editorial", text: "Loiros e cores autorais com técnica de alta performance e acabamento de revista." },
];

function AboutPage() {
  const pros = useQuery(professionalsQuery);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Story hero */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory via-background to-background" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="eyebrow">O Estúdio</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Um refúgio de<br />
              <span className="italic text-gold-deep">bem-estar</span><br />
              e sofisticação
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/70">
              Mais que um salão, um espaço pensado para você desacelerar e viver uma experiência personalizada de cuidado, beleza e autoestima. Nossa missão é unir conhecimento técnico de alto nível a um atendimento acolhedor e humano.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div className="font-serif text-4xl text-gold-deep">{s.v}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <img src="/gallery/destaque-001.jpg" alt="Trabalho do estúdio" loading="lazy" className="aspect-[3/4] rounded-2xl object-cover shadow-editorial" />
              <img src="/gallery/destaque-003.jpeg" alt="Trabalho do estúdio" loading="lazy" className="mt-10 aspect-[3/4] rounded-2xl object-cover shadow-editorial" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="eyebrow">No que acreditamos</div>
            <h2 className="mt-4 font-serif text-4xl lg:text-5xl">Cuidado com <span className="italic text-gold-deep">propósito</span></h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border bg-card p-8 shadow-luxe transition-shadow hover:shadow-editorial">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-ink">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-serif text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professionals zigzag */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow">Profissionais</div>
            <h2 className="mt-4 font-serif text-5xl lg:text-6xl">Mãos que <span className="italic text-gold-deep">assinam</span></h2>
            <p className="mt-5 text-foreground/70">Duas trajetórias, uma mesma busca pela excelência em cada atendimento.</p>
          </div>

          <div className="space-y-24 lg:space-y-32">
            {pros.data?.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`grid items-center gap-10 md:grid-cols-12 lg:gap-16 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
              >
                <div className="md:col-span-5">
                  <img
                    src={p.photo_url || ""}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/5] w-full rounded-2xl object-cover shadow-editorial"
                  />
                </div>
                <div className="md:col-span-7">
                  <div className="eyebrow">{p.role_title}</div>
                  <h3 className="mt-3 font-serif text-5xl leading-[1.02] lg:text-6xl">{p.name}</h3>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">{p.bio}</p>
                  {p.specialties && p.specialties.length > 0 && (
                    <div className="mt-7 flex flex-wrap gap-2">
                      {p.specialties.map((sp) => (
                        <span key={sp} className="rounded-full border border-foreground/15 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/70">
                          {sp}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button asChild className="mt-8 h-12 rounded-md bg-ink px-6 text-[11px] font-semibold tracking-[0.2em] text-background hover:bg-ink/90">
                    <Link to="/agendar" search={{ pro: p.id }}>
                      AGENDAR COM {p.name.split(" ")[0].toUpperCase()} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
