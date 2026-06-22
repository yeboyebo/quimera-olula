import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { Almacen } from "../../comun/componentes/Almacen.tsx";
import { TipoOrden } from "../../comun/componentes/TipoOrden.tsx";
import { NuevaOrdenAlmacen } from "../diseño.ts";
import { metaNuevaOrden, nuevaOrdenVacia } from "../dominio.ts";
import { crearOrden, getOrden } from "../infraestructura.ts";

export const CrearOrden = ({
    publicar = async () => {},
    activo = false,
}: {
    publicar?: ProcesarEvento;
    activo: boolean;
}) => {
    const orden = useModelo(metaNuevaOrden, nuevaOrdenVacia);

    const cancelar = () => {
        orden.init();
        publicar("creacion_cancelada");
    };

    return (
        <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
            <FormCrearOrden publicar={publicar} orden={orden} />
        </Mostrar>
    );
};

const FormCrearOrden = ({
    publicar = async () => {},
    orden,
}: {
    publicar?: ProcesarEvento;
    orden: HookModelo<NuevaOrdenAlmacen>;
}) => {
    const { intentar } = useContext(ContextoError);

    const crear = async () => {
        const id = await intentar(() => crearOrden(orden.modelo));
        const ordenCreada = await intentar(() => getOrden(id));
        publicar("orden_creada", ordenCreada);
        orden.init();
    };

    const cancelar = () => {
        orden.init();
        publicar("creacion_cancelada");
    };

    return (
        <div className="CrearOrden">
            <h2>Nueva Orden</h2>
            <quimera-formulario>
                <TipoOrden {...orden.uiProps("tipoOrden")} />
                <Almacen {...orden.uiProps("almacenId")} />
                <QDate label="Fecha" {...orden.uiProps("fecha")} />
            </quimera-formulario>
            <div className="botones">
                <QBoton onClick={crear} deshabilitado={!orden.valido}>
                    Guardar
                </QBoton>
                <QBoton onClick={cancelar} variante="texto">
                    Cancelar
                </QBoton>
            </div>
        </div>
    );
};
