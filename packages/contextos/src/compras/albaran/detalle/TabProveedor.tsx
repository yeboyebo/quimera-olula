import { Proveedor } from "#/compras/comun/componentes/proveedor.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Albaran } from "../diseño.ts";
import "./TabProveedor.css";

export const TabProveedor = ({ form }: { form: HookModelo<Albaran> }) => {
    const { uiProps, modelo } = form;

    return (
        <div className="TabProveedor">
            <quimera-formulario>
                {/* El proveedor del albarán no se cambia desde aquí: el servidor lo
                    admite en cambios, pero solo mientras no está facturado. */}
                <Proveedor
                    nombre="proveedorId"
                    valor={modelo.proveedorId ?? ""}
                    descripcion={modelo.nombreProveedor}
                    deshabilitado={true}
                />
                <QInput label="Id Fiscal" {...uiProps("idFiscal")} />
                <QInput label="Nº proveedor" {...uiProps("numeroProveedor")} />
                <QDate label="Fecha" {...uiProps("fecha")} />
                <QInput label="Hora" {...uiProps("hora")} />
            </quimera-formulario>
        </div>
    );
};
