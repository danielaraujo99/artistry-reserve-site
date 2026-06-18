import { createFileRoute } from "@tanstack/react-router";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ZIP_NAME = "estudio-elaine-hahn-source.zip";

function getZipFile() {
  const candidates = [
    join(resolve(process.cwd()), "public", "lidia-source.zip"),
    join(resolve(process.cwd()), "lidia-source.zip"),
  ];

  for (const file of candidates) {
    if (existsSync(file) && statSync(file).isFile()) return readFileSync(file);
  }

  return null;
}

export const Route = createFileRoute("/api/public/baixar")({
  server: {
    handlers: {
      GET: async () => {
        const zip = getZipFile();

        if (!zip) {
          return new Response("Arquivo ZIP indisponível.", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        return new Response(zip, {
          status: 200,
          headers: {
            "content-type": "application/zip",
            "content-disposition": `attachment; filename="${ZIP_NAME}"`,
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});