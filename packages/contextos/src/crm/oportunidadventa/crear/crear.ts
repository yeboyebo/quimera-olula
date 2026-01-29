import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaOportunidadVenta } from "./diseño.ts";

const onChangeNuevaOportunidad = (nueva_oportunidad: NuevaOportunidadVenta, campo: string, _: unknown, otros?: Record<string, unknown>) => {
    if (campo === "estado_id" && otros) {
        return {
            ...nueva_oportunidad,
            probabilidad: otros.probabilidad as number
        }
    }
    return nueva_oportunidad;
}

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: '',
    valor_defecto: false,
    probabilidad: 0,
    estado_id: undefined,
    importe: 0,
    cliente_id: '',
    contacto_id: '',
    fecha_cierre: new Date(),
    tarjeta_id: '',
};

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: NuevaOportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        nombre_cliente: { requerido: true, validacion: (oportunidad: NuevaOportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        valor_defecto: { requerido: true },
        importe: { requerido: false, tipo: "moneda" },
        probabilidad: { requerido: true, tipo: "numero" },
        estado_id: { requerido: true, tipo: "selector" },
        fecha_cierre: { requerido: true, tipo: "fecha" },
        cliente_id: { requerido: false, tipo: "autocompletar" },
        responsable_id: { requerido: true, tipo: "autocompletar" },
    },
    onChange: onChangeNuevaOportunidad
};