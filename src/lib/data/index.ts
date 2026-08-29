import { contentCollectionsAdapter } from "./contentCollectionsAdapter";
import type { DataAdapter } from "./adapter";

// TODO: swap to a CMS/DB-backed adapter here once "Pendiente de definir" is resolved.
export const dataAdapter: DataAdapter = contentCollectionsAdapter;

export type { DataAdapter } from "./adapter";
