import { useCallback, useReducer, useState } from "react";
import { Modelo } from "./diseño.ts";
import { Accion, makeReductor2, MetaModelo, modeloEsEditable, modeloEsValido, modeloModificado, validacionCampoModelo } from "./dominio.ts";

type TipoInput = "texto" | "checkbox" | "numero";
export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    modeloInicialProp: T
): HookModelo<T> {

    // const memoizedInitModelo = useCallback(() => {
    //     return initEstadoModelo(modeloInicial);
    // }, [modeloInicial]);

    // const [entidad, dispatch] = useReducer(
    //     makeReductor(meta),
    //     initEstadoModelo(modeloInicial)
    //     // memoizedInitModelo(),
    //     // initEstadoModelo(modeloInicial, meta)
    // );
    const [modelo, dispatch] = useReducer(
        makeReductor2(meta),
        modeloInicialProp
        // initEstadoModelo(modeloInicial)
        // memoizedInitModelo(),
        // initEstadoModelo(modeloInicial, meta)
    );
    const [modeloInicial, setModeloInicial] = useState(modeloInicialProp);
    const entidad = {
        valor: modelo,
        valor_inicial: modeloInicial,
    };

    // useEffect(() => {
    //     console.log('useEffect inicial', modeloInicial, modeloInicial === modeloInicial);
    //     console.log('useEffect modelo', modelo);
    //     if (modeloInicial !== modeloInicial) {
    //         dispatch({
    //             type: "init",
    //             payload: {
    //                 entidad: modeloInicial
    //             }
    //         });
    //     }
    // }, [modeloInicial]);

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
        const validacion = validacionCampoModelo(meta)(modelo, campo);
        const valido = validacion === true;
        // console.log('validacion', campo, validacion, valido);
        const valor = modelo[campo] as string;
        const textoValidacion = valor === modeloInicial[campo]
            ? ''
            : typeof validacion === "string"
                ? validacion
                : '';
        const editable = modeloEsEditable<T>(meta)(modelo, campo);
        const cambiado = valor !== modeloInicial[campo];
        const campos = meta.campos || {};
        const tipoMeta = campo in campos && campos[campo]?.tipo
            ? campos[campo].tipo
            : "string";
        const conversionTipo = {
            "string": "texto",
            "boolean": "checkbox",
            "number": "numero",
        }
        const tipo = (conversionTipo[tipoMeta] || "texto") as TipoInput;


        return {
            nombre: campo,
            valor: valor,
            tipo: tipo,
            deshabilitado: !editable,
            valido: cambiado && valido,
            erroneo: !valido,
            advertido: false,
            textoValidacion: textoValidacion,
            onChange: setCampo(campo, secundario),
            descripcion: secundario ? modelo[secundario] as string : undefined,
        }
    }
    const init = useCallback((modelo?: T) => {
        dispatch({
            type: "init",
            payload: {
                entidad: modelo || modeloInicial
            }
        })
        setModeloInicial(modelo || modeloInicial);
    }, [modeloInicial]);

    return {
        modelo,
        modeloInicial,
        uiProps,
        init,
        dispatch,
        modificado: modeloModificado(entidad),
        valido: modeloEsValido(meta)(entidad.valor),
        editable: modeloEsEditable<T>(meta)(modelo),
    } as const;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modeloInicial: T,
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
    tipo: TipoInput;
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

// export const getUiProps = <T extends Modelo>(meta: MetaModelo<T>, modelo: T, modeloInicial: T, setModelo: ((modelo: T) => void)) => (campo: string, secundario?: string) => {

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

//     const cambiado = valor !== modeloInicial[campo];
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