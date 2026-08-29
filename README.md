# Wasitas

Plataforma de aportes (vía Yape) y adopción para albergues de perritos en Perú.
"Un yapeo cambia el día de un perrito."

Astro (SSR, adaptador de Vercel) + React islands + Tailwind CSS v4, Content
Collections como fuente de datos inicial detrás de un adapter intercambiable.
Cuentas de usuario (registro/login/logout) vía Supabase Auth.

## Comandos

| Comando           | Acción                                        |
| ------------------ | ---------------------------------------------- |
| `npm install`       | Instala dependencias                           |
| `npm run dev`       | Servidor local en `localhost:4321`             |
| `npm run build`     | Build de producción a `./dist/`                |
| `npm run preview`   | Previsualiza el build                          |

Copia `.env.example` a `.env` y completa `PUBLIC_SUPABASE_URL` /
`PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API en tu proyecto de
Supabase) para que `/login`, `/registro` y `/cuenta` funcionen.

## Estructura

```
src/
├── content/               # Contenido de ejemplo (albergues, perritos)
├── content.config.ts       # Esquemas de las Content Collections
├── lib/
│   ├── data/                # DataAdapter — swap-eable (hoy: Content Collections)
│   ├── types.ts
│   └── format.ts
├── components/              # Componentes Astro estáticos + islands/ (React)
├── layouts/Layout.astro
└── pages/                   # Rutas — ver flujo crítico abajo
```

Flujo crítico implementado:
`/` → `/buscar` → `/albergues/[slug]` → `/albergues/[slug]/qr` (o `qr-pantalla-completa`)
→ `/albergues/[slug]/registrar-donacion` → `/gracias`

Panel de gestión (stub visual, sin backend aún): `/panel/login`,
`/panel/albergue/editar`, `/panel/perritos`, `/panel/perritos/nuevo`.

## Pendiente de definir

Buscar `TODO` en el código para cada punto; los principales:

- **Paleta y tipografía finales** — hoy son placeholders en `src/styles/global.css` (`@theme`), referenciados por nombre semántico (`bg-accent-urgent`, `rounded-card`, etc.), nunca hex directo en componentes.
- **Proveedor de mapa** — `src/components/islands/MapView.tsx` es un stub con pines mockeados; mismo contrato (`pins`, `zoneLabel`) para cuando se integre Mapbox GL o Leaflet.
- **Persistencia real** — Content Collections es solo lectura en build time. El panel de albergues y el registro de donaciones necesitan un backend/DB antes de ir a producción; el `DataAdapter` (`src/lib/data/adapter.ts`) ya aísla ese cambio del resto de la UI. El historial de yapeos en `/cuenta` sigue siendo mock (ver TODO ahí) aunque la cuenta del usuario ya es real (Supabase).
- **Autenticación** — cuentas de donantes (`/login`, `/registro`, `/cuenta`) ya usan Supabase Auth real vía `src/middleware.ts` + `src/actions/index.ts`. `/panel/*` (login de albergues) sigue siendo un stub sin sesión real.
- **Tema oscuro** — el toggle en `/cuenta` funciona, pero `:root[data-theme="dark"]` en `global.css` es una paleta provisional.

## Notas de implementación

- Mínimo JS: casi todo es Astro estático; solo hidratan como islands React el buscador con filtros (`SearchAndFilter`), los tabs del perfil de albergue, y los botones que necesitan estado del navegador (compartir, brillo, favoritos, toggles).
- Imágenes de ejemplo servidas desde `picsum.photos` vía `<Image />` de Astro (lazy-loading + webp automático) — reemplazar por el storage real de fotos.
