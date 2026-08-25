import { Proveedor } from "#/compras/comun/componentes/proveedor.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Factura } from "../diseño.ts";
import "./TabProveedor.css";

export const TabProveedor = ({ form }: { form: HookModelo<Factura> }) => {
    const { uiProps, modelo } = form;

    return (
        <div className="TabProveedor">
            <quimera-formulario>
                {/* El proveedor de la factura no se cambia desde aquí: el servidor lo
                    admite en cambios, pero solo mientras la factura está abierta. */}
                <Proveedor
                    nombre="proveedorId"
                    valor={modelo.proveedorId ?? ""}
                    descripcion={modelo.nombreProveedor}
                    deshabilitado={true}
                />
                <QInput label="Id Fiscal" {...uiProps("idFiscal")} />
                <QInput
                    label="Nº factura del proveedor"
                    {...uiProps("numeroProveedor")}
                />
                <QDate label="Fecha" {...uiProps("fecha")} />
                <QInput label="Hora" {...uiProps("hora")} />
            </quimera-formulario>
        </div>
    );
};
