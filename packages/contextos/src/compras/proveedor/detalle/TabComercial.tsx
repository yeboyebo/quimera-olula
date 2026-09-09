import { Divisa } from "#/comun/componentes/divisa.tsx";
import { FormaPago } from "#/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/comun/componentes/grupo_iva_negocio.tsx";
import { ContactoSelector } from "#/crm/comun/componentes/contacto.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Proveedor } from "../diseño.ts";
import "./TabComercial.css";

export const TabComercial = ({ form }: { form: HookModelo<Proveedor> }) => {
    const { uiProps } = form;

    return (
        <div className="TabComercial">
            <quimera-formulario>
                <QInput label="Serie" {...uiProps("serieId")} nombre="proveedor/serieId" />
                <Divisa {...uiProps("divisaId")} nombre="proveedor/divisaId" />
                <FormaPago {...uiProps("formaPagoId")} nombre="proveedor/formaPagoId" />
                <GrupoIvaNegocio
                    {...uiProps("grupoIvaNegocioId")}
                    nombre="proveedor/grupoIvaNegocioId"
                />
                <ContactoSelector
                    label="Contacto"
                    {...uiProps("contactoId")}
                    nombre="proveedor/contactoId"
                />
                <QInput label="Subcuenta" {...uiProps("subcuentaCodigo")} />
                <QInput label="Id Subcuenta" {...uiProps("subcuentaId")} />
            </quimera-formulario>
        </div>
    );
};
