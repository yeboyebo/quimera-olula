import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';
import { FactoryTpvOlula } from '#/tpv/factory.ts';

class FactoryComponentesDulceBebe {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
}

export class FactoryDulceBebe {
    Componentes = FactoryComponentesDulceBebe;
    TPV = FactoryTpvOlula;
}

export default FactoryDulceBebe;
