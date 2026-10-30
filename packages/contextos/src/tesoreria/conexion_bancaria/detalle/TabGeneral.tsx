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
                <QInput label="Institución" {...uiProps("institucionNombre")} />
                <QInput label="Estado" {...uiProps("estado")} />
                <QInput label="Última sincronización" {...uiProps("ultimaSincronizacion")} />
                <QInput label="Último error" {...uiProps("ultimoError")} />
                <QInput label="Conectado el" {...uiProps("creadoEn")} />
            </quimera-formulario>
        </div>
    );
};
