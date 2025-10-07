import { Historias } from '@quimera/comp/historias/historias.tsx';
import { MaestroConDetalleGruposReglas } from '@quimera/ctx/administracion/vistas/MaestroConDetalleGruposReglas.tsx';
import { RouterFactoryAlmacenOlula } from '@quimera/ctx/almacen/router_factory.ts';
import { RouterFactoryCrmOlula } from '@quimera/ctx/crm/router_factory.ts';
import { Login } from '@quimera/ctx/usuarios/login/vistas/Login.tsx';
import { Logout } from '@quimera/ctx/usuarios/usuario/vistas/Logout.tsx';
import { Perfil } from '@quimera/ctx/usuarios/usuario/vistas/Perfil.tsx';
import { RouterFactoryVentasOlula } from '@quimera/ctx/ventas/router_factory.ts';
// import { Indice } from '@quimera/lib/Indice.tsx';
import { FondoInicio } from '@quimera/lib/FondoInicio.tsx';

export class RouterFactoryOlula {
    Inicio = { router: { "": FondoInicio } };
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