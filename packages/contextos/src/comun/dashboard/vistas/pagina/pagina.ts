import { ProcesarContexto } from "@olula/lib/diseño.ts";
import {
  ComponenteDashboard,
  ContextoDashboard,
  Dashboard,
  EstadoDashboard,
  TipoComponente,
} from "../../diseño.ts";
import { nuevoComponente, sustituirComponente } from "../../dominio.ts";
import { borrarDashboard, cambiarDashboard, getDashboard } from "../../infraestructura.ts";

type ProcesarPagina = ProcesarContexto<EstadoDashboard, ContextoDashboard>;

export const contextoDashboardInicial: ContextoDashboard = {
  estado: "CARGANDO",
  dashboard: null,
  nombre: "",
  borrador: [],
  configurando: null,
};

const conDashboard = (ctx: ContextoDashboard, dashboard: Dashboard): ContextoDashboard => ({
  ...ctx,
  dashboard,
  nombre: dashboard.nombre,
  borrador: dashboard.componentes,
  configurando: null,
});

export const cargarDashboard: ProcesarPagina = async (ctx, payload) => {
  const { id, editar } = payload as { id: string; editar?: boolean };
  try {
    const dashboard = await getDashboard(id);
    return {
      ...conDashboard(ctx, dashboard),
      estado: editar && dashboard.esPropio ? "EDITANDO" : "VIENDO",
    };
  } catch {
    return { ...contextoDashboardInicial, estado: "NO_ENCONTRADO" };
  }
};

export const empezarEdicion: ProcesarPagina = async (ctx) =>
  ctx.dashboard ? { ...conDashboard(ctx, ctx.dashboard), estado: "EDITANDO" } : ctx;

export const cancelarEdicion: ProcesarPagina = async (ctx) =>
  ctx.dashboard ? { ...conDashboard(ctx, ctx.dashboard), estado: "VIENDO" } : ctx;

export const cambiarNombre: ProcesarPagina = async (ctx, payload) => ({
  ...ctx,
  nombre: payload as string,
});

export const cambiarDisposicion: ProcesarPagina = async (ctx, payload) => ({
  ...ctx,
  borrador: payload as ComponenteDashboard[],
});

export const añadirComponente: ProcesarPagina = async (ctx, payload) => ({
  ...ctx,
  estado: "CONFIGURANDO",
  configurando: nuevoComponente(payload as TipoComponente, ctx.borrador),
});

export const configurarComponente: ProcesarPagina = async (ctx, payload) => ({
  ...ctx,
  estado: "CONFIGURANDO",
  configurando: ctx.borrador.find((c) => c.id === payload) ?? null,
});

export const aplicarConfiguracion: ProcesarPagina = async (ctx, payload) => ({
  ...ctx,
  estado: "EDITANDO",
  borrador: sustituirComponente(ctx.borrador, payload as ComponenteDashboard),
  configurando: null,
});

export const cancelarConfiguracion: ProcesarPagina = async (ctx) => ({
  ...ctx,
  estado: "EDITANDO",
  configurando: null,
});

export const quitarComponente: ProcesarPagina = async (ctx, payload) => ({
  ...ctx,
  borrador: ctx.borrador.filter((c) => c.id !== payload),
});

/** Guarda nombre y componentes y recarga (el servidor devuelve también los ocultos). */
export const guardarEdicion: ProcesarPagina = async (ctx) => {
  if (!ctx.dashboard) return ctx;
  await cambiarDashboard(ctx.dashboard.id, {
    nombre: ctx.nombre.trim() || ctx.dashboard.nombre,
    componentes: ctx.borrador,
  });
  return { ...conDashboard(ctx, await getDashboard(ctx.dashboard.id)), estado: "VIENDO" };
};

export const alternarCompartido: ProcesarPagina = async (ctx) => {
  if (!ctx.dashboard) return ctx;
  const compartido = !ctx.dashboard.compartido;
  await cambiarDashboard(ctx.dashboard.id, { compartido });
  return { ...ctx, dashboard: { ...ctx.dashboard, compartido } };
};

export const borrar: ProcesarPagina = async (ctx) => {
  if (ctx.dashboard) await borrarDashboard(ctx.dashboard.id);
  return ctx;
};
