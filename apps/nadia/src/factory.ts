import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';
import { FactoryAlmacenNad } from './contextos/almacen/factory.ts';

class FactoryComponentesNadia {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
}

export class FactoryNadia {
    Componentes = FactoryComponentesNadia;
    Auth = FactoryAuthOlula;
    TPV = FactoryTpvOlula;
    Almacen = FactoryAlmacenNad;
}

export default FactoryNadia;
