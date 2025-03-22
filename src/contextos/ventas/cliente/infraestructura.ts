import { CampoFormularioGenerico, OpcionCampo } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { crearAcciones } from "../../comun/infraestructura.ts";
import { Cliente, Direccion, NuevaDireccion } from "./diseño.ts";

const baseUrl = `/ventas/cliente`;

export type DireccionAPI = {
  // id: string;
  nombre_via: string;
  tipo_via: string;
  numero: string;
  otros: string;
  cod_postal: string;
  ciudad: string;
  provincia_id: number;
  provincia: string;
  pais_id: string;
  apartado: string;
  telefono: string;
};

export type DireccionClienteAPI = {
  id: string;
  direccion: DireccionAPI;
  dir_envio: boolean;
  dir_facturacion: boolean;
};


type ClienteApi = Cliente;

export const getClientes = async (filtro: Filtro, orden: Orden): Promise<Cliente[]> =>
  RestAPI.get<{ datos: ClienteApi[] }>(`${baseUrl}`).then((respuesta) => {
    const clientes = respuesta.datos.map((d) => clienteApiACliente(d));
    return clientes
  });

export const clienteApiACliente = (c: ClienteApi): Cliente => c;

export const getPorId = async (id: string): Promise<Cliente> =>
  RestAPI.get<{ datos: Cliente }>(`${baseUrl}/${id}`).then((respuesta) => respuesta.datos);

export const getDireccion = async (clienteId: string, direccionId: string): Promise<Direccion> =>
  RestAPI.get<{ datos: DireccionClienteAPI }>(`${baseUrl}/${clienteId}/direcciones/${direccionId}`).then((respuesta) =>
    direccionClienteApiADireccion(respuesta.datos)
  );

export const getDirecciones = async (id: string): Promise<Direccion[]> =>
  RestAPI.get<{ datos: DireccionClienteAPI[] }>(`${baseUrl}/${id}/direcciones`).then((respuesta) => {
    const direcciones = respuesta.datos.map((d) => direccionClienteApiADireccion(d));
    return direcciones
  });

const direccionClienteApiADireccion = (d: DireccionClienteAPI): Direccion => (
  {
    id: d.id,
    dir_facturacion: d.dir_facturacion,
    dir_envio: d.dir_envio,
    ...d.direccion,
  }
)

const direccionADireccionApi = (d: Direccion): DireccionAPI => (
  {
    nombre_via: d.nombre_via,
    tipo_via: d.tipo_via,
    numero: d.numero,
    otros: d.otros,
    cod_postal: d.cod_postal,
    ciudad: d.ciudad,
    provincia_id: d.provincia_id,
    provincia: d.provincia,
    pais_id: d.pais_id,
    apartado: d.apartado,
    telefono: d.telefono,
  }
)


export const setDirFacturacion = async (clienteId: string, direccionId: string): Promise<void> =>
  RestAPI.patch(`${baseUrl}/${clienteId}/direcciones/${direccionId}/facturacion`, {});


export const actualizarDireccion = async (clienteId: string, direccion: Direccion): Promise<void> =>
  // console.log('actualizarDireccion direccion = ', direccion);
  RestAPI.patch(
    `${baseUrl}/${clienteId}/direcciones/${direccion.id}`
    , { direccion: direccionADireccionApi(direccion) }
  );

export const postDireccion = async (clienteId: string, direccion: NuevaDireccion): Promise<string> => {
  const payload = {
    direccion: {
      ...direccion,
    }
  }
  return RestAPI.post(`${baseUrl}/${clienteId}/direcciones`, payload).then((respuesta) => respuesta.id);
}
export const deleteDireccion = async (clienteId: string, direccionId: string): Promise<void> =>
  RestAPI.delete(`${baseUrl}/${clienteId}/direcciones/${direccionId}`);


export const accionesCliente = crearAcciones("cliente");

export const obtenerOpcionesSelector =
  (path: string) => async () =>
    RestAPI.get<{ datos: [] }>(
      `/cache/comun/${path}`
    ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));

const opcionesDivisa = await obtenerOpcionesSelector("divisa")();

// export const camposDireccion2: CampoFormularioGenerico[] = [
//   { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
//   { nombre: "nombre_via", etiqueta: "Nombre de la Vía", tipo: "text", xtipo: "no controlado" },
//   { nombre: "tipo_via", etiqueta: "Tipo de Vía", tipo: "text" },
//   { nombre: "numero", etiqueta: "Número", tipo: "text" },
//   { nombre: "otros", etiqueta: "Otros", tipo: "text" },
//   { nombre: "cod_postal", etiqueta: "Código Postal", tipo: "text" },
//   { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text" },
//   { nombre: "provincia_id", etiqueta: "ID de Provincia", tipo: "number" },
//   { nombre: "provincia", etiqueta: "Provincia", tipo: "text" },
//   { nombre: "pais_id", etiqueta: "ID de País", tipo: "text" },
//   { nombre: "apartado", etiqueta: "Apartado", tipo: "text" },
//   { nombre: "telefono", etiqueta: "Teléfono", tipo: "text" },
// ];

export const camposDireccion: Record<string, CampoFormularioGenerico> = {
  id: { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  nombre_via: { nombre: "nombre_via", etiqueta: "Nombre de la Vía", tipo: "text", xtipo: "no controlado" },
  tipo_via: { nombre: "tipo_via", etiqueta: "Tipo de Vía", tipo: "text" },
  numero: { nombre: "numero", etiqueta: "Número", tipo: "text" },
  otros: { nombre: "otros", etiqueta: "Otros", tipo: "text" },
  cod_postal: { nombre: "cod_postal", etiqueta: "Código Postal", tipo: "text" },
  ciudad: { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text" },
  provincia_id: { nombre: "provincia_id", etiqueta: "ID de Provincia", tipo: "number" },
  provincia: { nombre: "provincia", etiqueta: "Provincia", tipo: "text" },
  pais_id: { nombre: "pais_id", etiqueta: "ID de País", tipo: "text" },
  apartado: { nombre: "apartado", etiqueta: "Apartado", tipo: "text" },
  telefono: { nombre: "telefono", etiqueta: "Teléfono", tipo: "text" },
}


export const camposCliente2: CampoFormularioGenerico[] = [
  {
    nombre: "id",
    etiqueta: "Código",
    tipo: "text",
    oculto: true,
  },
  { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%", xtipo: "no controlado", },
  { nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text", xtipo: "controlado", },
  { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
  {
    nombre: "divisa_id",
    etiqueta: "Divisa",
    tipo: "select",
    opciones: opcionesDivisa,
  },
  { nombre: "tipo_id_fiscal", etiqueta: "Tipo ID Fiscal", tipo: "text", xtipo: "controlado" },
  { nombre: "serie_id", etiqueta: "Serie", tipo: "text", soloLectura: true },
  { nombre: "forma_pago_id", etiqueta: "Forma de Pago", tipo: "text" },
  {
    nombre: "grupo_iva_negocio_id",
    etiqueta: "Grupo IVA Negocio",
    tipo: "text",
  },
  { nombre: "eventos", etiqueta: "Eventos", tipo: "text", oculto: true },
  { nombre: "espacio", etiqueta: "", tipo: "space" },
];

export const camposCliente: Record<string, CampoFormularioGenerico> = {
  id: { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
  nombre: { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%", xtipo: "no controlado", },
  id_fiscal: { nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text", xtipo: "controlado", },
  agente_id: { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
  divisa_id: {
    nombre: "divisa_id",
    etiqueta: "Divisa",
    tipo: "select",
    opciones: opcionesDivisa,
  },
  tipo_id_fiscal: { nombre: "tipo_id_fiscal", etiqueta: "Tipo ID Fiscal", tipo: "text", xtipo: "controlado" },
  serie_id: { nombre: "serie_id", etiqueta: "Serie", tipo: "text", soloLectura: true },
  forma_pago_id: { nombre: "forma_pago_id", etiqueta: "Forma de Pago", tipo: "text" },
  grupo_iva_negocio_id: { nombre: "grupo_iva_negocio_id", etiqueta: "Grupo IVA Negocio", tipo: "text" },
  eventos: { nombre: "eventos", etiqueta: "Eventos", tipo: "text", oculto: true },
  espacio: { nombre: "espacio", etiqueta: "", tipo: "space" },
}

export const camposClienteNuevo: CampoFormularioGenerico[] = [
  { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%", requerido: true },
  { nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text", requerido: true },
  { nombre: "empresa_id", etiqueta: "Empresa", tipo: "text", requerido: true },
  { nombre: "tipo_id_fiscal", etiqueta: "Tipo id fiscal", tipo: "text", requerido: true },
  { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
];