import { Historias } from '@quimera/comp/historias/historias.tsx';
import { RouterFactoryAlmacenOlula } from '@quimera/ctx/almacen/router_factory.ts';
import { MaestroConDetalleGruposReglas } from '@quimera/ctx/auth/grupos/vistas/MaestroConDetalleGruposReglas.tsx';
import { Login } from '@quimera/ctx/auth/login/vistas/Login';
import { RouterFactoryAuthOlula } from '@quimera/ctx/auth/router_factory.ts';
import { Logout } from '@quimera/ctx/auth/usuario/vistas/Logout';
import { Perfil } from '@quimera/ctx/auth/usuario/vistas/Perfil';
import { RouterFactoryCrmOlula } from '@quimera/ctx/crm/router_factory.ts';
import { RouterFactoryVentasOlula } from '@quimera/ctx/ventas/router_factory.ts';
import { Indice } from '@quimera/lib/Indice.tsx';

export class RouterFactoryOlula {
    Inicio = { router: { "": Indice } };
    Auth = RouterFactoryAuthOlula;
    Ventas = RouterFactoryVentasOlula;
    Almacen = RouterFactoryAlmacenOlula;
    Crm = RouterFactoryCrmOlula;
    Otros = {
        router: {
            "login": Login,
            "logout": Logout,
            "usuario/perfil": Perfil,
            "administracion/grupos": MaestroConDetalleGruposReglas,
            "docs/componentes": Historias,
        }
    }
}

export default RouterFactoryOlula;