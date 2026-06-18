import { Instagram, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { whatsappContactLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer id="contato" className="border-t bg-ink text-background/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="rounded-md bg-background p-4 inline-block">
            <Logo className="h-16 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-background/60">
            Estúdio de beleza premium. Excelência e sofisticação em cada detalhe.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-2xl text-gold-soft">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" />
              <a href={whatsappContactLink()} target="_blank" rel="noreferrer" className="hover:text-gold">(28) 99975-3008</a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-gold" />
              <a href="https://instagram.com/elainehahn_" target="_blank" rel="noreferrer" className="hover:text-gold">@elainehahn_</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              <span>Cachoeiro de Itapemirim — ES</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-2xl text-gold-soft">Horário</h4>
          <ul className="mt-4 space-y-2 text-sm text-background/70">
            <li>Terça a Sexta · 9h às 19h</li>
            <li>Sábado · 9h às 17h</li>
            <li>Domingo e Segunda · Fechado</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-background/50 md:flex-row">
          <span>© {new Date().getFullYear()} Estúdio Elaine Hahn. Todos os direitos reservados.</span>
          <a href="/auth" className="hover:text-gold">Área Restrita</a>
        </div>
      </div>
    </footer>
  );
}
