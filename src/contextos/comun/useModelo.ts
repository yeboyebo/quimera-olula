import { useCallback, useReducer } from "react";
import { Modelo } from "./diseño.ts";
import { Accion, campoModeloEsValido, initEstadoModelo, makeReductor, MetaModelo, modeloEsEditable, modeloEsValido, modeloModificado } from "./dominio.ts";


export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    estadoInicial: T
): HookModelo<T> {

    const [entidad, dispatch] = useReducer(
        makeReductor(meta),
        initEstadoModelo(estadoInicial)
        // initEstadoModelo(estadoInicial, meta)
    );

    const setCampo = (campo: string, segundo?: string) => (_valor: ValorControl) => {

        let valor = _valor || '';
        let descripcion: string | undefined = undefined;
        if (typeof _valor === "object" && _valor && 'valor' in _valor) {
            valor = _valor.valor;
            if (segundo) {
                descripcion = _valor.descripcion;
            }
        }

        dispatch({
            type: "set_campo",
            payload: { campo, valor: valor as string },
        });

        if (segundo && descripcion) {
            dispatch({
                type: "set_campo",
                payload: { campo: segundo, valor: descripcion },
            });
        }
    };
    const uiProps = (campo: string, secundario?: string) => {
        const validacion = campoModeloEsValido(meta)(entidad.valor, campo);
        const valido = validacion === true;
        const textoValidacion = typeof validacion === "string" ? validacion : "";
        const editable = modeloEsEditable<T>(meta)(entidad.valor, campo);
        const valor = entidad.valor[campo] as string;

        const cambiado = valor !== entidad.valor_inicial[campo];
        return {
            nombre: campo,
            valor: valor,
            deshabilitado: !editable,
            valido: cambiado && valido,
            erroneo: !valido,
            advertido: false,
            textoValidacion: textoValidacion,
            onChange: setCampo(campo, secundario),
            descripcion: secundario ? entidad.valor[secundario] as string : undefined,
        }
    }
    const init = useCallback((modelo?: T) => dispatch({
        type: "init",
        payload: {
            entidad: modelo || entidad.valor_inicial
        }
    }), [entidad]);

    return {
        modelo: entidad.valor,
        modelo_inicial: entidad.valor_inicial,
        uiProps,
        init,
        dispatch,
        modificado: modeloModificado(entidad),
        valido: modeloEsValido(meta)(entidad),
        editable: modeloEsEditable<T>(meta)(entidad.valor),
    } as const;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modelo_inicial: T,
    uiProps: (campo: string, secundario?: string) => UiProps,
    init: (entidad?: T) => void,
    dispatch: (action: Accion<T>) => void
    modificado: boolean,
    valido: boolean,
    editable: boolean,
}

type ParamOpcion = {
    valor: string;
    descripcion?: string
};

export type ValorControl = null | string | ParamOpcion;

export type UiProps = {
    nombre: string;
    valor: string;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    valido: boolean;
    onChange: (valor: ValorControl) => void;
    descripcion?: string;
}

// export const initModelo = <T extends Entidad>(setPresupuesto: ((modelo: T) => void), valorInicial: T) => (valor?: T) =>
//     setPresupuesto(valor || valorInicial);

// export const getUiProps = <T extends Modelo>(meta: MetaModelo<T>, modelo: T, modelo_inicial: T, setModelo: ((modelo: T) => void)) => (campo: string, secundario?: string) => {

//     const setCampo = (campo: string, segundo?: string) => (_valor: ValorControl) => {

//         let valor = _valor || '';
//         let descripcion: string | undefined = undefined;
//         if (typeof _valor === "object" && _valor && 'valor' in _valor) {
//             valor = _valor.valor;
//             if (segundo) {
//                 descripcion = _valor.descripcion;
//             }
//         }
//         const nuevoModelo = (segundo && descripcion)
//             ? { ...modelo, [campo]: valor, [segundo]: descripcion }
//             : { ...modelo, [campo]: valor };
//         setModelo(nuevoModelo);
//     };
//     const validacion = campoModeloEsValido(meta)(modelo, campo);
//     const valido = validacion === true;
//     const textoValidacion = typeof validacion === "string" ? validacion : "";
//     const valor = modelo[campo] as string;
//     const editable = modeloEsEditable<T>(meta)(modelo, campo);

//     const cambiado = valor !== modelo_inicial[campo];
//     return {
//         nombre: campo,
//         valor: valor,
//         deshabilitado: !editable,
//         valido: cambiado && valido,
//         erroneo: !valido,
//         advertido: false,
//         textoValidacion: textoValidacion,
//         onChange: setCampo(campo, secundario),
//         descripcion: secundario ? modelo[secundario] as string : undefined,
//     }
// }