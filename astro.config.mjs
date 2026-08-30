// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // TODO: swap for the real production domain once it's registered.
  site: 'https://wasitas.pe',

  // Server rendering is required so login/registro/cuenta can read the
  // Supabase session cookie on every request.
  output: 'server',
  adapter: vercel(),

  integrations: [react()],

  image: {
    // TODO: swap/remove once real shelter photo hosting is decided.
    // placedog.net / cataas.com stand in for real pet photos in mock content.
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'placedog.net' },
      { protocol: 'https', hostname: 'cataas.com' }
    ]
  },

  vite: {
    plugins: [tailwindcss()]
  }
});