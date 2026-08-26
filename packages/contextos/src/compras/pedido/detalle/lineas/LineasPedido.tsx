import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { BorrarLineaPedido } from "../../borrar_linea/BorrarLineaPedido.tsx";
import { CambiarLineaPedido } from "../../cambiar_linea/CambiarLineaPedido.tsx";
import { CrearLineaPedido } from "../../crear_linea/CrearLineaPedido.tsx";
import { LineaPedido, Pedido } from "../../diseño.ts";
import { pedidoPendiente } from "../../dominio.ts";
import { EstadoDetallePedido } from "../diseño.ts";
import { LineasLista } from "./LineasLista.tsx";

export const LineasPedido = ({
    pedido,
    lineas,
    estado,
    publicar,
}: {
    pedido: Pedido;
    lineas: ListaEntidades<LineaPedido>;
    estado: EstadoDetallePedido;
    publicar: EmitirEvento;
}) => {
    const activa = lineas.activo;
    const pendiente = pedidoPendiente(pedido);

    return (
        <>
            <div className="botones maestro-botones">
                <QBoton
                    onClick={() => publicar("alta_linea_solicitada")}
                    deshabilitado={!pendiente}
                >
                    Nueva línea
                </QBoton>
                <QBoton
                    onClick={() => publicar("cambio_linea_solicitado")}
                    deshabilitado={!activa || !pendiente}
                >
                    Editar
                </QBoton>
                <QBoton
                    onClick={() => publicar("baja_linea_solicitada")}
                    deshabilitado={!activa || !pendiente}
                    advertencia
                >
                    Borrar
                </QBoton>
                <QBoton
                    onClick={() => publicar("cierre_linea_solicitado")}
                    deshabilitado={!activa}
                >
                    {activa?.cerrada ? "Reabrir línea" : "Cerrar línea"}
                </QBoton>
            </div>
            <LineasLista
                lineas={lineas.lista}
                divisa={pedido.divisaId}
                seleccionada={activa?.id}
                publicar={publicar}
            />
            {estado === "CREANDO_LINEA" && (
                <CrearLineaPedido pedido={pedido} publicar={publicar} />
            )}
            {activa && estado === "CAMBIANDO_LINEA" && (
                <CambiarLineaPedido pedido={pedido} linea={activa} publicar={publicar} />
            )}
            {activa && estado === "BORRANDO_LINEA" && (
                <BorrarLineaPedido pedido={pedido} linea={activa} publicar={publicar} />
            )}
        </>
    );
};
