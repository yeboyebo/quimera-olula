import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoPresupuesto, NuevoPresupuestoClienteNoRegistrado } from "../diseño.ts";

export const nuevoPresupuestoVacio: NuevoPresupuesto = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
};

export const metaNuevoPresupuesto: MetaModelo<NuevoPresupuesto> = {
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
        empresa_id: { requerido: true },
    }
};

export const nuevoPresupuestoClienteNoRegistradoVacio: NuevoPresupuestoClienteNoRegistrado = {
    empresa_id: "1",
    nombre_cliente: "",
    id_fiscal: "",
    nombre_via: "",
    tipo_via: "",
    numero: "",
    otros: "",
    cod_postal: "",
    ciudad: "",
    provincia_id: null,
    provincia: "",
    pais_id: "",
    apartado: "",
    telefono: "",
};

export const metaNuevoPresupuestoClienteNoRegistrado: MetaModelo<NuevoPresupuestoClienteNoRegistrado> = {
    campos: {
        cliente_nombre: { requerido: true },
        direccion_nombre_via: { requerido: true },
        empresa_id: { requerido: true },
    }
};

