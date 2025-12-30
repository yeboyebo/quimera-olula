import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QBoton } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import {
    getSeleccionada
} from "@olula/lib/entidad.ts";
import { useContext } from "react";
import { postLineaPorBarcode } from "../../../infraestructura.ts";
import { AltaLinea } from "./AltaLinea.tsx";
import { BajaLinea } from "./BajaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

import { LineaFactura } from "#/ventas/factura/diseño.ts";
import { EmitirEvento, ListaSeleccionable } from "@olula/lib/diseño.js";
import { EstadoVentaTpv } from "../DetalleVentaTpv.tsx";

export const Lineas = ({
        facturaId,
        lineas,
        estadoVenta,
        publicar
    }: {
        facturaId: string;
        estadoVenta: EstadoVentaTpv;
        lineas: ListaSeleccionable<LineaFactura>;
        publicar: EmitirEvento
    }
) => {

    const { intentar } = useContext(ContextoError);

    const seleccionada = getSeleccionada(lineas);

    const alta_rapida_clicked = async (barcode:string) => {
        await intentar(() => postLineaPorBarcode(facturaId, {
            barcode: barcode,
            cantidad: 1
        }));
        publicar("linea_cambiada")
    };

    return (
        <>
        {estadoVenta !== "EMITIDA" && (
            <div className="botones maestro-botones ">
            <QInput label='Barcode' nombre='barcode' onEnterKeyUp={
                (barcode)=>alta_rapida_clicked(barcode)
                }>

            </QInput>
            <QBoton onClick={() => publicar("alta_linea_solicitada")}>Nueva</QBoton>
            <QBoton
                deshabilitado={!seleccionada}
                onClick={() => publicar("cambio_linea_solicitado")}
            >
                Editar
            </QBoton>
            <QBoton
                deshabilitado={!seleccionada}
                onClick={() => publicar("baja_linea_solicitada")}
            >
                Borrar
            </QBoton>
            </div>
        )}
        <LineasLista
            lineas={lineas.lista}
            seleccionada={seleccionada?.id}
            publicar={publicar}
            idFactura={facturaId}
        />
        <AltaLinea
            publicar={publicar}
            activo={estadoVenta === "CREANDO_LINEA"}
            idFactura={facturaId}
        />

        {seleccionada && (
            <EdicionLinea
                publicar={publicar}
                activo={estadoVenta === "CAMBIANDO_LINEA" && seleccionada !== null}
                lineaSeleccionada={seleccionada}
                idFactura={facturaId}
            />
        )}
        <BajaLinea
            publicar={publicar}
            activo={estadoVenta === "BORRANDO_LINEA"}
            idLinea={seleccionada?.id}
            idFactura={facturaId}
        />
        </>
    );
};
