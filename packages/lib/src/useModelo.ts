import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { ContextoError, QError } from "./contexto.ts";
import { Modelo, TipoInput, ValorCampoUI } from "./diseño.ts";
import { getFormProps, MetaModelo, modeloEsValido, modeloModificado } from "./dominio.ts";

const aQError = (error: unknown): QError => {
    const apiError = error as QError;
    const errorJS = error as Error;

    return {
        nombre: apiError?.nombre ?? "Error",
        descripcion: apiError?.descripcion ?? errorJS?.message,
    };
};

export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    modeloInicialProp: T,
    onModeloListo?: (t: T, campo?: string) => Promise<void | T>
): HookModelo<T> {

    const [modelo, setModelo] = useState(modeloInicialProp);
    const [modeloInicial, setModeloInicial] = useState<T>(modeloInicialProp);
    const [errorGuardado, setErrorGuardado] = useState<QError | null>(null);
    const [guardados, setGuardados] = useState(0);

    const { intentar } = useContext(ContextoError);

    // Evita que el setModelo interno de onModeloListoConError vuelva a disparar el callback
    const enCambioDesdeCallback = useRef(false);
    // Modelo en el último disparo exitoso; evita llamadas redundantes al servidor
    const modeloUltimoDisparo = useRef<T>(modeloInicialProp);

    const onModeloListoConError = useCallback(
        async (modelo: T, campo?: string) => {
            if (!onModeloListo) return;
            // No disparar si el modelo no cambió desde el último disparo exitoso
            if (!modeloModificado(modeloUltimoDisparo.current, modelo)) return;
            enCambioDesdeCallback.current = true;
            try {
                await intentar(async () => {
                    const nuevoModelo = await onModeloListo(modelo, campo);
                    if (nuevoModelo) {
                        setModelo(nuevoModelo); // directo, sin pasar por setExterno
                    }
                    // Actualizar solo en caso de éxito; si falla, el siguiente blur reintenta
                    modeloUltimoDisparo.current = nuevoModelo ?? modelo;
                });
                setErrorGuardado(null);
                setGuardados((n) => n + 1);
            } catch (error) {
                setErrorGuardado(aQError(error));
            } finally {
                enCambioDesdeCallback.current = false;
            }
        },
        [intentar, onModeloListo]
    );

    // Uso interno: onChange de QInput (sin disparar onModeloListo en cada tecla)
    const cambiarModelo = useCallback((nuevoModelo: T) => {
        setErrorGuardado(null);
        setModelo(nuevoModelo);
    }, []);

    // Uso externo: set() del HookModelo — evalúa onModeloListo si el modelo es válido
    const setExterno = useCallback((nuevoModelo: T, campo?: string) => {
        setErrorGuardado(null);
        setModelo(nuevoModelo);
        if (!enCambioDesdeCallback.current && onModeloListo && modeloEsValido(meta)(nuevoModelo)) {
            void onModeloListoConError(nuevoModelo, campo);
        }
    }, [meta, onModeloListo, onModeloListoConError]);

    const init = useCallback((nuevoModelo?: T) => {
        const modeloAUsar = nuevoModelo || modeloInicialProp;
        setErrorGuardado(null);
        setModelo(modeloAUsar);
        setModeloInicial(modeloAUsar);
        modeloUltimoDisparo.current = modeloAUsar;
    }, [modeloInicialProp]);

    useEffect(() => {
        setErrorGuardado(null);
        setModelo(modeloInicialProp);
        setModeloInicial(modeloInicialProp);
        modeloUltimoDisparo.current = modeloInicialProp;
    }, [modeloInicialProp]);

    return {
        modelo,
        modeloInicial: modeloInicial || modeloInicialProp,
        init,
        set: setExterno,
        errorGuardado,
        guardados,
        ...getFormProps(modelo, modeloInicial, meta, cambiarModelo, onModeloListoConError, errorGuardado),
    } as const;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modeloInicial: T,
    uiProps: (campo: string, secundario?: string) => UiProps,
    init: (entidad?: T) => void,
    set: (entidad: T, campo?: string) => void,
    modificado: boolean,
    valido: boolean,
    editable: boolean,
    errorGuardado: QError | null,
    guardados: number,
}

type ParamOpcion = {
    valor: string;
    descripcion?: string
};

export type ValorControl = null | boolean | string | ParamOpcion;

export type UiProps = {
    nombre: string;
    valor: ValorCampoUI;
    tipo: TipoInput;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    opcional: boolean;
    valido: boolean;
    modificado: boolean;
    soloLectura: boolean;
    onChange: (valor: ValorControl) => void;
    evaluarCambio: () => void;
    descripcion?: string;
    divisa?: string;
    decimales?: number;
}
