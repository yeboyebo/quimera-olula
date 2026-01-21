import { MetaTabla } from "@olula/componentes/index.js";
import { Cliente } from "../diseño.ts";

export type EstadoMaestroCliente = "INICIAL" | "CREANDO_CLIENTE";

export type ContextoMaestroCliente = {
    estado: EstadoMaestroCliente;
    clientes: Cliente[];
    clienteActivo: Cliente | null;
    totalClientes: number;
};

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
