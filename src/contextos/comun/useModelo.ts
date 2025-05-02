import { useCallback, useReducer } from "react";
import { Modelo } from "./diseño.ts";
import { Accion, EstadoModelo, initEstadoModelo, makeReductor, MetaModelo } from "./dominio.ts";

const initReducer = <T extends Modelo>(meta: MetaModelo<T>) => (estadoInicial: T) => {
    return initEstadoModelo(estadoInicial, meta);
}

export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    estadoInicial: T
): HookModelo<T> {

    // const getEstadoInicial = useCallback(() => {
    //     console.log("getEstadoInicial", estadoInicial);
    //     return initEstadoModelo(estadoInicial, meta);
    // }, [estadoInicial, meta]);

    // console.log('useModelo')

    const [entidad, dispatch] = useReducer(
        makeReductor(meta),
        // estadoInicial,
        // initReducer(meta)
        initEstadoModelo(estadoInicial, meta)
        // getEstadoInicial()
    );
    // console.log('useModelo estadoInicial', estadoInicial);
    // console.log('useModelo entidadusto=', entidad);
    // console.log('useModelo func=', initEstadoModelo(estadoInicial, meta));
    // useEffect(() => {
    //     dispatch({
    //         type: 'init',
    //         payload: {
    //             entidad: estadoInicial
    //         }
    //     });
    // }, [estadoInicial])

    const setCampo = (campo: string, segundo?: string) => (_valor: ValorControl) => {

        // console.log("setCampo", campo, segundo, _valor);
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
        const validacion = entidad.validacion[campo];
        const valor = entidad.valor[campo] as string;
        const cambiado = valor !== entidad.valor_inicial[campo];
        return {
            nombre: campo,
            valor: valor,
            deshabilitado: validacion.bloqueado,
            valido: cambiado && validacion.valido,
            erroneo: !validacion.valido,
            advertido: false,
            textoValidacion: validacion.textoValidacion,
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
    // console.log('useModelo entidad=', entidad);

    return [entidad, uiProps, init, dispatch] as const;
}
export type HookModelo<T extends Modelo> = [
    EstadoModelo<T>,
    (campo: string, secundario?: string) => UiProps,
    (entidad?: T) => void,
    (action: Accion<T>) => void
]
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

