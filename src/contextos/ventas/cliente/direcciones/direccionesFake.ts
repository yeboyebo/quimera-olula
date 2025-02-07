import type { DireccionCliente } from "../diseño.ts";

type DireccionesFake = {
  codigo_cliente: string;
  direcciones: DireccionCliente[];
};

export const direccionesFake: DireccionesFake[] = [
  {
    codigo_cliente: "000001",
    direcciones: [
      {
        id: "0001",
        dir_envio: true,
        dir_facturacion: false,
        direccion: {
          nombre_via: "Plaza Mayor",
          tipo_via: "Plaza",
          numero: "1",
          otros: "",
          cod_postal: "37001",
          ciudad: "Salamanca",
          provincia_id: "37",
          provincia: "Salamanca",
          pais_id: "ES",
          apartado: "",
          telefono: "923456789",
        },
      },
    ],
  },
  {
    codigo_cliente: "000002",
    direcciones: [
      {
        id: "0002",
        dir_envio: true,
        dir_facturacion: false,
        direccion: {
          nombre_via: "Calle Principal",
          tipo_via: "Calle",
          numero: "123",
          otros: "Piso 2",
          cod_postal: "28001",
          ciudad: "Madrid",
          provincia_id: "28",
          provincia: "Madrid",
          pais_id: "ES",
          apartado: "",
          telefono: "912345678",
        },
      },
      {
        id: "0003",
        dir_envio: true,
        dir_facturacion: false,
        direccion: {
          nombre_via: "Avenida Libertad",
          tipo_via: "Avenida",
          numero: "45",
          otros: "Bloque 3, Puerta 4",
          cod_postal: "08015",
          ciudad: "Barcelona",
          provincia_id: "08",
          provincia: "Barcelona",
          pais_id: "ES",
          apartado: "Apartado 123",
          telefono: "934567890",
        },
      },
    ],
  },
];
