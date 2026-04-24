import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://exrs.co.uk',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
