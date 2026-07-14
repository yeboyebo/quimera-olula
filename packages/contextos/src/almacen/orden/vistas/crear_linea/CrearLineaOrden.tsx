import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { OrdenAlmacen } from "../../diseño.ts";
import { postLineasOrden } from "../../infraestructura.ts";
import { nuevaLineaOrdenVacia } from "./crear_linea.ts";
import { metaNuevaLineaOrden } from "./diseño.ts";

export const CrearLineaOrden = ({
    publicar,
    orden,
}: {
    publicar: EmitirEvento;
    orden: OrdenAlmacen;
}) => {
    const { modelo, uiProps, valido } = useModelo(
        metaNuevaLineaOrden,
        nuevaLineaOrdenVacia
    );

    const crear_ = useCallback(async () => {
        await postLineasOrden(orden.id, [
            {
                sku: modelo.sku,
                cantidadPrevista: modelo.cantidadPrevista,
                loteId: null,
                ubicacionOrigenId: null,
                cajaOrigenId: null,
                ubicacionDestinoId: null,
                cajaDestinoId: null,
            },
        ]);
        publicar("linea_creada");
    }, [modelo, publicar, orden.id]);

    const cancelar_ = useCallback(() => {
        publicar("alta_de_linea_cancelada");
    }, [publicar]);

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="crearLineaOrden"
            titulo="Nueva línea"
            onCerrar={cancelar}
        >
            <div className="CrearLineaOrden">
                <quimera-formulario>
                    <QInput label="SKU" {...uiProps("sku")} />
                    <QInput label="Cantidad prevista" {...uiProps("cantidadPrevista")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Guardar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
