import CRM_Urls from "../../crm/comun/urls.ts";
import Ventas_Urls from "../../ventas/comun/urls.ts";

class ApiUrls {
    // Auth
    static readonly AUTH_USUARIO = `/auth/usuario`;
    static readonly AUTH_TOKEN = `/auth/token`;
    static readonly AUTH_LOGIN = `/auth/login`;
    static readonly AUTH_REFRESCAR = `/auth/refrescar`;
    static readonly AUTH_LOGOUT = `/auth/logout`;
    static readonly AUTH_PERMISO = `/auth/permiso`;
    static readonly AUTH_REGLA = `/auth/regla`;
    static readonly AUTH_GRUPO = `/auth/grupo`;

    // Comun
    static readonly COMUN_GRUPO_IVA_NEGOCIO = `/comun/grupo_iva_negocio`;
    static readonly CACHE_COMUN = `/cache/comun`;
    static readonly COMUN_DIVISA = `/comun/divisa`;
    static readonly COMUN_EJERCICIO_FACTURACION = `/comun/ejercicio_facturacion`;
    static readonly COMUN_PAIS = `/comun/pais`;

    // Almacén
    static readonly ALMACEN_STOCK = `/almacen/stock`;
    static readonly ALMACEN_PRESUPUESTO = `/almacen/presupuesto`;

    // Tesorería
    static readonly TESORERIA_RECIBO_VENTA = `/tesoreria/recibo_venta`;

    // CRM
    static readonly CRM = new CRM_Urls();

    // Ventas
    static readonly VENTAS = new Ventas_Urls();
}

export default ApiUrls;

