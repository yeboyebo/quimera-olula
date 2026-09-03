import { Venta } from "#/ventas/venta/diseño.ts";
import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Albaran } from "../diseño.ts";

export const TotalesAlbaran = ({ form }: { form: HookModelo<Albaran> }) => {
    const albaran = form.modelo;

    const modeloVenta = {
        ...form,
        editable: false,
        modelo: {
            ...albaran,
            divisa_id: albaran.divisaId,
            total_iva: albaran.totalIva,
            total_recargo: albaran.totalRecargo,
            total_irpf: albaran.totalIrpf,
            total_divisa_empresa: albaran.totalDivisaEmpresa,
            dtoPorcentual: 0,
            netoSinDto: albaran.neto,
        },
    } as unknown as HookModelo<Venta>;

    return <TotalesVenta modeloVenta={modeloVenta} publicar={async () => {}} />;
};
