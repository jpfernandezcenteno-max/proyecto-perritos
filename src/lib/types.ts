export type ShelterTag = "Urgente" | "Comida" | "Veterinaria" | "Adopcion";
export type HealthStatus = "Esterilizado" | "Vacunado" | "En proceso";
export type DogSize = "Pequeño" | "Mediano" | "Grande";

export interface Shelter {
  slug: string;
  nombre: string;
  verificado: boolean;
  distrito: string;
  direccion: string;
  lat: number;
  lng: number;
  descripcion: string;
  fotos: string[];
  qrImage: string;
  yapeNombre: string;
  ruc: string;
  metaActual: {
    montoRecaudado: number;
    montoMeta: number;
    descripcionCampania: string;
    numAportantes: number;
  };
  tags: ShelterTag[];
  totalPerritos: number;
  anioVerificacion?: number;
  contacto: {
    whatsapp?: string;
    telefono?: string;
    redes?: string;
  };
}

export interface Dog {
  slug: string;
  albergueSlug: string;
  nombre: string;
  edad: string;
  tamano: DogSize;
  raza?: string;
  temperamento?: string;
  descripcion: string;
  fotos: string[];
  estadoSalud: HealthStatus;
  disponible: boolean;
  adoptado: boolean;
}
