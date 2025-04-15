import { CampoFormularioGenerico, OpcionCampo } from "../../../componentes/detalle/FormularioGenerico.tsx";
import { RestAPI } from "../../comun/api/rest_api.ts";
import { Filtro, Orden } from "../../comun/diseño.ts";
import { criteriaQuery } from "../../comun/infraestructura.ts";
import { Cliente, CrmContacto, CuentaBanco, DirCliente, GetCliente, NuevaCuentaBanco, NuevaDireccion, NuevoCrmContacto, PatchCliente, PostCliente } from "./diseño.ts";


const baseUrlVentas = `/ventas/cliente`;
const baseUrlCrm = `/crm`;

type ClienteApi = Cliente;

const clienteFromAPI = (c: ClienteApi): Cliente => ({
  ...c,
  de_baja: false,
  fecha_baja: '',
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

export const patchClienteOld: PatchCliente = async (id, cambios) => {
  const payload = { cambios };
  await RestAPI.patch(`${baseUrlVentas}/${id}`, payload);
};

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
    }
  });

export const deleteCliente = async (id: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlVentas}/${id}`);

export const postCliente: PostCliente = async (cliente) => {
  return await RestAPI.post(baseUrlVentas, cliente).then((respuesta) => respuesta.id);
}

export const desmarcarCuentaDomiciliacion = async (clienteId: string): Promise<void> =>
  await RestAPI.patch(`${baseUrlVentas}/${clienteId}/desmarcar_domiciliada`, {});

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


export const obtenerOpcionesSelector =
  (path: string) => async () =>
    RestAPI.get<{ datos: [] }>(
      `/cache/comun/${path}`
    ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));

export const camposDireccion: Record<string, CampoFormularioGenerico> = {
  id: { nombre: "id", etiqueta: "ID", tipo: "text", oculto: true },
  nombre_via: { nombre: "nombre_via", etiqueta: "Nombre de la Vía", tipo: "text", xtipo: "no controlado" },
  tipo_via: { nombre: "tipo_via", etiqueta: "Tipo de Vía", tipo: "text" },
  numero: { nombre: "numero", etiqueta: "Número", tipo: "text" },
  otros: { nombre: "otros", etiqueta: "Otros", tipo: "text" },
  cod_postal: { nombre: "cod_postal", etiqueta: "Código Postal", tipo: "text" },
  ciudad: { nombre: "ciudad", etiqueta: "Ciudad", tipo: "text" },
  provincia_id: { nombre: "provincia_id", etiqueta: "ID de Provincia", tipo: "number" },
  provincia: { nombre: "provincia", etiqueta: "Provincia", tipo: "text" },
  pais_id: { nombre: "pais_id", etiqueta: "ID de País", tipo: "text" },
  apartado: { nombre: "apartado", etiqueta: "Apartado", tipo: "text" },
  telefono: { nombre: "telefono", etiqueta: "Teléfono", tipo: "text" },
}

// export const camposCliente: Record<string, CampoFormularioGenerico> = {
//   id: { nombre: "id", etiqueta: "Código", tipo: "text", oculto: true },
//   nombre: { nombre: "nombre", etiqueta: "Nombre", tipo: "text", ancho: "100%", xtipo: "no controlado", },
//   id_fiscal: {
//     nombre: "id_fiscal", etiqueta: "CIF/NIF", tipo: "text", xtipo: "controlado"
//   },
//   agente_id: { nombre: "agente_id", etiqueta: "Agente", tipo: "text" },
//   divisa_id: {
//     nombre: "divisa_id",
//     etiqueta: "Divisa",
//     tipo: "select",
//     opciones: opcionesDivisa,
//   },
//   empresa_id: { nombre: "empresa_id", etiqueta: "Empresa", tipo: "text" },
//   tipo_id_fiscal: {
//     nombre: "tipo_id_fiscal", etiqueta: "Tipo ID Fiscal", tipo: "text", xtipo: "controlado", opciones: [
//       ["NIF", "NIF"],
//       ["NIF/IVA", "NIF/IVA"],
//       ["Pasaporte", "Pasaporte"],
//       ["Doc.Oficial País", "Doc.Oficial País"],
//       ["Cert.Residencia", "Cert.Residencia"],
//       ["Otro", "Otro"],
//     ]
//   },
//   serie_id: { nombre: "serie_id", etiqueta: "Serie", tipo: "text", soloLectura: true },
//   forma_pago_id: { nombre: "forma_pago_id", etiqueta: "Forma de Pago", tipo: "text" },
//   grupo_iva_negocio_id: { nombre: "grupo_iva_negocio_id", etiqueta: "Grupo IVA Negocio", tipo: "text" },
//   eventos: { nombre: "eventos", etiqueta: "Eventos", tipo: "text", oculto: true },
//   espacio: { nombre: "espacio", etiqueta: "", tipo: "space" },
// }

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

export const getCrmContactos = async (clienteId: string): Promise<CrmContacto[]> =>
  await RestAPI.get<{ datos: CrmContacto[] }>(`${baseUrlCrm}/cliente/${clienteId}/contactos`).then((respuesta) => respuesta.datos);

export const postCrmContacto = async (contacto: NuevoCrmContacto): Promise<string> => {
  const payload = {
    nombre: contacto.nombre,
    email: contacto.email,
  };
  return await RestAPI.post(`${baseUrlCrm}/contacto`, payload).then((respuesta) => respuesta.id);
};

export const vincularContactoCliente = async (contactoId: string, clienteId: string): Promise<void> => {
  const payload = {
    contacto_id: contactoId,
  };
  await RestAPI.patch(`${baseUrlCrm}/cliente/${clienteId}/vincular_contacto`, payload);
};

export const patchCrmContacto = async (contacto: CrmContacto): Promise<void> => {
  const payload = {
    nombre: contacto.nombre,
    email: contacto.email,
  };
  await RestAPI.patch(`${baseUrlCrm}/${contacto.id}`, payload);
};

export const deleteCrmContacto = async (contactoId: string): Promise<void> =>
  await RestAPI.delete(`${baseUrlCrm}/${contactoId}`);
