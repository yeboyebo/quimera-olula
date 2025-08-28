import { EstadoModelo, initEstadoModelo, MetaModelo } from "../../comun/dominio.ts";
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


