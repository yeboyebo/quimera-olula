import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Mostrar } from "@olula/componentes/moleculas/Mostrar.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { NuevaLineaOrdenAlmacen } from "../../diseño.ts";
import { lineaOrdenVacia, metaNuevaLinea } from "../../dominio.ts";
import { crearLineasOrden } from "../../infraestructura.ts";

export const CrearLineaOrden = ({
    publicar = async () => {},
    activo = false,
    ordenId,
}: {
    publicar?: ProcesarEvento;
    activo?: boolean;
    ordenId: string;
}) => {
    const linea = useModelo(
        metaNuevaLinea,
        lineaOrdenVacia() as NuevaLineaOrdenAlmacen
    );

    const cancelar = () => {
        linea.init();
        publicar("creacion_cancelada");
    };

    return (
        <Mostrar modo="modal" activo={activo} onCerrar={cancelar}>
            <FormCrearLineaOrden
                publicar={publicar}
                linea={linea}
                ordenId={ordenId}
            />
        </Mostrar>
    );
};

const FormCrearLineaOrden = ({
    publicar = async () => {},
    linea,
    ordenId,
}: {
    publicar?: ProcesarEvento;
    linea: HookModelo<NuevaLineaOrdenAlmacen>;
    ordenId: string;
}) => {
    const { intentar } = useContext(ContextoError);

    const crear = async () => {
        const modelo = { ...linea.modelo };
        await intentar(() => crearLineasOrden(ordenId, [modelo]));
        publicar("linea_creada", { ...modelo, id: crypto.randomUUID() });
        linea.init();
    };

    const cancelar = () => {
        publicar("creacion_cancelada");
        linea.init();
    };

    return (
        <div className="CrearLineaOrden">
            <h2>Nueva línea</h2>
            <quimera-formulario>
                <QInput label="SKU" {...linea.uiProps("sku")} />
                <QInput label="Cantidad prevista" {...linea.uiProps("cantidadPrevista")} />
            </quimera-formulario>
            <div className="botones">
                <QBoton onClick={crear} deshabilitado={!linea.valido}>
                    Guardar
                </QBoton>
                <QBoton onClick={cancelar} variante="texto">
                    Cancelar
                </QBoton>
            </div>
        </div>
    );
};
