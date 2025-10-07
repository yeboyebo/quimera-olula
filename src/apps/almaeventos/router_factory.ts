import RouterFactoryOlula from '../olula/router_factory.ts';
import { RouterFactoryEventosAlma } from './contextos/eventos/router_factory.ts';


export class RouterFactoryAlmaEventos extends RouterFactoryOlula {
    Eventos = RouterFactoryEventosAlma;
}

export default RouterFactoryAlmaEventos;