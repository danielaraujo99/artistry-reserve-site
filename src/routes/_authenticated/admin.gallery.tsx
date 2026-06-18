import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, UploadCloud, Loader2, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function GalleryAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const gallery = useQuery({
    queryKey: ["gallery-admin"],
    queryFn: async () => (await supabase.from("gallery_items").select("*").order("sort_order")).data ?? [],
  });

  function pick(f: File | null) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Selecione um arquivo de imagem.");
    if (f.size > 10 * 1024 * 1024) return toast.error("A imagem deve ter no máximo 10MB.");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function reset() {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function save() {
    if (!file) return toast.error("Selecione uma imagem.");
    setSaving(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("gallery").upload(path, file, { upsert: false, contentType: file.type });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("gallery").createSignedUrl(path, TEN_YEARS);
      if (signed.error || !signed.data) throw signed.error || new Error("URL não gerada");
      const next = (gallery.data?.length || 0) + 1;
      const { error } = await supabase.from("gallery_items").insert({ image_url: signed.data.signedUrl, sort_order: next });
      if (error) throw error;
      toast.success("Imagem adicionada à galeria");
      reset();
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["gallery-admin"] });
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (e: any) {
      toast.error(e.message || "Falha ao enviar a imagem");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover esta imagem?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["gallery-admin"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
    toast.success("Imagem removida");
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Galeria</h1>
          <p className="text-sm text-muted-foreground">Gerencie as imagens exibidas no site.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-admin-accent text-white hover:opacity-90">
          <Plus className="mr-1 h-4 w-4" /> Adicionar
        </Button>
      </div>

      {gallery.data && gallery.data.length === 0 && (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <p className="text-sm">Nenhuma imagem ainda. Clique em “Adicionar” para enviar a primeira.</p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {gallery.data?.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-lg border">
            <img src={g.image_url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
            <button onClick={() => remove(g.id)}
              className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
        <DialogContent className="admin-theme sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Adicionar imagem</DialogTitle>
            <DialogDescription>
              Envie uma foto direto do seu dispositivo. Use imagens nítidas, na horizontal ou no formato quadrado,
              com até 10MB. Formatos aceitos: JPG, PNG ou WEBP.
            </DialogDescription>
          </DialogHeader>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />

          {preview ? (
            <div className="relative overflow-hidden rounded-xl border">
              <img src={preview} alt="Pré-visualização" className="max-h-72 w-full object-contain bg-muted" />
              <Button variant="secondary" size="sm" className="absolute bottom-3 right-3" onClick={() => inputRef.current?.click()}>
                Trocar imagem
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 py-12 text-center text-muted-foreground transition-colors hover:border-admin-accent hover:text-foreground"
            >
              <UploadCloud className="h-8 w-8" />
              <span className="text-sm font-medium">Clique para escolher uma imagem</span>
              <span className="text-xs">do seu computador ou celular</span>
            </button>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => { setOpen(false); reset(); }} disabled={saving}>Cancelar</Button>
            <Button onClick={save} disabled={!file || saving} className="bg-admin-accent text-white hover:opacity-90">
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…</> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
