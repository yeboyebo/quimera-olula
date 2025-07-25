// import factoryGuanabana from "./presupuesto/vistas/TabDatos.tsx";

import { metaProveedor } from "./proveedor/dominio.ts";
// import { payloadPatchProveedor } from "./proveedor/infraestructura.ts";
import { payloadPatchProveedor, proveedorDesdeAPI } from "./proveedor/infraestructura_base.ts";
// import { TabDatosBase as ProveedorTabDatosBase } from "./proveedor/vistas/DetalleProveedor/TabDatos.tsx";
// import { metaTablaProveedor } from "./proveedor/vistas/metatabla_proveedor.ts";
// import { TabDatosBase as PresupuestoTabDatosBase } from "./presupuesto/vistas/DetallePresupuesto/TabDatosBase.tsx";

export class FactoryComprasBase {
    // static PresupuestoTabDatos = PresupuestoTabDatosBase
    // static ProveedorTabDatos = ProveedorTabDatosBase
    static proveedorDesdeAPI = proveedorDesdeAPI
    // static metaTablaProveedor = metaTablaProveedor
    static api_payloadPatchProveedor = payloadPatchProveedor
    static metaProveedor = metaProveedor
    // static PresupuestoTabDatos = TabDatosGua
}

