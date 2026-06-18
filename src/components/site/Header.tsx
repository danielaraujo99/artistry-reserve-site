import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, Wordmark } from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/galeria", label: "Galeria" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header({ variant = "auto" }: { variant?: "auto" | "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // For the home page hero (dark bg), header starts transparent over dark and becomes light glass on scroll
  const onDark = variant === "dark" || (variant === "auto" && pathname === "/" && !scrolled);
  const headerCls = scrolled
    ? "glass-panel"
    : onDark
      ? "bg-transparent"
      : "glass-panel";

  const textCls = onDark && !scrolled ? "text-background" : "text-foreground";
  const mutedTextCls = onDark && !scrolled ? "text-background/65 hover:text-background" : "text-foreground/65 hover:text-foreground";
  const borderCls = onDark && !scrolled ? "border-background/20 text-background" : "border-foreground/15 text-foreground";

  return (
    <>
      <header className={cn("fixed top-0 z-40 w-full transition-all duration-300", headerCls)}>
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 md:px-8 md:py-4 lg:grid-cols-[auto_1fr_auto]">
          <Link to="/" className="flex min-w-0 items-center">
            <Logo variant={onDark && !scrolled ? "light" : "default"} className="h-11 w-auto shrink-0 md:h-12" />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-9">
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative text-[12px] uppercase tracking-[0.22em] font-medium transition-colors",
                    active ? textCls : mutedTextCls,
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <Button
              asChild
              className={cn(
                "hidden sm:inline-flex tracking-[0.2em] text-[11px] font-semibold h-10 px-5 rounded-md",
                onDark && !scrolled
                  ? "bg-background text-ink hover:bg-background/90"
                  : "bg-ink text-background hover:bg-ink/85",
              )}
            >
              <Link to="/agendar">AGENDAR</Link>
            </Button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className={cn("lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border", borderCls)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0 bg-ink/55" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-full max-w-sm bg-background shadow-editorial transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b px-6 py-4">
            <Wordmark />
            <button onClick={() => setOpen(false)} className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-border/60 py-4 font-display text-xl font-medium text-foreground transition-colors hover:text-gold-deep"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-8 h-12 bg-ink text-background tracking-[0.2em] text-xs font-semibold">
              <Link to="/agendar">AGENDAR HORÁRIO</Link>
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
}
