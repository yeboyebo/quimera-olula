import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { Divisa } from "#/comun/componentes/divisa.tsx";
import { FormaPago } from "#/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/comun/componentes/grupo_iva_negocio.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Factura } from "../diseño.ts";
import { descripcionOrigenFactura } from "../dominio.ts";
import "./TabDatos.css";

export const TabDatos = ({ form }: { form: HookModelo<Factura> }) => {
    const { uiProps, modelo } = form;

    return (
        <div className="TabDatos">
            <quimera-formulario>
                <QInput label="Código" {...uiProps("codigo")} />
                <QInput
                    label="Origen"
                    {...uiProps("automatica")}
                    valor={descripcionOrigenFactura(modelo)}
                    deshabilitado={true}
                />
                <Almacen {...uiProps("almacenId", "nombreAlmacen")} nombre="almacenId" />
                <Divisa {...uiProps("divisaId")} nombre="divisaId" />
                <QInput label="T. Conversión" {...uiProps("tasaConversion")} />
                <FormaPago
                    {...uiProps("formaPagoId", "nombreFormaPago")}
                    nombre="formaPagoId"
                />
                <GrupoIvaNegocio
                    {...uiProps("grupoIvaNegocioId")}
                    nombre="grupoIvaNegocioId"
                />
                <QInput label="Rectifica a" {...uiProps("codigoRectificativa")} />
                <QInput label="Asiento" {...uiProps("asientoId")} />
                <QCheckbox label="De abono" {...uiProps("deAbono")} />
                <QCheckbox label="Servicios" {...uiProps("servicios")} />
                <QCheckbox label="No generar asiento" {...uiProps("noGenerarAsiento")} />
            </quimera-formulario>
        </div>
    );
};
