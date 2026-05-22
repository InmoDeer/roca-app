import type {
  PropertyTipo,
  PropertyOperacion,
  PropertyEstado,
  PropertyMoneda,
  PropertyAntiguedad,
  PropertyMascotas,
  PropertyZona,
  PropertyPerfilIdeal,
  PropertyVista,
} from "@/lib/constants";

export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  nombre: string;
  tipo: PropertyTipo;
  operacion: PropertyOperacion;
  estado: PropertyEstado;
  distrito: string;
  direccion: string | null;
  maps_url: string | null;
  cerca_a: string | null;
  limita_con: string | null;
  zona: string | null;
  perfil_ideal: string | null;
  precio: number;
  moneda: PropertyMoneda;
  mantenimiento: number | null;
  dormitorios: number | null;
  ambientes: number | null;
  banos: number | null;
  area_m2: number | null;
  piso: number | null;
  antiguedad: string | null;
  cochera: boolean;
  ascensor: boolean;
  amoblado: boolean;
  area_servicio: boolean;
  mascotas: PropertyMascotas;
  gas_natural: boolean;
  lavanderia: boolean;
  balcon: boolean;
  ventanas_amplias: boolean;
  closet: boolean;
  cocina_equipada: boolean;
  recepcion: boolean;
  vista: PropertyVista | null;
  areas_comunes: boolean;
  piscina: boolean;
  terraza: boolean;
  jardin: boolean;
  sum: boolean;
  parrilla: boolean;
  juegos_ninos: boolean;
  gimnasio: boolean;
  tendal: boolean;
  destacados_manuales: string[];
  fotos_urls: string[];
  video_url: string | null;
  tour360_url: string | null;
}

export interface PropertyFilters {
  q: string;
  operacion: string;
  tipo: string;
  estado: string;
}
