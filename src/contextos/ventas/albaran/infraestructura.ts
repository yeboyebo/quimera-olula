import { RestAPI } from "../../comun/api/rest_api.ts";
import ApiUrls from "../../comun/api/urls.ts";
import { Filtro, Orden, Paginacion } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { GetLineasPedido } from "../pedido/diseño.ts";
import {
  Albaran,
  DeleteLinea,
  GetAlbaran,
  GetAlbaranes,
  LineaAlbaran,
  PatchArticuloLinea,
  PatchCantidadLinea,
  PatchLinea,
  PostAlbaran,
  PostLinea
} from "./diseño.ts";

const baseUrl = ApiUrls.VENTAS.ALBARAN;

type LineaAlbaranAPI = LineaAlbaran;
type AlbaranAPI = Albaran

export const albaranDesdeAPI = (p: AlbaranAPI): Albaran => p;

export const lineaAlbaranFromAPI = (l: LineaAlbaranAPI): LineaAlbaran => l;

export const getAlbaran: GetAlbaran = async (id) => {
  return RestAPI.get<{ datos: Albaran }>(`${baseUrl}/${id}`).then((respuesta) => {
    return albaranDesdeAPI(respuesta.datos);
  });
};

export const getAlbaranes: GetAlbaranes = async (
  filtro: Filtro,
  orden: Orden,
  paginacion?: Paginacion
) => {
  const q = criteriaQuery(filtro, orden, paginacion);

  const respuesta = await RestAPI.get<{ datos: Albaran[]; total: number }>(baseUrl + q);
  return { datos: respuesta.datos.map(albaranDesdeAPI), total: respuesta.total };
};


export const postAlbaran: PostAlbaran = async (albaran) => {
  const payload = {
    cliente: {
      cliente_id: albaran.cliente_id,
      direccion_id: albaran.direccion_id,
    },
    empresa_id: albaran.empresa_id,
  };
  return await RestAPI.post(baseUrl, payload, "Error al guardar albarán").then((respuesta) => respuesta.id);
};

export const getLineas: GetLineasPedido = async (id) =>
  await RestAPI.get<{ datos: LineaAlbaranAPI[] }>(
    `${baseUrl}/${id}/linea`).then((respuesta) => {
      const lineas = respuesta.datos.map((d) => lineaAlbaranFromAPI(d));
      return lineas
    });


export const postLinea: PostLinea = async (id, linea) => {
  return await RestAPI.post(`${baseUrl}/${id}/linea`, {
    lineas: [{
      articulo_id: linea.referencia,
      cantidad: linea.cantidad
    }]
  }, "Error al guardar").then((respuesta) => {
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${lineaId}`, payload, "Error al actualizar la línea del albarán");
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar la línea del albarán");
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
  await RestAPI.patch(`${baseUrl}/${id}/linea/${linea.id}`, payload, "Error al actualizar la línea del albarán");
}

export const deleteLinea: DeleteLinea = async (id: string, lineaId: string): Promise<void> => {
  await RestAPI.patch(`${baseUrl}/${id}/linea/borrar`, {
    lineas: [lineaId]
  }, "Error al borrar la línea del albarán");
}

export const patchAlbaran = async (id: string, albaran: Albaran) => {
  const payload = {
    cambios: {
      agente_id: albaran.agente_id,
      divisa: {
        divisa_id: albaran.divisa_id,
        tasa_conversion: albaran.tasa_conversion,
      },
      fecha: albaran.fecha,
      cliente_id: albaran.cliente_id,
      nombre_cliente: albaran.nombre_cliente,
      id_fiscal: albaran.id_fiscal,
      direccion_id: albaran.direccion_id,
      forma_pago_id: albaran.forma_pago_id,
      grupo_iva_negocio_id: albaran.grupo_iva_negocio_id,
      observaciones: albaran.observaciones,
    },
  };

  await RestAPI.patch(`${baseUrl}/${id}`, payload,
    'Error al guardar el albarán'
  );
};

export const patchCambiarCliente = async (id: string, cambio: Albaran) => {
  const payload = {
    cambios: {
      cliente_id: cambio.cliente_id,
      direccion_id: cambio.direccion_id,
    },
  };
  await RestAPI.patch(`${baseUrl}/${id}/cliente`, payload, "Error al cambiar cliente del albarán");
};

export const borrarAlbaran = async (id: string) => {
  await RestAPI.delete(`${baseUrl}/${id}`, "Error al borrar albarán");
}
