// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import { client } from './src/config/client.ts';

// https://astro.build/config
export default defineConfig({
  // From client.ts so a new client is still one file. The sitemap and
  // robots.txt both need an absolute origin.
  site: client.siteUrl,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
