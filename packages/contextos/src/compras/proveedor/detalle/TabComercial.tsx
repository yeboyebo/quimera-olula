import { Divisa } from "#/comun/componentes/divisa.tsx";
import { FormaPago } from "#/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/comun/componentes/grupo_iva_negocio.tsx";
import { ContactoSelector } from "#/crm/comun/componentes/contacto.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Proveedor } from "../diseño.ts";

export const TabComercial = ({ form }: { form: HookModelo<Proveedor> }) => {
    const { uiProps } = form;

    return (
        <div className="TabComercial">
            <quimera-formulario>
                <QInput label="Serie" {...uiProps("serieId")} nombre="proveedor/serie_id" />
                <Divisa {...uiProps("divisaId")} nombre="proveedor/divisa_id" />
                <FormaPago {...uiProps("formaPagoId")} nombre="proveedor/forma_pago_id" />
                <GrupoIvaNegocio
                    {...uiProps("grupoIvaNegocioId")}
                    nombre="proveedor/grupo_iva_negocio_id"
                />
                <ContactoSelector
                    label="Contacto"
                    {...uiProps("contactoId")}
                    nombre="proveedor/contacto_id"
                />
                <QInput label="Subcuenta" {...uiProps("subcuentaCodigo")} />
                <QInput label="Id Subcuenta" {...uiProps("subcuentaId")} />
            </quimera-formulario>
        </div>
    );
};
