import { Proveedor } from "#/compras/comun/componentes/proveedor.tsx";
import { BotonCambiar } from "#/ventas/comun/componentes/BotonCambiar.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Factura } from "../diseño.ts";
import { facturaEditable } from "../dominio.ts";
import "./TabProveedor.css";

export const TabProveedor = ({
    form,
    publicar,
}: {
    form: HookModelo<Factura>;
    publicar: EmitirEvento;
}) => {
    const { uiProps, modelo } = form;
    const puedeCambiarProveedor = facturaEditable(modelo);

    return (
        <div className="TabProveedor">
            <quimera-formulario>
                <Proveedor
                    nombre="proveedorId"
                    valor={modelo.proveedorId ?? ""}
                    descripcion={modelo.nombreProveedor}
                    deshabilitado={true}
                />
                <QInput label="Id Fiscal" {...uiProps("idFiscal")} />
                {puedeCambiarProveedor && (
                    <div className="TabProveedor-accion">
                        <BotonCambiar
                            titulo="Cambiar proveedor"
                            onClick={() => publicar("cambio_proveedor_solicitado")}
                        />
                    </div>
                )}
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
