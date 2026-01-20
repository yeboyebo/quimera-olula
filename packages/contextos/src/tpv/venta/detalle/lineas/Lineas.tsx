import { BorrarLineaVentaTpv } from "#/tpv/venta/borrar_linea/BorrarLineaVentaTpv.tsx";
import { CrearLineaVentaTpv } from "#/tpv/venta/crear_linea/CrearLineaVentaTpv.tsx";
import { EstadoVentaTpv, VentaTpv } from "#/tpv/venta/diseño.ts";
import { LineaFactura } from "#/ventas/factura/diseño.ts";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { CambiarLineaTpv } from "../../cambiar_linea/CambiarLineaTpv.tsx";
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

    const altaRapida = (barcode:string) => {
        publicar("alta_de_linea_por_barcode_lista", barcode);
        if (focus?.current) {
            const control = focus.current as HTMLInputElement;
            control.value = '';
        }
        
    };

    const focus = useFocus();

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
                        onEnterKeyUp={altaRapida}
                        ref={focus}
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
            />
            {estadoVenta === "CREANDO_LINEA" &&
                <CrearLineaVentaTpv
                    venta={venta}
                    publicar={publicar}
                />
            }
            {lineaActiva && estadoVenta === "CAMBIANDO_LINEA" && (
                <CambiarLineaTpv
                    venta={venta}
                    publicar={publicar}
                    linea={lineaActiva}
                />
            )}
            {lineaActiva && estadoVenta === "BORRANDO_LINEA" && (
                <BorrarLineaVentaTpv
                    venta={venta}
                    publicar={publicar}
                    idLinea={lineaActiva.id}
                />
            )}
        </>
    );
};
