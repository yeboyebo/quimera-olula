import { LineaPedido } from "#/ventas/pedido/diseño.ts";
import { Entidad } from "@olula/lib/diseño.js";

export interface PaletLineaPedidoNrj extends Entidad {
    id: string;
    cantidadEnvases: number;
}

export interface LineaPedidoNrj extends LineaPedido {
    idVariedad: string;
    idEnvase: string;
    idTipoPalet: string;
    idMarca: string;
    idCalibre: string;
    categoria: string;
    categoriaFormateada: string;
    descVariedad: string;
    descMarca: string;
    descCalibre: string;
    descPalet: string;
    descEnvase: string;
    cantidadEnvasesAsignados: number;
    cantidadEnvases: number;
    cantidadPalet: number;
    envasesPorPalet: number;
    palets: PaletLineaPedidoNrj[];
}

// type NuevaLineaPedidoNrj = {
//     cantidadEnvases: number;
//     idVariedad: string;
// };

// export type PostLineaNrj = (id: string, linea: NuevaLineaPedidoNrj) => Promise<string>;
