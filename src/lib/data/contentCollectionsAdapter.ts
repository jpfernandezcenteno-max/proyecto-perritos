import { getCollection, getEntry } from "astro:content";
import type { DataAdapter } from "./adapter";
import type { Dog, Shelter } from "../types";

function toShelter(entry: Awaited<ReturnType<typeof getCollection<"albergues">>>[number]): Shelter {
  return { slug: entry.id, descripcion: entry.body ?? "", ...entry.data };
}

function toDog(entry: Awaited<ReturnType<typeof getCollection<"perritos">>>[number]): Dog {
  return {
    slug: entry.id,
    descripcion: entry.body ?? "",
    ...entry.data,
  };
}

export const contentCollectionsAdapter: DataAdapter = {
  async getShelters() {
    const entries = await getCollection("albergues");
    return entries.map(toShelter);
  },

  async getShelterBySlug(slug) {
    const entry = await getEntry("albergues", slug);
    return entry ? toShelter(entry) : undefined;
  },

  async getDogsByShelter(shelterSlug) {
    const entries = await getCollection("perritos", (entry) => entry.data.albergueSlug === shelterSlug);
    return entries.map(toDog);
  },

  async getDog(shelterSlug, dogSlug) {
    const entry = await getEntry("perritos", dogSlug);
    if (!entry || entry.data.albergueSlug !== shelterSlug) return undefined;
    return toDog(entry);
  },
};
