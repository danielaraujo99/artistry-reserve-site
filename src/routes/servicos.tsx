import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BookingDialog } from "@/components/site/BookingDialog";
import { servicesQuery } from "@/lib/queries";
import { serviceImage } from "@/lib/service-images";

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
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  function book(id: string) {
    setSelected(id);
    setOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden pt-32 pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory to-background" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="eyebrow">Nossos serviços</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Escolha sua<br /><span className="italic text-gold-deep">experiência</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-foreground/70">
              Selecione o serviço desejado e agende no melhor horário para você — direto por aqui, em poucos cliques.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.data?.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => book(s.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card text-left shadow-luxe transition-all hover:-translate-y-1 hover:border-gold hover:shadow-editorial"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={serviceImage(s)}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
                    <Clock className="h-3.5 w-3.5 text-gold-deep" /> {s.duration_min} min
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{s.category}</div>
                  <h3 className="mt-2 font-serif text-2xl leading-tight">{s.name}</h3>
                  {s.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/65">{s.description}</p>
                  )}

                  <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-5">
                    <div>
                      <div className="font-serif text-3xl text-gold-deep">R$ {Number(s.price).toFixed(0)}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">a partir de</div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-colors group-hover:bg-gold-deep">
                      Agendar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <BookingDialog serviceId={selected} open={open} onOpenChange={setOpen} />

      <Footer />
    </div>
  );
}
