import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';

class FactoryComponentesDulceBebe {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
}

export class FactoryDulceBebe {
    Auth = FactoryAuthOlula;
    Componentes = FactoryComponentesDulceBebe;
    TPV = FactoryTpvOlula;
}

export default FactoryDulceBebe;
