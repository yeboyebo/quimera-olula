import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';
import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { FactoryAlmacenNad } from './contextos/almacen/factory.ts';

class FactoryComponentesNadia {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
}

export class FactoryNadia {
    Componentes = FactoryComponentesNadia;
    TPV = FactoryTpvOlula;
    Almacen = FactoryAlmacenNad;
}

export default FactoryNadia;
