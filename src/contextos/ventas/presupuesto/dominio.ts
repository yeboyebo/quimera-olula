import { Direccion } from "../../comun/diseño.ts";
import { Presupuesto } from "./diseño.ts";

export const direccionVacia = (): Direccion => ({
    dir_envio: false,
    dir_facturacion: false,
    nombre_via: '',
    tipo_via: '',
    numero: '',
    otros: '',
    cod_postal: '',
    ciudad: '',
    provincia_id: 0,
    provincia: '',
    pais_id: '',
    apartado: '',
    telefono: '',
})


export const presupuestoVacio = (): Presupuesto => ({
    id: '',
    codigo: '',
    fecha: '',
    cliente_id: '',
    nombre_cliente: '',
    id_fiscal: '',
    direccion_id: '',
    direccion: direccionVacia(),
    agente_id: '',
    nombre_agente: '',
})


