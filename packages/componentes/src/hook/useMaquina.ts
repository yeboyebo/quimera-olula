import { ContextoError } from '@olula/lib/contexto.ts';
import { Contexto, EmitirEvento, EventoMaquina, Maquina } from '@olula/lib/diseño.ts';
import { procesarEvento } from '@olula/lib/dominio.js';
import { useCallback, useContext, useState } from 'react';

export interface UseMaquinaReturn<Estado extends string, C extends Contexto<Estado>> {
    ctx: C;
    emitir: EmitirEvento;
}

export function useMaquina<Estado extends string, C extends Contexto<Estado>>(
    getMaquina: () => Maquina<Estado, C>,
    contextoInicial: C,
    publicar: EmitirEvento = () => { },
): UseMaquinaReturn<Estado, C> {

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

        if (publicar) {
            eventos.forEach(([nombre, datos]) => publicar(nombre, datos));
        }

        return eventos;
    }, [ctx, maquina, intentar, publicar]);

    return {
        ctx,
        emitir
    };
}
