import { Direccion, Entidad, Modelo } from "./diseño.ts";

export const actualizarEntidadEnLista = <T extends Entidad>(entidades: T[], entidad: T): T[] => {
    return entidades.map(e => {
        return e.id === entidad.id ? entidad : e
    });
}

export const quitarEntidadDeLista = <T extends Entidad>(lista: T[], elemento: T): T[] => {
    return lista.filter((e) => e.id !== elemento.id);
}

export const refrescarSeleccionada = <T extends Entidad>(entidades: T[], id: string | undefined, setSeleccionada: (e?: string) => void) => {
    const nuevaSeleccionada = id
        ? entidades.find((e) => e.id === id)
        : null
    setSeleccionada(nuevaSeleccionada ? nuevaSeleccionada.id : undefined);
}

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
    validacion: Validacion;
}

export const modeloEsValido = <T extends Modelo>(estado: EstadoModelo<T>) => {
    return modeloModificado(estado) && entidadValida(estado);
}

export const entidadValida = <T extends Modelo>(estado: EstadoModelo<T>) =>
    Object.values(estado.validacion).every((v) => v.valido)


export const modeloModificado = <T extends Modelo>(estado: EstadoModelo<T>) => {
    const valor_inicial = estado.valor_inicial;
    const valor = estado.valor;
    return (
        Object.keys(valor).some((k) => valor[k] !== valor_inicial[k])
    )
}

export type Validador<T extends Modelo> = (estado: EstadoModelo<T>, campo: string) => Validacion;
type PropTipoCampo = 'string' | 'boolean' | 'number'
type Campo = {
    nombre?: string;
    tipo: PropTipoCampo;
    requerido?: boolean;
    bloqueado?: boolean;
}
type TipoCampo = string | boolean | number;

export type MetaModelo<T extends Modelo> = {
    bloqueados: string[];
    requeridos: string[];
    validador: Validador<T>;
    campos?: Record<string, Campo>;
}

export const makeReductor = <T extends Modelo>(meta: MetaModelo<T>) => {

    return (estado: EstadoModelo<T>, accion: Accion<T>): EstadoModelo<T> => {

        switch (accion.type) {

            case "init": {
                return initEstadoModelo<T>(
                    accion.payload.entidad,
                    meta
                );
            }

            case "set_campo": {
                const valor = convertirValorCampo(
                    accion.payload.valor,
                    accion.payload.campo,
                    meta.campos
                );
                return cambiarEstadoModelo<T>(
                    estado,
                    accion.payload.campo,
                    valor,
                    meta.validador,
                );
            }

            default: {
                return { ...estado };
            }
        }
    }
}

const convertirValorCampo = (valor: string, campo: string, campos?: Record<string, Campo>) => {
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

export const initEstadoModelo = <T extends Modelo>(modelo: T, meta: MetaModelo<T>) => {
    const validacion: Validacion = {}
    for (const k in modelo) {
        const requerido = meta.requeridos.includes(k);
        validacion[k] = {
            valido: requerido && modelo[k] === '' ? false : true,
            textoValidacion: "",
            bloqueado: meta.bloqueados.includes(k),
            requerido: requerido,
        };
    }
    const estado = {
        valor: { ...modelo },
        valor_inicial: { ...modelo },
        validacion
    }
    return estado;
}

export const cambiarEstadoModelo = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string,
    valor: TipoCampo,
    validador: Validador<T>,
): EstadoModelo<T> => {

    return validarCambio(
        cambiarCampo<T>(estado, campo, valor),
        campo, validador
    );
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

const validarCambio = <T extends Modelo>(estado: EstadoModelo<T>,
    campo: string,
    validador: Validador<T>
): EstadoModelo<T> => {

    return {
        ...estado,
        validacion: validador(estado, campo)
    }
}

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

    const validacion = estado.validacion[campo];
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

export const makeValidador = <T extends Modelo>(
    validadorCampos: ValidadorCampos<T>
) => (
    estado: EstadoModelo<T>, campo: string
) => {

        const validacion = estado.validacion;

        return (campo in validadorCampos)
            ? {
                ...validacion,
                [campo]: validarCampo(estado, campo, validadorCampos[campo]),
            }
            : {
                ...validacion,
                [campo]: validarCampo(estado, campo),
            }

    }

export const validarCampo = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string, validador?: ValidadorCampo<T>
): ValidacionCampo => {

    const entidad = estado.valor;
    const validacion = estado.validacion;
    const valor = entidad[campo] as string;
    const valido = !validacion[campo].requerido || stringNoVacio(valor.toString());
    if (valido !== true) {
        return {
            ...validacion[campo],
            valido: false,
            textoValidacion: "Campo requerido",
        }
    }
    if (validador) {
        const validacionCampo = validador(estado);
        return {
            ...validacion[campo],
            ...validacionCampo,
        }
    }
    return {
        ...validacion[campo],
        valido: true,
        textoValidacion: "",
    }
}