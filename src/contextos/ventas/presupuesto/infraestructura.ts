import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden, Paginacion } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { CambiarArticuloLinea, CambiarCantidadLinea, DeleteLinea, GetPresupuesto, GetPresupuestos, LineaPresupuesto, PatchCambiarDivisa, PatchLinea, PostLinea, PostPresupuesto, Presupuesto } from "./diseño.ts";

const baseUrl = `/ventas/presupuesto`;

type PresupuestoAPI = Presupuesto
type LineaPresupuestoAPI = LineaPresupuesto

export const presupuestoFromAPI = (p: PresupuestoAPI): Presupuesto => p;
export const lineaPresupuestoFromAPI = (l: LineaPresupuestoAPI): LineaPresupuesto => l;

export const getPresupuesto: GetPresupuesto = async (id) =>
  RestAPI.get<{ datos: Presupuesto }>(`${baseUrl}/${id}`).then((respuesta) => {
    return presupuestoFromAPI(respuesta.datos);
  });

export const getPresupuestos: GetPresupuestos = async (
  filtro: Filtro,
  orden: Orden,
  paginacion?: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: Presupuesto[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(presupuestoFromAPI), total: respuesta.total };
};

export const postPresupuesto: PostPresupuesto = async (presupuesto): Promise<string> => {
  const payload = {
    cliente: {
      cliente_id: presupuesto.cliente_id,
      direccion_id: presupuesto.direccion_id
    },
    // fecha: presupuesto.fecha,
    empresa_id: presupuesto.empresa_id
  }
  return await RestAPI.post(baseUrl, payload, "Error al crear presupuesto").then((respuesta) => respuesta.id);
}

export const borrarPresupuesto = async (id: string): Promise<void> => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar presupuesto");
}

export const patchCambiarAgente = async (id: string, agenteId: string) => {
  await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { agente_id: agenteId } }, "Error al cambiar agente del presupuesto");
}

export const patchCambiarDivisa: PatchCambiarDivisa = async (id, divisaId) => {
  await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { divisa_id: divisaId } }, "Error al cambiar divisa del presupuesto");
}

export const patchCambiarCliente = async (id: string, clienteId: string, dirClienteId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      cliente: {
        cliente_id: clienteId,
        direccion_id: dirClienteId
      }
    }
  }, "Error al cambiar cliente del presupuesto");
}

export const getLineas = async (id: string): Promise<LineaPresupuesto[]> =>
  await RestAPI.get<{ datos: LineaPresupuestoAPI[] }>(`${baseUrl}/${id}/linea`).then((respuesta) => {
    const lineas = respuesta.datos.map((d) => lineaPresupuestoFromAPI(d));
    return lineas
  });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }, "Error al crear línea de presupuesto").then((respuesta) => {
    const miRespuesta = respuesta as unknown as { ids: string[] };
    return miRespuesta.ids[0];
  });
}

export const patchArticuloLinea: CambiarArticuloLinea = async (id, lineaId, referencia) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: referencia
      },
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload, "Error al actualizar artículo de la línea del presupuesto");
}

export const patchLinea: PatchLinea = async (id, linea) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: linea.referencia
      },
      cantidad: linea.cantidad,
      pvp_unitario: linea.pvp_unitario,
      dto_porcentual: linea.dto_porcentual,
      grupo_iva_producto_id: linea.grupo_iva_producto_id,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar línea del presupuesto");
}


export const patchCantidadLinea: CambiarCantidadLinea = async (id, linea, cantidad) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: linea.referencia
      },
      cantidad: cantidad,
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar cantidad de la línea del presupuesto");
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  }, "Error al borrar línea del presupuesto");
}

export const patchPresupuesto = async (id: string, presupuesto: Presupuesto) => {
  const payload = {
    cambios: {
      agente_id: presupuesto.agente_id,
      divisa: {
        divisa_id: presupuesto.divisa_id,
        tasa_conversion: presupuesto.tasa_conversion,
      },
      fecha: presupuesto.fecha,
      cliente_id: presupuesto.cliente_id,
      nombre_cliente: presupuesto.nombre_cliente,
      id_fiscal: presupuesto.id_fiscal,
      direccion_id: presupuesto.direccion_id,
      forma_pago_id: presupuesto.forma_pago_id,
      grupo_iva_negocio_id: presupuesto.grupo_iva_negocio_id,
      observaciones: presupuesto.observaciones,
    },
  };

  await RestAPI.patch(`${baseUrl}/${id}`, payload, "Error al actualizar presupuesto");
};


export const aprobarPresupuesto = async (id: string) => {
  await RestAPI.patch(`${baseUrl}/${id}/aprobar`, {}, "Error al aprobar presupuesto");
};
