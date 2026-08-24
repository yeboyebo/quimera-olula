import { Proveedor } from "#/compras/comun/componentes/proveedor.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";
import "./TabProveedor.css";

export const TabProveedor = ({ form }: { form: HookModelo<Pedido> }) => {
    const { uiProps, modelo } = form;

    return (
        <div className="TabProveedor">
            <quimera-formulario>
                {/* El proveedor del pedido no se cambia desde aquí: el servidor lo
                    admite en cambios, pero solo mientras el pedido está pendiente. */}
                <Proveedor
                    nombre="proveedorId"
                    valor={modelo.proveedorId ?? ""}
                    descripcion={modelo.nombreProveedor}
                    deshabilitado={true}
                />
                <QInput label="Id Fiscal" {...uiProps("idFiscal")} />
                <QInput label="Nº proveedor" {...uiProps("numeroProveedor")} />
                <QDate label="Fecha" {...uiProps("fecha")} />
                <QDate label="Fecha entrada" {...uiProps("fechaEntrada")} />
            </quimera-formulario>
        </div>
    );
};
