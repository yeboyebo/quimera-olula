import { Almacen } from "#/almacen/comun/componentes/Almacen.tsx";
import { Divisa } from "#/comun/componentes/divisa.tsx";
import { FormaPago } from "#/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/comun/componentes/grupo_iva_negocio.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";
import { descripcionRecibido } from "../dominio.ts";
import "./TabDatos.css";

export const TabDatos = ({ form }: { form: HookModelo<Pedido> }) => {
    const { uiProps, modelo } = form;

    return (
        <div className="TabDatos">
            <quimera-formulario>
                <QInput label="Código" {...uiProps("codigo")} />
                <QInput
                    label="Recibido"
                    {...uiProps("recibido")}
                    valor={descripcionRecibido(modelo)}
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
            </quimera-formulario>
        </div>
    );
};
