import { ContextoError } from '@olula/lib/contexto.ts';
import { Contexto, EventoMaquina, Maquina } from '@olula/lib/diseño.ts';
import { procesarEvento } from '@olula/lib/dominio.js';
import { useCallback, useContext, useState } from 'react';

export interface UseMaestroReturn<Estado extends string, C extends Contexto<Estado>> {
    ctx: C;
    emitir: (evento: string, payload?: unknown) => Promise<EventoMaquina[]>;
}

export function useMaestro<Estado extends string, C extends Contexto<Estado>>(
    getMaquina: () => Maquina<Estado, C>,
    contextoInicial: C,
): UseMaestroReturn<Estado, C> {

    const { intentar } = useContext(ContextoError);
    const maquina = getMaquina();

    const [ctx, setCtx] = useState<C>(contextoInicial);

    const emitir = useCallback(async (evento: string, payload?: unknown): Promise<EventoMaquina[]> => {
        const contexto: C = {
            ...ctx,
        };

        const [nuevoContexto, eventos] = await intentar(() =>
            procesarEvento(maquina, contexto, evento, payload)
        );

        setCtx(nuevoContexto);

        return eventos;
    }, [ctx, maquina, intentar]);

    return {
        ctx: {
            ...ctx,
        },
        emitir,
    };
}
