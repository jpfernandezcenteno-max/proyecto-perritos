import type { Dog, Shelter } from "../types";

/**
 * Data access boundary. Pages/components must import `dataAdapter` from
 * `./index`, never a concrete implementation, so the source (Content
 * Collections today; a CMS/DB later — TODO: decide per "Pendiente de definir")
 * can be swapped without touching UI code.
 */
export interface DataAdapter {
  getShelters(): Promise<Shelter[]>;
  getShelterBySlug(slug: string): Promise<Shelter | undefined>;
  getDogsByShelter(shelterSlug: string): Promise<Dog[]>;
  getDog(shelterSlug: string, dogSlug: string): Promise<Dog | undefined>;
}
