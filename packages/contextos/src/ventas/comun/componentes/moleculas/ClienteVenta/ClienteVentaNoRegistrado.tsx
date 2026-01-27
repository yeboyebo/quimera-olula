import { QInput } from "@olula/componentes/index.js";
import { HookModelo } from "@olula/lib/useModelo.js";
import { ModeloClienteVentaNoRegistrado } from "./cliente_venta.ts";

export const ClienteVentaNoRegistrado = <T extends ModeloClienteVentaNoRegistrado>({
    cliente,
}: {
    cliente: HookModelo<T>;
}) => {

    const { uiProps } = cliente

    return (
        <>
            <QInput label="Nombre"
                {...uiProps("nombre")}
            />
            <QInput label="DNI/NIF"
                {...uiProps("idFiscal")}
            />
            <QInput label="Direccion"
                {...uiProps("nombreVia")}
            />
            <QInput label="C.Postal"
                {...uiProps("codPostal")}
            />
        </>
    );
};