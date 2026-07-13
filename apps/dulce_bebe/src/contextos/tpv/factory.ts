import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { BotonNuevaVentaDulceBebe } from './venta/crear_venta/CrearVenta.tsx';

export class FactoryTpvDulceBebe extends FactoryTpvOlula {
    static override venta_BotonNuevaVenta = BotonNuevaVentaDulceBebe
}
