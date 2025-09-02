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

    // Almacén
    static readonly ALMACEN_STOCK = `/almacen/stock`;
    static readonly ALMACEN_PRESUPUESTO = `/almacen/presupuesto`;

    // Tesorería
    static readonly TESORERIA_RECIBO_VENTA = `/tesoreria/recibo_venta`;

    // CRM
    static readonly CRM_ESTADO_LEAD = `/crm/estado_lead`;
    static readonly CRM_ESTADO_OPORTUNIDAD = `/crm/estado_oportunidad_venta`;
    static readonly CRM_INCIDENCIA = `/crm/incidencia`;
    static readonly CRM_CLIENTE = `/crm/cliente`;
    static readonly CRM_OPORTUNIDAD_VENTA = `/crm/oportunidad_venta`;
    static readonly CRM_CONTACTO = `/crm/contacto`;
    static readonly CRM_LEAD = `/crm/lead`;
    static readonly CRM_ACCION = `/crm/accion`;
    static readonly CRM_FUENTE_LEAD = `/crm/fuente_lead`;

    // Ventas
    static readonly VENTAS_ALBARAN = `/ventas/albaran`;
    static readonly VENTAS_AGENTE = `/ventas/agente`;
    static readonly VENTAS_PRESUPUESTO = `/ventas/presupuesto`;
    static readonly VENTAS_CLIENTE = `/ventas/cliente`;
    static readonly VENTAS_PEDIDO = `/ventas/pedido`;
    static readonly VENTAS_FACTURA = `/ventas/factura`;
    static readonly VENTAS_ARTICULO = `/ventas/articulo`;
}

export default ApiUrls;

