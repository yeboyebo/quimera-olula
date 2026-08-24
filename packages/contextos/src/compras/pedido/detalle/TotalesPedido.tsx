import { Venta } from "#/ventas/venta/diseño.ts";
import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";

/**
 * Los totales del pedido de compra son informativos, así que por ahora se
 * reutiliza TotalesVenta adaptando el modelo: la venta usa snake_case y compras
 * camelCase. Cuando compras tenga su propio componente, se sustituye aquí.
 *
 * editable a false para que no aparezca el botón de descuento de cabecera: el
 * pedido de compra no expone por_descuento en la lectura.
 */
export const TotalesPedido = ({ form }: { form: HookModelo<Pedido> }) => {
    const pedido = form.modelo;

    const modeloVenta = {
        ...form,
        editable: false,
        modelo: {
            ...pedido,
            divisa_id: pedido.divisaId,
            total_iva: pedido.totalIva,
            total_recargo: pedido.totalRecargo,
            total_irpf: pedido.totalIrpf,
            total_divisa_empresa: pedido.totalDivisaEmpresa,
            dtoPorcentual: 0,
            netoSinDto: pedido.neto,
        },
    } as unknown as HookModelo<Venta>;

    return <TotalesVenta modeloVenta={modeloVenta} publicar={async () => {}} />;
};
