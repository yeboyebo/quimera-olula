import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Cliente, CrmContacto, CuentaBanco, DirCliente, GetCliente, NuevaCuentaBanco, NuevaDireccion, NuevoCrmContacto, PatchCliente, PostCliente } from "./diseño.ts";


const baseUrlVentas = `/ventas/cliente`;
const baseUrlCrm = `/crm`;

type ClienteApi = Cliente;

const clienteFromAPI = (c: ClienteApi): Cliente => ({
  ...c,
});

export type DireccionAPI = {
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

export type DirClienteAPI = {
  id: string;
  direccion: DireccionAPI;
  dir_envio: boolean;
  dir_facturacion: boolean;
};

const dirClienteFromAPI = (d: DirClienteAPI): DirCliente => (
  {
    id: d.id,
    dir_facturacion: d.dir_facturacion,
    dir_envio: d.dir_envio,
    ...d.direccion,
  }
)

const dirClienteToAPI = (d: DirCliente): DireccionAPI => (
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

export const getCliente: GetCliente = async (id) =>
  await RestAPI.get<{ datos: Cliente }>(`${baseUrlVentas}/${id}`).then((respuesta) => clienteFromAPI(respuesta.datos));

export const getClientes = async (filtro: Filtro, orden: Orden): Promise<Cliente[]> => {
  const q = criteriaQuery(filtro, orden);

  return RestAPI.get<{ datos: ClienteApi[] }>(baseUrlVentas + q).then((respuesta) => respuesta.datos.map(clienteFromAPI));
}

export const patchCliente: PatchCliente = async (id, cliente) =>
  await RestAPI.patch(`${baseUrlVentas}/${id}`, {
    cambios: {
      nombre: cliente.nombre,
      id_fiscal: {
        id: cliente.id_fiscal,
        tipo: cliente.tipo_id_fiscal,
      },
      agente_id: cliente.agente_id,
      divisa_id: cliente.divisa_id,
      serie_id: cliente.serie_id,
      forma_pago_id: cliente.forma_pago_id,
      grupo_iva_negocio_id: cliente.grupo_iva_negocio_id,
      nombre_comercial: cliente.nombre_comercial,
      web: cliente.web,
      telefono1: cliente.telefono1,
      telefono2: cliente.telefono2,
      email: cliente.email,
      observaciones: cliente.observaciones,
      copiasfactura: cliente.copiasfactura,
      grupo_id: cliente.grupo_id,
    },
  });

export const darDeBajaCliente = async (id: string, fecha: string) =>
  await RestAPI.patch(`${baseUrlVentas}/${id}`, {
    cambios: {
      de_baja: true,
      fecha_baja: fecha,
    },
  });

export const darDeAltaCliente = async (id: string) =>
  await RestAPI.patch(`${baseUrlVentas}/${id}`, {
    cambios: {
      de_baja: false,
      fecha_baja: null,
    },
  });

export const deleteCliente = async (id: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlVentas}/${id}`);

export const postCliente: PostCliente = async (cliente) => {
  return await RestAPI.post(baseUrlVentas, cliente).then((respuesta) => respuesta.id);
}

export const getDireccion = async (clienteId: string, direccionId: string): Promise<DirCliente> =>
  await RestAPI.get<{ datos: DirClienteAPI }>(`${baseUrlVentas}/${clienteId}/direccion/${direccionId}`).then((respuesta) =>
    dirClienteFromAPI(respuesta.datos)
  );

export const getDirecciones = async (id: string): Promise<DirCliente[]> =>
  await RestAPI.get<{ datos: DirClienteAPI[] }>(`${baseUrlVentas}/${id}/direccion`).then((respuesta) => {
    const direcciones = respuesta.datos.map((d) => dirClienteFromAPI(d));
    return direcciones
  });

export const postDireccion = async (clienteId: string, direccion: NuevaDireccion): Promise<string> => {
  const payload = {
    direccion: {
      ...direccion,
    }
  }
  return await RestAPI.post(`${baseUrlVentas}/${clienteId}/direccion`, payload).then((respuesta) => respuesta.id);
}

export const setDirFacturacion = async (clienteId: string, direccionId: string): Promise<void> =>
  RestAPI.patch(`${baseUrlVentas}/${clienteId}/direccion/${direccionId}/facturacion`, {});


export const actualizarDireccion = async (clienteId: string, direccion: DirCliente): Promise<void> =>
  RestAPI.patch(
    `${baseUrlVentas}/${clienteId}/direccion/${direccion.id}`
    , { direccion: dirClienteToAPI(direccion) }
  );

export const deleteDireccion = async (clienteId: string, direccionId: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlVentas}/${clienteId}/direccion/${direccionId}`);


export const getCuentasBanco = async (clienteId: string): Promise<CuentaBanco[]> =>
  await RestAPI.get<{ datos: CuentaBancoAPI[] }>(`${baseUrlVentas}/${clienteId}/cuenta_banco`).then((respuesta) =>
    respuesta.datos.map(cuentaBancoFromAPI)
  );

export const getCuentaBanco = async (clienteId: string, cuentaId: string): Promise<CuentaBanco> =>
  await RestAPI.get<{ datos: CuentaBancoAPI }>(`${baseUrlVentas}/${clienteId}/cuenta_banco/${cuentaId}`).then((respuesta) =>
    cuentaBancoFromAPI(respuesta.datos)
  );

export const postCuentaBanco = async (clienteId: string, cuenta: NuevaCuentaBanco): Promise<string> => {
  const payload = {
    cuenta: cuenta,
  };
  return await RestAPI.post(`${baseUrlVentas}/${clienteId}/cuenta_banco`, payload).then((respuesta) => respuesta.id);
};

export const patchCuentaBanco = async (clienteId: string, cuenta: CuentaBanco): Promise<void> => {
  const payload = {
    cuenta: {
      iban: cuenta.iban,
      bic: cuenta.bic,
    },
  };
  await RestAPI.patch(`${baseUrlVentas}/${clienteId}/cuenta_banco/${cuenta.id}`, payload);
};

export const deleteCuentaBanco = async (clienteId: string, cuentaId: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlVentas}/${clienteId}/cuenta_banco/${cuentaId}`);

export const desmarcarCuentaDomiciliacion = async (clienteId: string): Promise<void> =>
  await RestAPI.patch(`${baseUrlVentas}/${clienteId}/cuenta_domiciliacion`, { "cuenta_id": null });

export const domiciliarCuenta = async (clienteId: string, cuentaId: string): Promise<void> => {
  const payload = {
    cuenta_id: cuentaId,
  };
  await RestAPI.patch(`${baseUrlVentas}/${clienteId}/cuenta_domiciliacion`, payload);
};

export type CuentaBancoAPI = {
  id: string;
  cuenta: {
    descripcion: string;
    iban: string;
    bic: string;
  };
};

export type CuentaBancoAPIPatch = {
  id: string;
  cuenta: {
    iban: string;
    bic: string;
  };
};


export const cuentaBancoFromAPI = (c: CuentaBancoAPI): CuentaBanco => ({
  id: c.id,
  descripcion: c.cuenta.descripcion,
  iban: c.cuenta.iban,
  bic: c.cuenta.bic,
});

export const cuentaBancoToAPI = (c: CuentaBanco): CuentaBancoAPIPatch => ({
  id: c.id,
  cuenta: {
    iban: c.iban,
    bic: c.bic,
  },
});

export const getCrmContactosCliente = async (clienteId: string): Promise<CrmContacto[]> =>
  await RestAPI.get<{ datos: CrmContacto[] }>(`${baseUrlCrm}/cliente/${clienteId}/contactos`).then((respuesta) => respuesta.datos);

export const postCrmContacto = async (contacto: NuevoCrmContacto): Promise<string> => {
  const payload = {
    nombre: contacto.nombre,
    email: contacto.email,
  };
  return await RestAPI.post(`${baseUrlCrm}/contacto`, payload).then((respuesta) => respuesta.id);
};

export const getCrmContacto = async (contactoId: string): Promise<CrmContacto> =>
  await RestAPI.get<{ datos: CrmContacto }>(`${baseUrlCrm}/contacto/${contactoId}`).then((respuesta) => respuesta.datos);

export const getCrmContactos = async (filtro: Filtro, orden: Orden): Promise<CrmContacto[]> => {
  const q = criteriaQuery(filtro, orden);
  return RestAPI.get<{ datos: CrmContacto[] }>(`${baseUrlCrm}/contacto` + q).then((respuesta) => respuesta.datos);
}

export const patchCrmContacto = async (contacto: CrmContacto): Promise<void> => {
  const payload = {
    nombre: contacto.nombre,
    email: contacto.email,
  };
  await RestAPI.patch(`${baseUrlCrm}/${contacto.id}`, payload);
};

export const deleteCrmContacto = async (contactoId: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlCrm}/contacto/${contactoId}`);
