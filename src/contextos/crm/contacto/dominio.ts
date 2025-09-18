import { MetaTabla } from "../../../componentes/atomos/qtabla.tsx";
import { EstadoModelo, initEstadoModelo, MetaModelo, stringNoVacio } from "../../comun/dominio.ts";
import { Contacto, NuevoContacto } from "./diseño.ts";


export const contactoVacio: Contacto = {
    id: '',
    nombre: '',
    email: '',
};

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
        nombre: { requerido: true, validacion: (contacto: NuevoContacto) => stringNoVacio(contacto.nombre) },
        email: { requerido: true, tipo: "email", validacion: (contacto: NuevoContacto) => stringNoVacio(contacto.email) },
    },
};

export const initEstadoContactoVacio = () => initEstadoContacto(contactoVacio)


export const metaTablaContacto: MetaTabla<Contacto> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
];
