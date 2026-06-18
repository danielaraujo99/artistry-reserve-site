import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const qc = useQueryClient();
  const [url, setUrl] = useState("");
  const gallery = useQuery({
    queryKey: ["gallery-admin"],
    queryFn: async () => (await supabase.from("gallery_items").select("*").order("sort_order")).data ?? [],
  });

  async function add() {
    if (!url) return;
    const next = (gallery.data?.length || 0) + 1;
    const { error } = await supabase.from("gallery_items").insert({ image_url: url, sort_order: next });
    if (error) return toast.error(error.message);
    toast.success("Imagem adicionada");
    setUrl("");
    qc.invalidateQueries({ queryKey: ["gallery-admin"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }
  async function remove(id: string) {
    if (!confirm("Remover esta imagem?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["gallery-admin"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-4xl">Galeria</h1>
      <p className="text-sm text-muted-foreground">Gerencie as imagens exibidas no site.</p>

      <Card className="mt-6 p-5">
        <div className="flex gap-2">
          <Input placeholder="URL da imagem (https://...)" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Button onClick={add} className="bg-ink text-background"><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Dica: faça upload via Connectors/Storage ou cole uma URL pública.</p>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {gallery.data?.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-md">
            <img src={g.image_url} alt="" className="aspect-square w-full object-cover" />
            <button onClick={() => remove(g.id)}
              className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
