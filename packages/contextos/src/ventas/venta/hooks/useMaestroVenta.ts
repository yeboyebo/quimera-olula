import { ContextoError } from '@olula/lib/contexto.ts';
import { Contexto, EmitirEvento, Maquina } from '@olula/lib/diseño.ts';
import { procesarEvento } from '@olula/lib/dominio.js';
import { useCallback, useContext, useState } from 'react';

export interface UseMaestroVentaReturn<Estado extends string, C extends Contexto<Estado>> {
    ctx: C;
    emitir: EmitirEvento;
}

export function useMaestroVenta<Estado extends string, C extends Contexto<Estado>>(
    getMaquina: () => Maquina<Estado, C>,
    contextoInicial: C,
): UseMaestroVentaReturn<Estado, C> {

    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const [ctx, setCtx] = useState<C>(contextoInicial);

    const emitir = useCallback(async (evento: string, payload?: unknown): Promise<void> => {
        const contexto: C = {
            ...ctx,
        };

        const [nuevoContexto, _] = await intentar(() =>
            procesarEvento(maquina, contexto, evento, payload)
        );

        setCtx(nuevoContexto);

        // return eventos;
    }, [ctx, maquina, intentar]);

    return {
        ctx: {
            ...ctx,
        },
        emitir,
    };
}
