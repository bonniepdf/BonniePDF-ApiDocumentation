import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import pagefind from 'astro-pagefind'
import { remarkMarkdownLinks } from './src/markdown-links.mjs'

export default defineConfig({
  site: 'https://www.bonniepdf.dev',
  redirects: { '/': '/typescript/' },
  // Runs Pagefind after `astro build`. In dev the index from the most recent
  // build is served, so build once before searching in `astro dev`.
  integrations: [pagefind()],
  markdown: {
    shikiConfig: { themes: { light: 'light-plus', dark: 'dark-plus' }, wrap: true },
    // The unified (remark) processor, because the link rewrite is a remark plugin.
    processor: unified({ remarkPlugins: [remarkMarkdownLinks] }),
  },
  server: { port: 2001 },
  vite: { server: { strictPort: true }, preview: { strictPort: true } },
})
