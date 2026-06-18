import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { galleryQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

const PER_PAGE = 8;

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria · Studio Elaine Hahn" },
      { name: "description", content: "Galeria de transformações reais — loiros, coloração e finalizações assinadas pelo studio Elaine Hahn." },
      { property: "og:title", content: "Galeria · Studio Elaine Hahn" },
      { property: "og:description", content: "Transformações reais de clientes reais." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const gallery = useQuery(galleryQuery);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const items = gallery.data ?? [];
  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const pageItems = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setActiveIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, items.length]);

  function goPage(p: number) {
    setPage(p);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory to-background" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <div className="eyebrow">Galeria</div>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
              Transformações<br /><span className="text-gold-deep">assinadas</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/70">
              Cada cor, cada corte, uma assinatura. Conheça o trabalho que entregamos no studio.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {pageItems.map((g, i) => {
              const globalIdx = page * PER_PAGE + i;
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveIdx(globalIdx)}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted shadow-luxe"
                >
                  <img
                    src={g.image_url}
                    alt={g.title || "Transformação"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>

          {pageCount > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                onClick={() => goPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold disabled:pointer-events-none disabled:opacity-40"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }).map((_, p) => (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    aria-label={`Página ${p + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all",
                      p === page ? "w-7 bg-gold-deep" : "w-2.5 bg-border hover:bg-gold/60",
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => goPage(Math.min(pageCount - 1, page + 1))}
                disabled={page === pageCount - 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold disabled:pointer-events-none disabled:opacity-40"
                aria-label="Próxima página"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {activeIdx !== null && items[activeIdx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
          onClick={() => setActiveIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIdx(null); }}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background hover:bg-background/20"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => i === null ? null : (i - 1 + items.length) % items.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background/10 text-background hover:bg-background/20 sm:left-6"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIdx((i) => i === null ? null : (i + 1) % items.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-background/10 text-background hover:bg-background/20 sm:right-6"
            aria-label="Próxima"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <img
            src={items[activeIdx].image_url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-xl object-contain shadow-editorial"
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.22em] text-background/60">
            {activeIdx + 1} / {items.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
