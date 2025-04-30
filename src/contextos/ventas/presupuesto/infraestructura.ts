import { RestAPI } from "../../comun/api/rest_api.ts";
import { CambiarArticuloLinea, CambiarCantidadLinea, DeleteLinea, GetPresupuesto, GetPresupuestos, LineaPresupuesto, PatchCambiarDivisa, PostLinea, PostPresupuesto, Presupuesto } from "./diseño.ts";

const baseUrl = `/ventas/presupuesto`;

type PresupuestoAPI = Presupuesto
type LineaPresupuestoAPI = LineaPresupuesto

export const presupuestoFromAPI = (p: PresupuestoAPI): Presupuesto => p;
export const lineaPresupuestoFromAPI = (l: LineaPresupuestoAPI): LineaPresupuesto => l;

export const getPresupuesto: GetPresupuesto = async (id) =>
  RestAPI.get<{ datos: Presupuesto }>(`${baseUrl}/${id}`).then((respuesta) => {
    return presupuestoFromAPI(respuesta.datos);
  });

export const getPresupuestos: GetPresupuestos = async (_, __) => {
  return RestAPI.get<{ datos: Presupuesto[] }>(`${baseUrl}`).then((respuesta) => {
    return respuesta.datos.map((d) => presupuestoFromAPI(d));
  });
}

export const postPresupuesto: PostPresupuesto = async (presupuesto): Promise<string> => {
  const payload = {
    cliente: {
      cliente_id: presupuesto.cliente_id,
      direccion_id: presupuesto.direccion_id
    },
    // fecha: presupuesto.fecha,
    empresa_id: presupuesto.empresa_id
  }
  return await RestAPI.post(baseUrl, payload).then((respuesta) => respuesta.id);
}

export const patchCambiarAgente = async (id: string, agenteId: string) => {
  await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { agente_id: agenteId } });
}

export const patchCambiarDivisa: PatchCambiarDivisa = async (id, divisaId) => {
  await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { divisa_id: divisaId } });
}

export const patchCambiarCliente = async (id: string, clienteId: string, dirClienteId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      cliente: {
        cliente_id: clienteId,
        direccion_id: dirClienteId
      }
    }
  });
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
  }).then((respuesta) => {
    return respuesta.id;
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload);
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload);
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/borrar`, {
    lineas: [lineaId]
  });
}

export const patchPresupuesto = async (id: string, presupuesto: Presupuesto) => {
  const payload = {
    cambios: {
      agente_id: presupuesto.agente_id,
      divisa: {
        divisa_id: presupuesto.divisa_id,
      },
      fecha: presupuesto.fecha,
      cliente_id: presupuesto.cliente_id,
      nombre_cliente: presupuesto.nombre_cliente,
      id_fiscal: presupuesto.id_fiscal,
      direccion_id: presupuesto.direccion_id,
    },
  };

  await RestAPI.patch(`${baseUrl}/${id}`, payload);
};

