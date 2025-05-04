import { Direccion, Entidad, Modelo } from "./diseño.ts";

export const actualizarEntidadEnLista = <T extends Entidad>(entidades: T[], entidad: T): T[] => {
    return entidades.map(e => {
        return e.id === entidad.id ? entidad : e
    });
}

export const quitarEntidadDeLista = <T extends Entidad>(lista: T[], id: string): T[] => {
    return lista.filter((e) => e.id !== id);
}

export const refrescarSeleccionada = <T extends Entidad>(entidades: T[], id: string | undefined, setSeleccionada: (e?: string) => void) => {
    const nuevaSeleccionada = id
        ? entidades.find((e) => e.id === id)
        : null
    setSeleccionada(nuevaSeleccionada ? nuevaSeleccionada.id : undefined);
}

export const getElemento = <T extends Entidad>(lista: T[], id: string): T => {
    const elementos = lista.filter((e) => e.id === id);
    if (elementos.length === 1) {
        return elementos[0];
    }
    throw new Error(`No se encontró el elemento con id ${id}`);
};

export const direccionCompleta = (valor: Direccion) => `${valor.tipo_via ? (valor.tipo_via + ' ') : ''} ${valor.nombre_via}, ${valor.ciudad}`;
export const direccionVacia: Direccion = {
    tipo_via: '',
    nombre_via: '',
    ciudad: '',
    numero: '',
    otros: '',
    cod_postal: '',
    provincia_id: 0,
    provincia: '',
    pais_id: '',
    apartado: '',
    telefono: '',
}
export const boolAString = (valor: boolean) => valor ? "Sí" : "No";

export const stringNoVacio = (valor: string) => {
    return valor.length > 0;
}

export type ValidacionCampo = {
    valido: boolean;
    textoValidacion: string;
    bloqueado: boolean;
    requerido: boolean;
}

export type Validacion = Record<string, ValidacionCampo>;

export type EstadoModelo<T extends Modelo> = {
    valor: T;
    valor_inicial: T;
    // validacion: Validacion;
    // editable: (campo?: string) => boolean;
}



export type Validador<T extends Modelo> = (estado: EstadoModelo<T>, campo: string) => Validacion;
type PropTipoCampo = 'string' | 'boolean' | 'number'
type Campo<T extends Modelo> = {
    nombre?: string;
    tipo?: PropTipoCampo;
    requerido?: boolean;
    bloqueado?: boolean;
    validacion?: (modelo: T) => string | boolean;
}
type TipoCampo = string | boolean | number;

export type MetaModelo<T extends Modelo> = {
    // validador: Validador<T>;
    campos?: Record<string, Campo<T>>;
    editable?: (modelo: T, campo?: string) => boolean;
    validacion?: (modelo: T) => string | boolean;
}


export const makeReductor = <T extends Modelo>(meta: MetaModelo<T>) => {

    return (estado: EstadoModelo<T>, accion: Accion<T>): EstadoModelo<T> => {

        switch (accion.type) {

            case "init": {
                return initEstadoModelo<T>(
                    accion.payload.entidad,
                    // meta
                );
            }

            case "set_campo": {
                const valor = convertirValorCampo<T>(
                    accion.payload.valor,
                    accion.payload.campo,
                    meta.campos
                );
                return cambiarEstadoModelo<T>(
                    estado,
                    accion.payload.campo,
                    valor,
                    // meta.validador,
                );
            }

            default: {
                return { ...estado };
            }
        }
    }
}

export const makeReductor2 = <T extends Modelo>(meta: MetaModelo<T>) => {

    return (estado: T, accion: Accion<T>): T => {

        switch (accion.type) {

            case "init": {
                return accion.payload.entidad;
            }

            case "set_campo": {
                const valor = convertirValorCampo<T>(
                    accion.payload.valor,
                    accion.payload.campo,
                    meta.campos
                );
                return {
                    ...estado,
                    [accion.payload.campo]: valor
                }
                // return cambiarEstadoModelo<T>(
                //     estado,
                //     accion.payload.campo,
                //     valor,
                //     // meta.validador,
                // );
            }

            default: {
                return { ...estado };
            }
        }
    }
}

const convertirValorCampo = <T extends Modelo>(valor: string, campo: string, campos?: Record<string, Campo<T>>) => {
    if (!campos) return valor;
    if (!(campo in campos)) return valor;

    switch (campos[campo].tipo) {
        case 'boolean':
            return valor === 'true'
        case 'number':
            const numero = parseFloat(valor)
            return isNaN(numero) ? '' : numero; // Quizá hay que convertir a null y pasar luego en el uiProps a ''
        default:
            return valor;
    }
}

export const initEstadoModelo = <T extends Modelo>(modelo: T) => {
    if ('referencia' in modelo) {
        console.log("init modelo y modelo_inicial");
    }
    const estado = {
        valor: { ...modelo },
        valor_inicial: modelo,
    }
    return estado;
}

export const cambiarEstadoModelo = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string,
    valor: TipoCampo,
    // validador: Validador<T>,
): EstadoModelo<T> => {

    return {
        ...estado,
        valor: {
            ...estado.valor,
            [campo]: valor
        }
    }

    // return validarCambio(
    //     cambiarCampo<T>(estado, campo, valor),
    //     campo, validador
    // );
}

const cambiarCampo = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string,
    valor: TipoCampo
): EstadoModelo<T> => {

    return {
        ...estado,
        valor: {
            ...estado.valor,
            [campo]: valor
        }
    }
}

// const validarCambio = <T extends Modelo>(estado: EstadoModelo<T>,
//     campo: string,
//     validador: Validador<T>
// ): EstadoModelo<T> => {

//     return {
//         ...estado,
//         validacion: validador(estado, campo)
//     }
// }

export type Accion<T extends Modelo> = {
    type: 'init';
    payload: {
        entidad: T
    }
} | {
    type: 'set_campo';
    payload: {
        campo: string;
        valor: string;
    }
}

export type EstadoInput = {
    nombre: string;
    valor: string;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    valido: boolean;
}
export const campoModeloAInput = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string
): EstadoInput => {

    // const validacion = estado.validacion[campo];
    const validacion = {
        valido: true,
        textoValidacion: "",
        bloqueado: false,
        requerido: false,
    }
    const valor = estado.valor[campo] as string;
    const cambiado = valor !== estado.valor_inicial[campo];
    return {
        nombre: campo,
        valor: valor,
        deshabilitado: validacion.bloqueado,
        valido: cambiado && validacion.valido,
        erroneo: !validacion.valido,
        advertido: false,
        textoValidacion: validacion.textoValidacion,
    }
}

export const validacionDefecto = (validacion: ValidacionCampo, valor: string): ValidacionCampo => {
    const valido = !validacion.requerido || stringNoVacio(valor);
    return {
        ...validacion,
        valido,
        textoValidacion: valido ? "" : "Campo requerido",
    }
}

export type ValidadorCampo<T extends Modelo> = (estado: EstadoModelo<T>) => ValidacionCampo;
export type ValidadorCampos<T extends Modelo> = Record<string, ValidadorCampo<T>>;


export const modeloEsEditable = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T, campo?: string) => {
    const campos = meta.campos || {};
    const bloqueado = campo
        ? campo in campos && campos[campo]?.bloqueado
        : false
    return (campo)
        ? meta.editable
            ? meta.editable(modelo, campo) && !bloqueado
            : !bloqueado
        : meta.editable
            ? meta.editable(modelo)
            : true;
}


export const validacionCampoModelo = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T, campo: string) => {
    const campos = meta.campos || {};
    const requerido = campo in campos && campos[campo]?.requerido
    const valor = modelo[campo];
    // console.log("validacionCampoModelo", campo, requerido, valor === '', valor === null, valor === undefined);
    if (requerido && valor === '') {
        return "Campo requerido";
    }
    const validacion = campos[campo]?.validacion
    return validacion
        ? validacion(modelo)
        : true;

}
export const campoModeloEsValido = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T, campo: string) =>
    validacionCampoModelo(meta)(modelo, campo) === true;

export const entidadValida = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T) => {
    // Object.keys(modelo).forEach((k) => {
    //     if (campoModeloEsValido(meta)(modelo, k) !== true) {
    //         console.log("Campo inválido", k, modelo[k], campoModeloEsValido(meta)(modelo, k));
    //     }
    //     // console.log("Campo", k, modelo[k], campoModeloEsValido(meta)(modelo, k));
    // })
    // console.log("Valido ", Object.keys(modelo).every((k) => {
    //     campoModeloEsValido(meta)(modelo, k) === true;
    // }))
    const camposValidos = Object.keys(modelo).every((k) =>
        campoModeloEsValido(meta)(modelo, k) === true
    )
    const validacionGeneral = meta.validacion
        ? meta.validacion(modelo) === true
        : true;

    return camposValidos && validacionGeneral;
}
export const modeloEsValido = <T extends Modelo>(meta: MetaModelo<T>) => (estado: EstadoModelo<T>) => {
    // console.log("MOdelo modificado", modeloModificado(estado));
    // console.log("Entidad válida", entidadValida(meta)(estado.valor));
    return modeloModificado(estado) && entidadValida(meta)(estado.valor);
}

// export const entidadValida = <T extends Modelo>(estado: EstadoModelo<T>) =>
//     true;
// TO DO
// Object.values(estado.validacion).every((v) => v.valido)


export const modeloModificado = <T extends Modelo>(estado: EstadoModelo<T>) => {
    const valor_inicial = estado.valor_inicial;
    const valor = estado.valor;
    // console.log("Modelo modificado = ", Object.keys(valor).some((k) => valor[k] !== valor_inicial[k]));
    return (
        Object.keys(valor).some((k) => valor[k] !== valor_inicial[k])
    )
}
// export const makeValidador = <T extends Modelo>(
//     validadorCampos: ValidadorCampos<T>
// ) => (
//     estado: EstadoModelo<T>, campo: string
// ) => {

//         const validacion = estado.validacion;

//         return (campo in validadorCampos)
//             ? {
//                 ...validacion,
//                 [campo]: validarCampo(estado, campo, validadorCampos[campo]),
//             }
//             : {
//                 ...validacion,
//                 [campo]: validarCampo(estado, campo),
//             }

//     }

// export const validarCampo = <T extends Modelo>(
//     estado: EstadoModelo<T>,
//     campo: string, validador?: ValidadorCampo<T>
// ): ValidacionCampo => {

//     const entidad = estado.valor;
//     const validacion = estado.validacion;
//     const valor = entidad[campo] as string;
//     const valido = !validacion[campo].requerido || stringNoVacio(valor.toString());
//     if (valido !== true) {
//         return {
//             ...validacion[campo],
//             valido: false,
//             textoValidacion: "Campo requerido",
//         }
//     }
//     if (validador) {
//         const validacionCampo = validador(estado);
//         return {
//             ...validacion[campo],
//             ...validacionCampo,
//         }
//     }
//     return {
//         ...validacion[campo],
//         valido: true,
//         textoValidacion: "",
//     }
// }