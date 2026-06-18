// Editorial image mapping for services (presentation only).
// Services have no image column in the DB, so we map curated studio
// photos by category/sort order to keep the catalog visually rich.
const GALLERY = [
  "/gallery/destaque-001.jpg",
  "/gallery/destaque-002.jpeg",
  "/gallery/destaque-003.jpeg",
  "/gallery/destaque-004.jpeg",
  "/gallery/destaque-005.jpeg",
  "/gallery/destaque-006.jpeg",
  "/gallery/destaque-007.jpeg",
  "/gallery/destaque-008.jpeg",
  "/gallery/destaque-009.jpeg",
];

const CATEGORY_IMAGE: Record<string, string> = {
  "Loiros & Coloração": "/gallery/destaque-002.jpeg",
  Finalização: "/gallery/destaque-005.jpeg",
  Cortes: "/gallery/destaque-007.jpeg",
  Tratamentos: "/gallery/destaque-004.jpeg",
};

export function serviceImage(service: { category?: string | null; sort_order?: number | null; id: string }): string {
  if (service.category && CATEGORY_IMAGE[service.category]) return CATEGORY_IMAGE[service.category];
  const idx = (service.sort_order ?? 0) % GALLERY.length;
  return GALLERY[idx];
}
