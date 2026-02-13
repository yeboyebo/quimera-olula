import { FactoryEventosAlma } from './contextos/eventos/factory.ts';
import { FactoryVentasNrj } from './contextos/ventas/factory.ts';


export class FactoryNrj {
    Eventos = FactoryEventosAlma;
    Ventas = FactoryVentasNrj;
}

export default FactoryNrj;