import { createFileRoute } from "@tanstack/react-router";

const ZIP_NAME = "estudio-elaine-hahn-source.zip";

function zipHeaders() {
  return {
    "content-type": "application/zip",
    "content-disposition": `attachment; filename="${ZIP_NAME}"`,
    "cache-control": "public, max-age=300",
  };
}

async function getZipFromStaticAsset(request: Request) {
  const assetUrl = new URL("/lidia-source.zip", request.url);
  const response = await fetch(assetUrl, { redirect: "follow" });
  if (!response.ok || !response.body) return null;
  return new Response(response.body, { status: 200, headers: zipHeaders() });
}

async function getZipFromFilesystem() {
  try {
    const [{ existsSync, readFileSync, statSync }, { join, resolve }] = await Promise.all([
      import("node:fs"),
      import("node:path"),
    ]);
    const root = resolve(process.cwd());
    const candidates = [
      join(root, "public", "lidia-source.zip"),
      join(root, ".vercel", "output", "static", "lidia-source.zip"),
      join(root, "lidia-source.zip"),
    ];

    for (const file of candidates) {
      if (existsSync(file) && statSync(file).isFile()) {
        return new Response(readFileSync(file), { status: 200, headers: zipHeaders() });
      }
    }
  } catch {}

  return null;
}

export const Route = createFileRoute("/api/public/baixar")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const zip = (await getZipFromStaticAsset(request)) ?? (await getZipFromFilesystem());

        if (!zip) {
          return new Response("Arquivo ZIP indisponível.", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        return zip;
      },
    },
  },
});