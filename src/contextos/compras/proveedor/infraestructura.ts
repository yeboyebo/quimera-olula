import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { GetProveedor, PatchProveedor, PostProveedor, Proveedor } from "./diseño.ts";


const baseUrlCompras = `/compras/proveedor`;

type ProveedorApi = Proveedor;

const proveedorFromAPI = (c: ProveedorApi): Proveedor => ({
  ...c,
});


export const getProveedor: GetProveedor = async (id) =>
  await RestAPI.get<{ datos: Proveedor }>(`${baseUrlCompras}/${id}`).then((respuesta) => proveedorFromAPI(respuesta.datos));

export const getProveedores = async (filtro: Filtro, orden: Orden): Promise<Proveedor[]> => {
  const q = criteriaQuery(filtro, orden);

  return RestAPI.get<{ datos: ProveedorApi[] }>(baseUrlCompras + q).then((respuesta) => respuesta.datos.map(proveedorFromAPI));
}

export const patchProveedor: PatchProveedor = async (id, proveedor) =>
  await RestAPI.patch(`${baseUrlCompras}/${id}`, {
    cambios: {
      nombre: proveedor.nombre,
    },
  });

export const deleteProveedor = async (id: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlCompras}/${id}`);

export const postProveedor: PostProveedor = async (proveedor) => {
  return await RestAPI.post(baseUrlCompras, proveedor).then((respuesta) => respuesta.id);
}
