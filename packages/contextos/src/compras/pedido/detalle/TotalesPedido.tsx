import { Venta } from "#/ventas/venta/diseño.ts";
import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";

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
