import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import "./TabGeneral.css";

interface TabGeneralProps {
    form: FormModelo;
}

export const TabGeneral = ({ form }: TabGeneralProps) => {

    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            <quimera-formulario>
                <QInput label="Nombre" {...uiProps("nombre")} soloLectura />
                <QInput label="Nombre de pila" {...uiProps("nombre_pila")} />
                <QInput label="Apellidos" {...uiProps("apellidos")} />
                <QInput label="Id Fiscal" {...uiProps("id_fiscal")} />
                <QInput label="% Comisión" {...uiProps("por_comision")} />
                <QInput label="Usuario" {...uiProps("usuario_id")} soloLectura />
            </quimera-formulario>
        </div>
    );
};
