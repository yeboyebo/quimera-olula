import { Venta } from "#/ventas/venta/diseño.ts";
import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";

export type DocumentoConTotales = {
    divisaId: string;
    neto: number;
    totalIva: number;
    totalRecargo: number;
    totalIrpf: number;
    totalDivisaEmpresa: number;
};

export const TotalesDocumento = <T extends DocumentoConTotales>({
    form,
}: {
    form: HookModelo<T>;
}) => {
    const documento = form.modelo;

    const modeloVenta = {
        ...form,
        editable: false,
        modelo: {
            ...documento,
            divisa_id: documento.divisaId,
            total_iva: documento.totalIva,
            total_recargo: documento.totalRecargo,
            total_irpf: documento.totalIrpf,
            total_divisa_empresa: documento.totalDivisaEmpresa,
            dtoPorcentual: 0,
            netoSinDto: documento.neto,
        },
    } as unknown as HookModelo<Venta>;

    return <TotalesVenta modeloVenta={modeloVenta} publicar={async () => {}} />;
};
