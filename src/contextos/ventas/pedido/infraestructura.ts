import { RestAPI } from "../../comun/api/rest_api.ts";
import { DeleteLinea, GetLineasPedido, GetPedido, GetPedidos, LineaPedido, PatchArticuloLinea, PatchCantidadLinea, PatchClientePedido, PatchLinea, Pedido, PostLinea, PostPedido } from "./diseño.ts";

const baseUrl = `/ventas/pedido`;

type LineaPedidoAPI = LineaPedido

import { appFactory } from "../../app.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";

export const pedidoDesdeAPI = appFactory().Ventas.pedidoDesdeAPI;

export const lineaPedidoFromAPI = (l: LineaPedidoAPI): LineaPedido => l;

export const getPedido: GetPedido = async (id) => {
  return RestAPI.get<{ datos: Pedido }>(
    `${baseUrl}/${id}`).then((respuesta) => {
      return pedidoDesdeAPI(respuesta.datos);
    });
}

// export const getPedidos: GetPedidos = async (_, __) => {
//   return RestAPI.get<{ datos: Pedido[] }>(
//     `${baseUrl}`).then((respuesta) => {
//       return respuesta.datos.map((d) => pedidoDesdeAPI(d));
//     });
// }

export const getPedidos: GetPedidos = async (filtro: Filtro, orden: Orden) => {
  const q = criteriaQuery(filtro, orden);
  return RestAPI.get<{ datos: Pedido[] }>(
    baseUrl + q).then((respuesta) => {
      return respuesta.datos.map((d) => pedidoDesdeAPI(d));
    });
}

export const postPedido: PostPedido = async (pedido) => {
  const payload = {
    cliente: {
      cliente_id: pedido.cliente_id,
      direccion_id: pedido.direccion_id
    },
    empresa_id: pedido.empresa_id
  }
  return await RestAPI.post(baseUrl, payload).then((respuesta) => respuesta.id);
}


export const patchCambiarCliente: PatchClientePedido = async (id, cambio) => {
  await RestAPI.patch(`${baseUrl}/${id}`, {
    cambios: {
      cliente: {
        cliente_id: cambio.cliente_id,
        direccion_id: cambio.direccion_id
      }
    }
  });
}

export const getLineas: GetLineasPedido = async (id) =>
  await RestAPI.get<{ datos: LineaPedidoAPI[] }>(
    `${baseUrl}/${id}/linea`).then((respuesta) => {
      const lineas = respuesta.datos.map((d) => lineaPedidoFromAPI(d));
      return lineas
    });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }).then((respuesta) => {
    const miRespuesta = respuesta as unknown as { ids: string[] };
    return miRespuesta.ids[0];
  });
}

export const patchArticuloLinea: PatchArticuloLinea = async (id, lineaId, referencia) => {
  const payload = {
    cambios: {
      articulo: {
        articulo_id: referencia
      },
    },
  }
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload);
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload);
}

export const patchCantidadLinea: PatchCantidadLinea = async (id, linea, cantidad) => {
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  });
}

export const patchPedido = async (id: string, pedido: Pedido) => {
  // throw new Error("No implementado");
  const payload = appFactory().Ventas.api_payloadPatchPedido(pedido);
  // const payload = {
  //   cambios: {
  //     agente_id: pedido.agente_id,
  //     divisa: {
  //       divisa_id: pedido.divisa_id,
  //       tasa_conversion: pedido.tasa_conversion,
  //     },
  //     fecha: pedido.fecha,
  //     cliente_id: pedido.cliente_id,
  //     nombre_cliente: pedido.nombre_cliente,
  //     id_fiscal: pedido.id_fiscal,
  //     direccion_id: pedido.direccion_id,
  //     forma_pago_id: pedido.forma_pago_id,
  //     grupo_iva_negocio_id: pedido.grupo_iva_negocio_id,
  //     observaciones: pedido.observaciones,
  //   },
  // };

  await RestAPI.patch(`${baseUrl}/${id}`, payload,
    'Error al guardar el pedido'
  );
};


export const payloadPatchPedido = (pedido: Pedido) => {
  const payload = {
    cambios: {
      agente_id: pedido.agente_id,
      divisa: {
        divisa_id: pedido.divisa_id,
        tasa_conversion: pedido.tasa_conversion,
      },
      fecha: pedido.fecha,
      cliente_id: pedido.cliente_id,
      nombre_cliente: pedido.nombre_cliente,
      id_fiscal: pedido.id_fiscal,
      direccion_id: pedido.direccion_id,
      forma_pago_id: pedido.forma_pago_id,
      grupo_iva_negocio_id: pedido.grupo_iva_negocio_id,
      observaciones: pedido.observaciones,
    },
  };

  return payload;
}

export const borrarPedido = async (id: string) => {
  await RestAPI.delete(`${baseUrl}/${id}`);
}
