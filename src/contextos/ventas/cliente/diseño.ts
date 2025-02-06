import { Entidad } from "../../comun/diseño.ts";

export type Cliente = Entidad & {
  id: string;
  nombre: string;
  id_fiscal: string;
};

export type ClienteConDirecciones = Cliente & {
  direcciones: DireccionCliente[];
};

export type DireccionCliente = Entidad & {
  id: string;
  direccion: {
    nombre_via: string;
    tipo_via: string;
    numero: string;
    otros: string;
    cod_postal: string;
    ciudad: string;
    provincia_id: string;
    provincia: string;
    pais_id: string;
    apartado: string;
    telefono: string;
  };
  dir_envio: boolean;
  dir_facturacion: boolean;
};
