import { useCallback, useEffect, useState } from "react";

import { Modelo, TipoInput, ValorCampoUI } from "./diseño.ts";
import { getFormProps, MetaModelo } from "./dominio.ts";

// type AutoGuardado<T extends Modelo> = (x: T) => Promise<T>;

export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    modeloInicialProp: T,
    onModeloListo?: (t: T) => Promise<void>
): HookModelo<T> {

    // const [modelo, dispatch] = useReducer(
    //     makeReductor(),
    //     modeloInicialProp
    // );
    // console.log('modeloInternoProp', modeloInicialProp);

    const [modelo, setModelo] = useState(modeloInicialProp);
    // console.log('modeloInterno', modelo);

    const [modeloInicial, setModeloInicial] = useState<T>(modeloInicialProp);
    // const modeloInicialPropRef = useRef(modeloInicialProp);
    // modeloInicialPropRef.current = modeloInicialProp;

    const init = useCallback((nuevoModelo?: T) => {
        const modeloAUsar = nuevoModelo || modeloInicialProp;
        setModelo(modeloAUsar);
        // dispatch({
        //     type: "set",
        //     payload: {
        //         entidad: modeloAUsar
        //     }
        // });
        setModeloInicial(modeloAUsar);
    }, []); // Vacío porque usamos ref

    // const set = useCallback(async (modelo: T) => {
    //     setModelo(modelo);

    //     // dispatch({
    //     //     type: "set",
    //     //     payload: {
    //     //         entidad: modelo
    //     //     }
    //     // })
    //     // }, [dispatch]);
    // }, [setModelo]);

    useEffect(() => {
        setModelo(modeloInicialProp);
        setModeloInicial(modeloInicialProp);
    }, [modeloInicialProp]);

    return {
        modelo,
        modeloInicial: modeloInicial || modeloInicialProp,
        init,
        set: setModelo,
        // dispatch,
        ...getFormProps(modelo, modeloInicial, meta, setModelo, onModeloListo),
    } as const;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modeloInicial: T,
    uiProps: (campo: string, secundario?: string) => UiProps,
    init: (entidad?: T) => void,
    set: (entidad: T) => void,
    // dispatch: (action: Accion<T>) => void
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
    valor: ValorCampoUI;
    tipo: TipoInput;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    valido: boolean;
    onChange: (valor: ValorControl) => void;
    evaluarCambio: () => void;
    descripcion?: string;
}

