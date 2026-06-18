import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/queries";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços · Estúdio Elaine Hahn" },
      { name: "description", content: "Catálogo completo de serviços do Estúdio Elaine Hahn: loiros, coloração, mechas, cortes, tratamentos e finalização." },
      { property: "og:title", content: "Serviços · Estúdio Elaine Hahn" },
      { property: "og:description", content: "Loiros, coloração, mechas e tratamentos premium." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const services = useQuery(servicesQuery);
  type S = NonNullable<typeof services.data>[number];
  const grouped = (services.data ?? []).reduce<Record<string, S[]>>((acc, s) => {
    const key = s.category ?? "Outros";
    (acc[key] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory to-background" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow">Catálogo</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Serviços do<br /><span className="italic text-gold-deep">estúdio</span>
            </h1>
            <p className="mt-7 text-foreground/70 text-lg max-w-xl">
              Cada serviço é pensado para entregar resultado editorial com cuidado autêntico. Escolha sua experiência abaixo.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 space-y-20">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
                <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{cat}</h2>
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{items.length} serviços</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="group rounded-2xl border bg-card p-6 transition-all hover:border-gold hover:shadow-editorial sm:p-8"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
                      <div className="min-w-0">
                        <h3 className="font-serif text-2xl leading-tight sm:text-3xl">{s.name}</h3>
                        {s.description && <p className="mt-3 text-sm text-foreground/65 leading-relaxed">{s.description}</p>}
                        <div className="mt-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.duration_min}min</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-serif text-3xl text-gold-deep sm:text-4xl">R$ {Number(s.price).toFixed(0)}</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">a partir de</div>
                      </div>
                    </div>
                    <Button asChild variant="ghost" className="mt-6 -ml-3 text-gold-deep hover:text-foreground hover:bg-transparent">
                      <Link to="/agendar" search={{ service: s.id }}>Agendar este serviço <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
