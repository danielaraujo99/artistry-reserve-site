import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BookingFlow } from "@/components/site/BookingFlow";

export const Route = createFileRoute("/agendar")({
  validateSearch: (s: Record<string, unknown>) => ({
    service: typeof s.service === "string" ? s.service : undefined,
    pro: typeof s.pro === "string" ? s.pro : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Agendar horário · Estúdio Elaine Hahn" },
      { name: "description", content: "Reserve seu horário no Estúdio Elaine Hahn — loiros, coloração, mechas e tratamentos capilares premium em Cachoeiro de Itapemirim." },
      { property: "og:title", content: "Agendar horário · Estúdio Elaine Hahn" },
      { property: "og:description", content: "Escolha serviço, profissional e horário em poucos passos." },
    ],
  }),
  component: AgendarPage,
});

function AgendarPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl mb-14">
            <div className="eyebrow">Agendamento online</div>
            <h1 className="mt-4 font-serif text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
              Reserve seu<br /><span className="italic text-gold-deep">momento</span>
            </h1>
            <p className="mt-6 text-foreground/70 text-lg max-w-xl">
              Em cinco passos simples, escolha o serviço, a profissional, a data e o horário ideal para a sua experiência no estúdio.
            </p>
          </div>
          <BookingFlow />
        </div>
      </section>
      <Footer />
    </div>
  );
}
