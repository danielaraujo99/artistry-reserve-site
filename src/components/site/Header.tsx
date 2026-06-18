import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { BookingDialog } from "./BookingDialog";
import { cn } from "@/lib/utils";

const links = [
  { to: "#servicos", label: "Serviços" },
  { to: "#galeria", label: "Galeria" },
  { to: "#profissionais", label: "Profissionais" },
  { to: "#sobre", label: "Sobre" },
  { to: "#contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("fixed top-0 z-40 w-full transition-all",
        scrolled ? "glass-panel shadow-sm" : "bg-transparent")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center"><Logo className="h-12 w-auto" /></Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a key={l.to} href={l.to} className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button onClick={() => setBooking(true)} className="hidden bg-ink text-background hover:bg-ink/90 sm:inline-flex">
              AGENDAR
            </Button>
            <button onClick={() => setOpen(!open)} className="lg:hidden">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="glass-panel border-t lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="rounded px-2 py-2 text-sm hover:bg-accent">
                  {l.label}
                </a>
              ))}
              <Button onClick={() => { setBooking(true); setOpen(false); }} className="mt-2 bg-ink text-background">
                AGENDAR
              </Button>
            </div>
          </div>
        )}
      </header>
      <BookingDialog open={booking} onOpenChange={setBooking} />
    </>
  );
}
