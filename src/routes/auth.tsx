import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Logo, Wordmark } from "@/components/site/Logo";
import { toast } from "sonner";
import { Lock, Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Área restrita · Estúdio Elaine Hahn" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    toast.success("Bem-vinda!");
    navigate({ to: "/admin" });
  }

  return (
    <div className="admin-theme grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Left — editorial image */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src="/gallery/destaque-006.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-ink/55 to-ink/85" />
        <div className="relative z-10 flex h-full flex-col justify-between p-14 text-background">
          <Link to="/" className="inline-flex items-center gap-3 w-fit group">
            <Logo variant="light" className="h-12 w-auto" />
            <Wordmark variant="light" />
          </Link>
          <div className="max-w-md">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Painel administrativo</div>
            <h2 className="mt-5 font-serif text-5xl leading-[1.05]">
              Gerencie seu<br />
              <span className="italic text-gold-soft">estúdio premium</span>
            </h2>
            <p className="mt-6 text-background/65 leading-relaxed">
              Agendamentos, clientes, galeria, financeiro e contas a pagar — tudo em um único lugar, com a sofisticação que o seu trabalho merece.
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-background/40">
            © Estúdio Elaine Hahn · Cachoeiro de Itapemirim
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center bg-background p-6 sm:p-10">
        <Link
          to="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
        </Link>

        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Logo className="h-12 w-auto" />
            <Wordmark />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-accent/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold-deep">
            <Lock className="h-3 w-3" /> Acesso restrito
          </div>
          <h1 className="mt-5 font-serif text-4xl text-foreground">Entrar no painel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use suas credenciais para acessar o painel administrativo do estúdio.
          </p>

          <form onSubmit={signIn} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="h-12"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12"
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-ink text-background hover:bg-ink/90 tracking-[0.2em] text-xs"
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> ENTRANDO…</> : "ENTRAR"}
            </Button>
          </form>

          <p className="mt-10 text-xs text-muted-foreground/80">
            Esta área é exclusiva para a equipe do estúdio. Se você é cliente,{" "}
            <Link to="/agendar" className="text-gold-deep underline-offset-2 hover:underline">agende seu horário</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
