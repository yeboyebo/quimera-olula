// Dominio de maestro (importar desde raíz)
import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ContextoMaestroCliente, EstadoMaestroCliente } from "./diseño.ts";

export type ProcesarMaestroCliente = ProcesarContexto<EstadoMaestroCliente, ContextoMaestroCliente>;

export {
    activarCliente,
    cambiarClienteEnLista,
    desactivarClienteActivo,
    incluirClienteEnLista,
    quitarClienteDeLista,
    recargarClientes
} from "../dominio.ts";

