import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useCallback, useContext } from "react";
import { ArqueoTpv } from "../diseño.ts";
import { patchReabrirArqueo } from "../infraestructura.ts";

export const ReabrirArqueoTpv = ({
    arqueo,
    publicar,
}: {
    arqueo: ArqueoTpv,
    publicar: EmitirEvento;
}) => {

    const { intentar } = useContext(ContextoError);

     const aceptar = useCallback(
        async () => {
            await intentar(() => patchReabrirArqueo(arqueo.id));
            publicar("reapertura_hecha");
        },
        [arqueo, intentar, publicar]
    );

    return (
        <QModalConfirmacion
            nombre="confirmarReabrirArqueo"
            abierto={true}
            titulo="Reabrir arqueo"
            mensaje="¿Está seguro de que desea reabrir el arqueo?"
            onCerrar={() => publicar("reapertura_cancelada")}
            onAceptar={aceptar}
        />
    );
};
