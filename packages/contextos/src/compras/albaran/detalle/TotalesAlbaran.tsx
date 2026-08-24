import { Venta } from "#/ventas/venta/diseño.ts";
import { TotalesVenta } from "#/ventas/venta/vistas/TotalesVenta.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Albaran } from "../diseño.ts";

/**
 * Los totales del albarán de compra son informativos, así que por ahora se
 * reutiliza TotalesVenta adaptando el modelo: la venta usa snake_case y compras
 * camelCase. Cuando compras tenga su propio componente, se sustituye aquí.
 *
 * editable a false para que no aparezca el botón de descuento de cabecera: el
 * albarán de compra no expone por_descuento en la lectura.
 */
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
