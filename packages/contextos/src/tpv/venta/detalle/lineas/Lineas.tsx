import { BorrarLineaVentaTpv } from "#/tpv/venta/borrar_linea/BorrarLineaVentaTpv.tsx";
import { CrearLineaVentaTpv } from "#/tpv/venta/crear_linea/CrearLineaVentaTpv.tsx";
import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { LineaFactura } from "#/ventas/factura/diseño.ts";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QBoton } from "@olula/componentes/index.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { useFocus } from "@olula/lib/useFocus.js";
import { CambiarLineaTpv } from "../../cambiar_linea/CambiarLineaTpv.tsx";
import { EstadoVentaTpv } from "../detalle.ts";
import "./Lineas.css";
import { LineasLista } from "./LineasLista.tsx";
export const Lineas = ({
        venta,
        lineas,
        estadoVenta,
        publicar
    }: {
        venta: VentaTpv;
        lineas: ListaEntidades<LineaFactura>;
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
                <div className="lineas-venta-tpv">
                    <QInput label='Barcode' nombre='barcode'
                        onEnterKeyUp={altaRapida}
                        ref={focus}
                    />
                    <div className="botones maestro-botones">
                        
                        {venta.total >= 0 && (
                            <QBoton onClick={() => publicar("devolucion_solicitada")}>
                                Devolución
                            </QBoton>
                        )}
                        
                        
                        <QBoton
                            onClick={() => publicar("alta_linea_solicitada")}
                        > Nueva
                        </QBoton>
                        
                        <QBoton
                            deshabilitado={!lineas.activo}
                            onClick={() => publicar("cambio_linea_solicitado")}
                        > Editar
                        </QBoton>
                        
                        <QBoton
                            deshabilitado={!lineas.activo}
                            onClick={() => publicar("baja_linea_solicitada")}
                        > Borrar
                        </QBoton>
                    </div>
                </div>
            )}
            <LineasLista
                lineas={lineas.lista}
                seleccionada={lineas.activo?.id}
                publicar={publicar}
            />
            {estadoVenta === "CREANDO_LINEA" &&
                <CrearLineaVentaTpv
                    venta={venta}
                    publicar={publicar}
                />
            }
            {lineas.activo && estadoVenta === "CAMBIANDO_LINEA" && (
                <CambiarLineaTpv
                    venta={venta}
                    publicar={publicar}
                    linea={lineas.activo}
                />
            )}
            {lineas.activo && estadoVenta === "BORRANDO_LINEA" && (
                <BorrarLineaVentaTpv
                    venta={venta}
                    publicar={publicar}
                    idLinea={lineas.activo.id}
                />
            )}
        </>
    );
};
