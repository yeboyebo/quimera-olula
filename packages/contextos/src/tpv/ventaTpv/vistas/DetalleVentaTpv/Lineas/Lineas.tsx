import { EstadoVentaTpv, VentaTpv } from "#/tpv/ventaTpv/diseño.ts";
import { LineaFactura } from "#/ventas/factura/diseño.ts";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { AltaLinea } from "./AltaLinea.tsx";
import { BajaLinea } from "./BajaLinea.tsx";
import { EdicionLinea } from "./EdicionLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
        venta,
        lineaActiva,
        estadoVenta,
        publicar
    }: {
        venta: VentaTpv;
        lineaActiva: LineaFactura | null;
        estadoVenta: EstadoVentaTpv;
        publicar: EmitirEvento
    }
) => {

    const alta_rapida_clicked = (barcode:string) => {
        publicar("alta_de_linea_por_barcode_lista", barcode)
    };

    return (
        <>
            {estadoVenta !== "EMITIDA" && (
                
                <div className="botones maestro-botones ">
                    {venta.total >= 0 && (
                        <QBoton onClick={() => publicar("devolucion_solicitada")}>
                            Devolución
                        </QBoton>
                    )}
                    <QInput label='Barcode' nombre='barcode'
                        onEnterKeyUp={(barcode)=>alta_rapida_clicked(barcode)}
                    />
                    
                    <QBoton
                        onClick={() => publicar("alta_linea_solicitada")}
                    > Nueva
                    </QBoton>
                    
                    <QBoton
                        deshabilitado={!lineaActiva}
                        onClick={() => publicar("cambio_linea_solicitado")}
                    > Editar
                    </QBoton>
                    
                    <QBoton
                        deshabilitado={!lineaActiva}
                        onClick={() => publicar("baja_linea_solicitada")}
                    > Borrar
                    </QBoton>
                </div>
            )}
            <LineasLista
                lineas={venta.lineas}
                seleccionada={lineaActiva?.id}
                publicar={publicar}
                idFactura={venta.id}
            />
            {estadoVenta === "CREANDO_LINEA" &&
                <AltaLinea
                    publicar={publicar}
                />
            }
            {lineaActiva && estadoVenta === "CAMBIANDO_LINEA" && (
                <EdicionLinea
                    publicar={publicar}
                    linea={lineaActiva}
                />
            )}
            {lineaActiva && estadoVenta === "BORRANDO_LINEA" && (
                <BajaLinea
                    publicar={publicar}
                    idLinea={lineaActiva.id}
                />
            )}
        </>
    );
};
