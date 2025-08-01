import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../comun/dominio.ts";
import { NuevaOportunidadVenta } from "../oportunidadventa/diseño.ts";
import { Contacto, NuevoContacto } from "./diseño.ts";


export const contactoVacio = (): Contacto => ({
    id: '',
    nombre: '',
    email: '',
});

export const initEstadoContacto = (contacto: Contacto): EstadoModelo<Contacto> => {
    return initEstadoModelo(contacto);
};

export const metaContacto: MetaModelo<Contacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
    }
};

export const nuevoContactoVacio: NuevoContacto = {
    nombre: '',
    email: '',
};

export const metaNuevoContacto: MetaModelo<NuevoContacto> = {
    campos: {
        nombre: { requerido: true },
        email: { requerido: true, tipo: "email" },
    },
};

export const initEstadoContactoVacio = () => initEstadoContacto(contactoVacio())


export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true },
        probabilidad: { requerido: true },
        estado_id: { requerido: false },
        contacto_id: { requerido: true, bloqueado: true },
        nombre_cliente: { requerido: true },
    }
};

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: "",
    probabilidad: "",
    valor_defecto: false,
    estado_id: undefined,
    contacto_id: "",
    nombre_cliente: "",
};


