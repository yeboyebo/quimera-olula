import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { FactoryAlmacenNad } from './contextos/almacen/factory.ts';

export class FactoryNadia {
    TPV = FactoryTpvOlula;
    Almacen = FactoryAlmacenNad;
}

export default FactoryNadia;
