import { Direccion } from "../../comun/diseño.ts";
import { NuevoPresupuesto, Presupuesto } from "./diseño.ts";

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
    divisa_id: '',
    aprobado: false,
})

export const validadoresPresupuesto = {
    cliente_id: (valor: string) => valor.trim() !== "",
    direccion_id: (valor: string) => valor.trim() !== "",
    fecha: (valor: string) => !isNaN(Date.parse(valor)),
    empresa_id: (valor: string) => valor.trim() !== "",
    nuevoPresupuesto: (presupuesto: NuevoPresupuesto) =>
        validadoresPresupuesto.cliente_id(presupuesto.cliente_id) &&
        validadoresPresupuesto.direccion_id(presupuesto.direccion_id) &&
        validadoresPresupuesto.empresa_id(presupuesto.empresa_id),
};


