import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput, QModal } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useMemo } from "react";
import { Almacen } from "../../../comun/componentes/Almacen.tsx";
import { TipoOrden } from "../../../comun/componentes/TipoOrden.tsx";
import { crearOrden, getOrden } from "../../infraestructura.ts";
import "./CrearOrden.css";
import { nuevaOrdenAlmacenVacia } from "./crear.ts";
import { metaNuevaOrden } from "./diseño.ts";

export const CrearOrden = ({
    publicar,
}: {
    publicar: EmitirEvento;
}) => {
    const { intentar } = useContext(ContextoError);

    const ordenInicial = useMemo(() => nuevaOrdenAlmacenVacia, []);

    const { modelo, uiProps, valido } = useModelo(
        metaNuevaOrden,
        ordenInicial
    );

    const crear = useCallback(
        async () => {
            const id = await intentar(() => crearOrden(modelo));
            const ordenCreada = await intentar(() => getOrden(id));
            publicar("orden_creada", ordenCreada);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [modelo, publicar]
    );

    const cancelar = useCallback(
        () => publicar("creacion_cancelada"),
        [publicar]
    );

    return (
        <QModal
            abierto={true}
            nombre="crearOrden"
            titulo="Nueva Orden"
            onCerrar={cancelar}
        >
            <div className="CrearOrden">
                <quimera-formulario>
                    <TipoOrden {...uiProps("tipoOrden")} />
                    <Almacen {...uiProps("almacenId")} />
                    <QInput label="Fecha" {...uiProps("fecha")} />
                    <QInput label="Abierta" {...uiProps("abierta")} />
                </quimera-formulario>

                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
