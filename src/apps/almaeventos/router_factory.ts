// import RouterFactoryOlula from '../olula/router_factory.ts';
import { FondoInicio } from '@quimera/lib/FondoInicio.tsx';
import { RouterFactoryEventosAlma } from './contextos/eventos/router_factory.ts';


// export class RouterFactoryAlmaEventos extends RouterFactoryOlula {
//     Eventos = RouterFactoryEventosAlma;
// }

// export class RouterFactoryOlula {
//     Inicio = { router: { "": FondoInicio } };
//     Ventas = RouterFactoryVentasOlula;
//     Almacen = RouterFactoryAlmacenOlula;
//     Crm = RouterFactoryCrmOlula;
//     Otros = {
//         router: {
//             "login": Login,
//             "logout": Logout,
//             "usuario/perfil": Perfil,
//             "administracion/grupos": MaestroConDetalleGruposReglas,
//             "docs/componentes": Historias,
//         }
//     }
// }

export class RouterFactoryAlmaEventos {
    Eventos = RouterFactoryEventosAlma;
    Inicio = { router: { "": FondoInicio } };
}


export default RouterFactoryAlmaEventos;