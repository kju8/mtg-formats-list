import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';

import tailwind from '@astrojs/tailwind';

import ScryfallJsonDownload from './src/integrations/scryfall-json-download';

import Icons from 'unplugin-icons/vite';

import remarkDeflist from 'remark-deflist';

// https://astro.build/config
export default defineConfig({
  site: 'https://kju8.github.io',
  base: '/mtg-formats-list',

  integrations: [ScryfallJsonDownload(), vue(), mdx(), tailwind({ applyBaseStyles: false })],

  vite: {
    plugins: [
      Icons({
        autoInstall: true,
        compiler: 'astro'
      })
    ]
  },

  markdown: {
    // Applied to .md and .mdx files
    remarkPlugins: [remarkDeflist],
    extendDefaultPlugins: true
  }
});
