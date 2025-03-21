import { CampoFormularioGenerico, OpcionCampo } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { crearAcciones } from "../../comun/infraestructura.ts";
import { Cliente, Direccion } from "./diseño.ts";

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


export const getPorId = async (id: string): Promise<Cliente> =>
  RestAPI.get<{ datos: Cliente }>(`${baseUrl}/${id}`).then((respuesta) => respuesta.datos);

export const getDirecciones = async (id: string): Promise<Direccion[]> =>
  RestAPI.get<{ datos: DireccionClienteAPI[] }>(`${baseUrl}/${id}/direcciones`).then((respuesta) => {
    const direcciones = respuesta.datos.map((d) => (
      {
        id: d.id,
        dir_facturacion: d.dir_facturacion,
        dir_envio: d.dir_envio,
        ...d.direccion,
      }));
    return direcciones
  });

export const setDirFacturacion = async (clienteId: string, direccionId: string): Promise<void> =>
  RestAPI.patch(`${baseUrl}/${clienteId}/direcciones/${direccionId}/facturacion`, {});
// /ventas/cliente/<cliente_id>/direcciones/<direccion_id>/facturacion
export const accionesCliente = crearAcciones("cliente");

export const obtenerOpcionesSelector =
  (path: string) => async () =>
    RestAPI.get<{ datos: [] }>(
      `/cache/comun/${path}`
    ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));

const opcionesDivisa = await obtenerOpcionesSelector("divisa")();

export const camposDireccion: CampoFormularioGenerico[] = [
  { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  { nombre: "nombre_via", etiqueta: "Nombre de la Vía", tipo: "text" },
  { nombre: "tipo_via", etiqueta: "Tipo de Vía", tipo: "text" },
  { nombre: "numero", etiqueta: "Número", tipo: "text" },
  { nombre: "otros", etiqueta: "Otros", tipo: "text" },
  { nombre: "cod_postal", etiqueta: "Código Postal", tipo: "text" },
  { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text" },
  { nombre: "provincia_id", etiqueta: "ID de Provincia", tipo: "number" },
  { nombre: "provincia", etiqueta: "Provincia", tipo: "text" },
  { nombre: "pais_id", etiqueta: "ID de País", tipo: "text" },
  { nombre: "apartado", etiqueta: "Apartado", tipo: "text" },
  { nombre: "telefono", etiqueta: "Teléfono", tipo: "text" },
];


export const camposCliente: CampoFormularioGenerico[] = [
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

export const camposClienteNuevo: CampoFormularioGenerico[] = [
  { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%", requerido: true },
  { nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text", requerido: true },
  { nombre: "empresa_id", etiqueta: "Empresa", tipo: "text", requerido: true },
  { nombre: "tipo_id_fiscal", etiqueta: "Tipo id fiscal", tipo: "text", requerido: true },
  { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
];