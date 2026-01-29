import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { HookModelo } from "@olula/lib/useModelo.js";
import { ModeloClienteFacturaRegistrado } from "./cliente_factura.ts";

export const ClienteFacturaRegistrado = <T extends ModeloClienteFacturaRegistrado>({
    cliente,
}: {
    cliente: HookModelo<T>;
}) => {

    const { uiProps } = cliente

    return (
        // <quimera-formulario>
            <Cliente
                {...uiProps("idCliente", "nombre")}
                nombre="cambiar_cliente_presupuesto"
            />
            /*{ <DirCliente
                clienteId={modelo.idCliente}
                {...uiProps("idDireccion")}
            /> }*/
        // </quimera-formulario>
    );
};