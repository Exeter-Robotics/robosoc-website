import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://exeter-robotics.github.io',
  base: '/robosoc-website',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
