import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const albergues = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/albergues" }),
  schema: z.object({
    nombre: z.string(),
    verificado: z.boolean().default(false),
    distrito: z.string(),
    direccion: z.string(),
    lat: z.number(),
    lng: z.number(),
    fotos: z.array(z.string()),
    qrImage: z.string(),
    yapeNombre: z.string(),
    ruc: z.string(),
    metaActual: z.object({
      montoRecaudado: z.number(),
      montoMeta: z.number(),
      descripcionCampania: z.string(),
      numAportantes: z.number(),
    }),
    tags: z.array(z.enum(["Urgente", "Comida", "Veterinaria", "Adopcion"])),
    totalPerritos: z.number(),
    anioVerificacion: z.number().optional(),
    contacto: z.object({
      whatsapp: z.string().optional(),
      telefono: z.string().optional(),
      redes: z.string().optional(),
    }),
  }),
});

const perritos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/perritos" }),
  schema: z.object({
    albergueSlug: z.string(),
    nombre: z.string(),
    edad: z.string(),
    tamano: z.enum(["Pequeño", "Mediano", "Grande"]),
    raza: z.string().optional(),
    temperamento: z.string().optional(),
    fotos: z.array(z.string()),
    estadoSalud: z.enum(["Esterilizado", "Vacunado", "En proceso"]),
    disponible: z.boolean().default(true),
    adoptado: z.boolean().default(false),
  }),
});

export const collections = { albergues, perritos };
