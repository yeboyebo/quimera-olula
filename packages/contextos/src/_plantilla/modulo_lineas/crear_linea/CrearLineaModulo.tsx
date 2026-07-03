import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useState } from "react";
import { ModLin } from "../diseño.js";
import { postLineaModulo } from "../infraestructura.js";
import { metaNuevaLineaModulo, nuevaLineaModuloVacia } from "./crear_linea.js";

export const CrearLineaModulo = ({
    modLin,
    publicar,
}: {
    modLin: ModLin;
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);

    const { modelo, uiProps, valido } = useModelo(
        metaNuevaLineaModulo,
        nuevaLineaModuloVacia()
    );

    const [creando, setCreando] = useState(false);

    const crear = useCallback(
        async () => {
            const idLinea = await intentar(() => postLineaModulo(modLin.id, modelo));
            setCreando(true);
            publicar("linea_creada", idLinea);
        },
        [modelo, publicar, modLin.id]
    );

    const cancelar = useCallback(() => {
        if (!creando) publicar("alta_de_linea_cancelada");
    }, [creando, publicar]);

    return (
        <QModal
            abierto={true}
            nombre="mostrar"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <QInput label="Campo String" {...uiProps("campoString")} />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={crear} deshabilitado={!valido}>
                    Crear
                </QBoton>
            </div>
        </QModal>
    );
};
