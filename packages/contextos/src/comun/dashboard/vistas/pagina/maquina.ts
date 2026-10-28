import { Maquina } from "@olula/lib/diseño.ts";
import { publicar } from "@olula/lib/dominio.ts";
import { ContextoDashboard, EstadoDashboard } from "../../diseño.ts";
import {
  alternarCompartido,
  añadirComponente,
  aplicarConfiguracion,
  borrar,
  cambiarDisposicion,
  cambiarNombre,
  cancelarConfiguracion,
  cancelarEdicion,
  cargarDashboard,
  configurarComponente,
  empezarEdicion,
  guardarEdicion,
  quitarComponente,
} from "./pagina.ts";

/**
 * Página de un dashboard. Se ve (VIENDO) y su propietario lo edita (EDITANDO):
 * los cambios de disposición y de componentes van a un borrador que solo se guarda
 * al pulsar Guardar. CONFIGURANDO abre el formulario de un componente.
 */
export const getMaquina: () => Maquina<EstadoDashboard, ContextoDashboard> = () => ({
  CARGANDO: {
    id_cambiado: [cargarDashboard],
  },

  NO_ENCONTRADO: {
    id_cambiado: [cargarDashboard],
  },

  VIENDO: {
    id_cambiado: [cargarDashboard],
    edicion_iniciada: [empezarEdicion],
    compartido_alternado: [alternarCompartido],
    borrado_solicitado: "BORRANDO",
  },

  EDITANDO: {
    id_cambiado: [cargarDashboard],
    nombre_cambiado: [cambiarNombre],
    disposicion_cambiada: [cambiarDisposicion],
    componente_añadido: [añadirComponente],
    componente_configurado: [configurarComponente],
    componente_quitado: [quitarComponente],
    edicion_guardada: [guardarEdicion],
    edicion_cancelada: [cancelarEdicion],
  },

  CONFIGURANDO: {
    configuracion_aplicada: [aplicarConfiguracion],
    configuracion_cancelada: [cancelarConfiguracion],
  },

  BORRANDO: {
    borrado_confirmado: [borrar, publicar("dashboard_borrado", null)],
    borrado_cancelado: "VIENDO",
  },
});
