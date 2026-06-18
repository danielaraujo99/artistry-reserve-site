// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import AdmZip from "adm-zip";

function buildSourceZip() {
  const root = resolve(process.cwd());
  const outDir = join(root, "public");
  const outFile = join(outDir, "lidia-source.zip");
  const IGNORE = new Set([
    "node_modules", ".git", "dist", ".output", ".nitro", ".vinxi", ".cache",
    ".turbo", "build", ".lovable", ".vercel", ".wrangler",
  ]);
  const IGNORE_FILES = new Set(["lidia-source.zip", ".DS_Store", ".env"]);

  const zip = new AdmZip();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (name.startsWith(".env.")) continue;
      if (IGNORE.has(name) || IGNORE_FILES.has(name)) continue;
      const full = join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (st.isFile() && st.size < 50 * 1024 * 1024) {
        try {
          zip.addFile(relative(root, full).replace(/\\/g, "/"), readFileSync(full));
        } catch {}
      }
    }
  };
  try {
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    walk(root);
    zip.writeZip(outFile);
  } catch (e) {
    console.warn("[source-zip] failed:", e);
  }
}

function sourceZipPlugin() {
  return {
    name: "lidia-source-zip",
    apply: () => true,
    configResolved() { buildSourceZip(); },
    buildStart() { buildSourceZip(); },
  } as const;
}

const vercelNitroConfig = {
  preset: "vercel",
  vercel: {
    functions: {
      runtime: "nodejs22.x",
    },
  },
} as unknown as { preset: string };

export default defineConfig({
  // Vercel precisa do Build Output API com função SSR; sem isso o deploy sobe
  // como estático incompleto e a raiz/rotas diretas retornam 404 NOT_FOUND.
  nitro: vercelNitroConfig,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [sourceZipPlugin()],
  },
});
