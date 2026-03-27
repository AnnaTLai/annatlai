import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import lit from "@astrojs/lit";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://annatlai.github.io/annatlai', // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  sitemap: true, // Generate sitemap (set to "false" to disable)
  base:"/annatlai/",
  integrations: [sitemap(), mdx(), lit(), icon(), react()], // Add renderers to the config
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    routing: {
      prefixDefaultLocale: false,
      strategy: "pathname"
    }
  }
});