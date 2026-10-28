import { RestAPI } from "@olula/lib/api/rest_api.ts";
import {
  ComponenteDashboard,
  ConsultaComponente,
  Dashboard,
  RecursoAgregable,
  RespuestaAgregado,
  ResumenDashboard,
} from "./diseño.ts";
import { queryConsulta } from "./dominio.ts";

const URL = "/comun/dashboard";

type ResumenDashboardApi = {
  id: string;
  nombre: string;
  clave: string | null;
  compartido: boolean;
  propietario: string;
  es_propio: boolean;
  actualizado_en: string;
};

type DashboardApi = ResumenDashboardApi & {
  componentes: ComponenteDashboard[];
  componentes_ocultos: number;
};

const resumenDesdeApi = (d: ResumenDashboardApi): ResumenDashboard => ({
  id: d.id,
  nombre: d.nombre,
  clave: d.clave,
  compartido: d.compartido,
  propietario: d.propietario,
  esPropio: d.es_propio,
  actualizadoEn: d.actualizado_en,
});

// Los componentes viajan igual que se guardan: el servidor no los traduce.
export const dashboardDesdeApi = (d: DashboardApi): Dashboard => ({
  ...resumenDesdeApi(d),
  componentes: d.componentes.map((c) => ({ ...c, opciones: c.opciones ?? {} })),
  componentesOcultos: d.componentes_ocultos,
});

export const getDashboards = async (): Promise<ResumenDashboard[]> => {
  const respuesta = await RestAPI.get<{ datos: ResumenDashboardApi[] }>(URL);
  return respuesta.datos.map(resumenDesdeApi);
};

export const getDashboard = async (id: string): Promise<Dashboard> => {
  const respuesta = await RestAPI.get<{ datos: DashboardApi }>(`${URL}/${id}`);
  return dashboardDesdeApi(respuesta.datos);
};

export type NuevoDashboard = {
  nombre: string;
  clave?: string | null;
  compartido?: boolean;
  componentes?: ComponenteDashboard[];
};

export const crearDashboard = async (nuevo: NuevoDashboard): Promise<string> => {
  const { id } = await RestAPI.post(URL, nuevo, "Error al crear el dashboard");
  return id;
};

export type CambiosDashboard = Partial<
  Pick<Dashboard, "nombre" | "compartido" | "componentes">
>;

export const cambiarDashboard = (id: string, cambios: CambiosDashboard) =>
  RestAPI.patch(`${URL}/${id}`, cambios, "Error al guardar el dashboard");

export const borrarDashboard = (id: string) =>
  RestAPI.delete(`${URL}/${id}`, "Error al borrar el dashboard");

export const getAgregado = (
  consulta: ConsultaComponente
): Promise<RespuestaAgregado> =>
  RestAPI.get<RespuestaAgregado>(
    `/comun/agregado/${consulta.recurso}${queryConsulta(consulta)}`
  );

// El registro no cambia mientras la app está abierta y ya viene filtrado por los
// permisos del usuario: una petición por sesión.
let recursos: Promise<RecursoAgregable[]> | null = null;

export const getRecursos = (): Promise<RecursoAgregable[]> => {
  recursos ??= RestAPI.get<RecursoAgregable[]>("/comun/agregado").catch(() => {
    recursos = null;
    return [];
  });
  return recursos;
};
