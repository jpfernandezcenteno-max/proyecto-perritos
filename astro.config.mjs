// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: swap for the real production domain once it's registered.
  site: 'https://wasitas.pe',

  integrations: [react()],

  image: {
    // TODO: swap/remove once real shelter photo hosting is decided.
    // picsum.photos redirects to fastly.picsum.photos for the actual asset.
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' }
    ]
  },

  vite: {
    plugins: [tailwindcss()]
  }
});