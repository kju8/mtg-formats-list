import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import ScryfallJsonDownload from './src/integrations/scryfall-json-download';
import Icons from 'unplugin-icons/vite';
import remarkDeflist from 'remark-deflist';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import purgecss from 'astro-purgecss';
import compress from 'astro-compress';
import { icons } from '@iconify-json/mdi';
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';

const IconName = 'link-variant';
const LinkIcon = (function () {
  const iconData = getIconData(icons, IconName);
  if (!iconData) {
    throw new Error(`Icon "${IconName}" is missing`);
  }
  const renderData = iconToSVG(iconData, {
    height: 'auto'
  });
  const svg = iconToHTML(replaceIDs(renderData.body), renderData.attributes);
  return svg;
})();

// https://astro.build/config
export default defineConfig({
  site: 'https://kju8.github.io',
  base: '/mtg-formats-list',
  integrations: [
    ScryfallJsonDownload(),
    vue(),
    mdx(),
    tailwind({
      applyBaseStyles: false
    }),
    import.meta.env.MODE === 'production' ? purgecss() : null,
    import.meta.env.MODE === 'production' ? compress() : null
  ],
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
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          content: fromHtmlIsomorphic(LinkIcon, { fragment: true }).children,
          properties: {
            className: 'link-icon'
          }
        }
      ]
    ],
    extendDefaultPlugins: true
  }
});
