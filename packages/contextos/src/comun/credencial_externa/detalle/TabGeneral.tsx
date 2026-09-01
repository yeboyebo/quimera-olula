import { QInput } from "@olula/componentes/index.js";
import { FormModelo } from "@olula/lib/dominio.js";
import "./TabGeneral.css";

interface TabGeneralProps {
    form: FormModelo;
}

/**
 * Tab General: nombre y proveedor (editables, auto-guardado). `tipoAuth` y
 * el secreto no aparecen aquí — ver TabInformacion (solo lectura) y la
 * acción "Rotar credencial" respectivamente.
 */
export const TabGeneral = ({ form }: TabGeneralProps) => {
    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            <quimera-formulario>
                <QInput label="Nombre" {...uiProps("nombre")} />
                <QInput label="Proveedor" {...uiProps("proveedor")} />
            </quimera-formulario>
        </div>
    );
};
