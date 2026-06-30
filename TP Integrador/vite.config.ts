import { defineConfig } from "vite";

// En build (GitHub Pages) la app se sirve bajo el subpath del repo;
// en dev queda en "/" para no romper los AT de Playwright (que van a "/?word=...").
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/AgilesMalizani-Cosentino-Pastorino/" : "/",
}));
