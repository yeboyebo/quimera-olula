import { Venta } from "#/ventas/venta/diseño.ts";
import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Factura } from "../diseño.ts";

export const TotalesFactura = ({ form }: { form: HookModelo<Factura> }) => {
    const factura = form.modelo;

    const modeloVenta = {
        ...form,
        editable: false,
        modelo: {
            ...factura,
            divisa_id: factura.divisaId,
            total_iva: factura.totalIva,
            total_recargo: factura.totalRecargo,
            total_irpf: factura.totalIrpf,
            total_divisa_empresa: factura.totalDivisaEmpresa,
            dtoPorcentual: 0,
            netoSinDto: factura.neto,
        },
    } as unknown as HookModelo<Venta>;

    return <TotalesVenta modeloVenta={modeloVenta} publicar={async () => {}} />;
};
