import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ArrowLeft, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/baixar")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Baixar código fonte · Estúdio Elaine Hahn" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);
    try {
      const res = await fetch("/lidia-source.zip", { credentials: "omit" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estudio-elaine-hahn-source.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e: any) {
      toast.error("Falha ao baixar. Tente novamente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-10 shadow-editorial">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar
        </Link>

        <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-ink">
          <Package className="h-5 w-5" />
        </div>
        <h1 className="mt-5 font-serif text-4xl leading-[1.05]">Código fonte</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Baixe o pacote completo do projeto em formato ZIP — inclui todas as imagens, componentes e configurações. O download começa imediatamente, sem autenticação.
        </p>

        <Button
          onClick={download}
          disabled={loading}
          className="mt-8 h-12 w-full bg-ink text-background hover:bg-ink/90 tracking-[0.2em] text-xs"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> PREPARANDO…</>
          ) : (
            <><Download className="mr-2 h-4 w-4" /> BAIXAR ZIP</>
          )}
        </Button>

        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Arquivo: estudio-elaine-hahn-source.zip
        </p>
      </div>
    </div>
  );
}
