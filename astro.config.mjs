import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://annatlai.github.io/annatlai', // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  sitemap: true, // Generate sitemap (set to "false" to disable)
  base:"annatlai",
  integrations: [sitemap(), mdx(), lit(), icon()], // Add renderers to the config
});