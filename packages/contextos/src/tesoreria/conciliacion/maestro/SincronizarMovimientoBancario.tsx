import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useContext, useEffect } from "react";
import { postSincronizarMovimientoBancario } from "../infraestructura.js";

/**
 * Componente sin UI propia: lanza `/movimiento_bancario/sincronizar` al
 * montarse. El padre solo lo monta mientras estado === "SINCRONIZANDO" (ver
 * MaestroConDetalleConciliacion.tsx), igual que
 * conexion_bancaria/conectar_banco/ConectarBancoConexionBancaria.tsx.
 *
 * Si la petición falla del todo, `intentar` (ContextoError) ya muestra el
 * error global; aquí solo hace falta volver la máquina a INICIAL.
 */
export const SincronizarMovimientoBancario = ({
    publicar,
}: {
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);

    useEffect(() => {
        let vigente = true;
        intentar(
            async () => {
                const resumen = await postSincronizarMovimientoBancario();
                if (vigente) await publicar("sincronizacion_completada", resumen);
            },
            () => publicar("sincronizacion_cancelada")
        );
        return () => {
            vigente = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};
