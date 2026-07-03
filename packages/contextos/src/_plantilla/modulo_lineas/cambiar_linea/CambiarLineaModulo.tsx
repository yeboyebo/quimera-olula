import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { LineaModulo, ModLin } from "../diseño.js";
import { patchLineaModulo } from "../infraestructura.js";
import { metaLineaModuloEdicion } from "./cambiar_linea.js";

export const CambiarLineaModulo = ({
    modLin,
    linea,
    publicar,
}: {
    modLin: ModLin;
    linea: LineaModulo;
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);
    const { modelo, uiProps, valido } = useModelo(metaLineaModuloEdicion, linea);
    const [cambiando, setCambiando] = useState(false);

    const cambiar = useCallback(
        async () => {
            await intentar(() => patchLineaModulo(modLin.id, linea.id, modelo));
            setCambiando(true);
            publicar("linea_cambiada", linea);
        },
        [modelo, publicar, modLin.id, linea]
    );

    const cancelar = useCallback(() => {
        if (!cambiando) publicar("cambio_de_linea_cancelado");
    }, [cambiando, publicar]);

    return (
        <QModal
            abierto={true}
            nombre="mostrar"
            titulo="Cambiar línea"
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <QInput label="Campo String" {...uiProps("campoString")} />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={cambiar} deshabilitado={!valido}>
                    Cambiar
                </QBoton>
            </div>
        </QModal>
    );
};
