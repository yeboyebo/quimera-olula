import { menuVentas } from "./menu.ts";
import { CrearLineaNrj } from "./pedido/crear_linea/CrearLinea.tsx";
import { DetallePedidoNrj } from "./pedido/detalle/DetallePedido.tsx";
import { LineasListaNrj } from "./pedido/detalle/Lineas/LineasLista.tsx";
import { EditarLineaNrj } from "./pedido/editar_linea/EditarLinea.tsx";
import { ventasPedidoInfra } from "./pedido/infraestructura.ts";
import { getMetaTablaPedidoNrj } from "./pedido/maestro/metatabla_pedido.tsx";

export class FactoryVentasNrj {

    static menu = menuVentas

    static pedido_detalle_lineas_LineasLista = LineasListaNrj
    static pedido_DetallePedido = DetallePedidoNrj
    static pedido_CrearLinea = CrearLineaNrj
    static pedido_EditarLinea = EditarLineaNrj
    static pedido_infraestructura = ventasPedidoInfra
    static metaTablaPedido = getMetaTablaPedidoNrj
}
