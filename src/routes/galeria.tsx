import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { galleryQuery } from "@/lib/queries";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria · Estúdio Elaine Hahn" },
      { name: "description", content: "Galeria de transformações reais — loiros, coloração e finalizações assinadas pelo Estúdio Elaine Hahn." },
      { property: "og:title", content: "Galeria · Estúdio Elaine Hahn" },
      { property: "og:description", content: "Transformações reais de clientes reais." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const gallery = useQuery(galleryQuery);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory to-background" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <div className="eyebrow">Galeria</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Transformações<br /><span className="italic text-gold-deep">assinadas</span>
            </h1>
            <p className="mt-7 text-foreground/70 text-lg">
              Cada cor, cada corte, uma assinatura. Conheça o trabalho que entregamos no estúdio.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 [column-fill:_balance]">
            {gallery.data?.map((g) => (
              <button
                key={g.id}
                onClick={() => setActive(g.image_url)}
                className="group mb-3 block w-full overflow-hidden rounded-xl bg-muted md:mb-4"
              >
                <img
                  src={g.image_url}
                  alt={g.title || "Transformação"}
                  loading="lazy"
                  className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <button
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background hover:bg-background/20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={active} alt="" className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-editorial" />
        </div>
      )}

      <Footer />
    </div>
  );
}
