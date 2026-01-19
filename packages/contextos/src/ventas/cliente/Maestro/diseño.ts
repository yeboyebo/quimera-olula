import { MetaTabla } from "@olula/componentes/index.js";
import { Cliente, ContextoMaestroCliente, EstadoMaestroCliente } from "../diseño.ts";

// Re-export for convenience
export type { ContextoMaestroCliente, EstadoMaestroCliente };

export const metaTablaCliente: MetaTabla<Cliente> = [
    { id: "id", cabecera: "Id" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "email", cabecera: "Email" },
    { id: "telefono1", cabecera: "Teléfono", tipo: "texto" },
    {
        id: "id_fiscal",
        cabecera: "Id Fiscal",
        render: (entidad: Cliente) =>
            `${entidad.tipo_id_fiscal}: ${entidad.id_fiscal}`,
    },
];
