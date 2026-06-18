import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "./Logo";


export function Footer() {
  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Logo variant="light" className="h-14 w-auto" />
            <p className="max-w-xs text-sm leading-relaxed text-background/60">
              Estúdio de beleza premium em Cachoeiro de Itapemirim. Cuidado autêntico, técnica internacional.
            </p>
            <a href="https://instagram.com/elainehahn_" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-gold-soft transition-colors">
              <Instagram className="h-4 w-4" /> @elainehahn_
            </a>
          </div>

          <div>
            <h4 className="eyebrow text-gold-soft">Navegação</h4>
            <ul className="mt-5 space-y-3 text-sm text-background/75">
              <li><Link to="/" className="hover:text-gold-soft">Início</Link></li>
              <li><Link to="/servicos" className="hover:text-gold-soft">Serviços</Link></li>
              <li><Link to="/galeria" className="hover:text-gold-soft">Galeria</Link></li>
              <li><Link to="/sobre" className="hover:text-gold-soft">Sobre o estúdio</Link></li>
              <li><Link to="/contato" className="hover:text-gold-soft">Contato</Link></li>
              <li><Link to="/agendar" className="hover:text-gold-soft">Agendar horário</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold-soft">Contato</h4>
            <ul className="mt-5 space-y-3 text-sm text-background/75">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <a href="https://wa.me/5528999753008" target="_blank" rel="noreferrer" className="block hover:text-gold-soft">Elaine · (28) 99975-3008</a>
                  <a href="https://wa.me/5528999306087" target="_blank" rel="noreferrer" className="block hover:text-gold-soft">Verônica · (28) 99930-6087</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="min-w-0">
                  <a href="mailto:elaine-hahn@hotmail.com" className="block break-all hover:text-gold-soft">elaine-hahn@hotmail.com</a>
                  <a href="mailto:Veronicapereiradeoliveira2@gmail.com" className="block break-all hover:text-gold-soft">veronicapereiradeoliveira2@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Cachoeiro de Itapemirim — ES</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold-soft">Horários</h4>
            <ul className="mt-5 space-y-3 text-sm text-background/75">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-gold shrink-0" />
                <div>
                  <div>Terça a Sexta · 9h – 19h</div>
                  <div>Sábado · 9h – 17h</div>
                  <div className="text-background/45">Dom/Seg · fechado</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-background/45 md:flex-row md:px-8">
          <span>© {new Date().getFullYear()} Estúdio Elaine Hahn · Todos os direitos reservados</span>
          <Link to="/auth" className="hover:text-gold-soft">Área restrita</Link>
        </div>
      </div>
    </footer>
  );
}
