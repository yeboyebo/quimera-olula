import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext, useEffect } from "react";
import { postConciliarAutomaticamente } from "../infraestructura.js";

/**
 * Componente sin UI propia: lanza `/movimiento_bancario/conciliar_automaticamente`
 * al montarse. El padre solo lo monta mientras estado === "CONCILIANDO_AUTOMATICAMENTE",
 * igual que SincronizarMovimientoBancario.tsx.
 */
export const ConciliarAutomaticamenteMovimientos = ({
    publicar,
}: {
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);

    useEffect(() => {
        let vigente = true;
        intentar(
            async () => {
                const resumen = await postConciliarAutomaticamente();
                if (vigente) await publicar("conciliacion_automatica_completada", resumen);
            },
            () => publicar("conciliacion_automatica_cancelada")
        );
        return () => {
            vigente = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
