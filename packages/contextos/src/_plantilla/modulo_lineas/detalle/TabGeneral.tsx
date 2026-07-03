import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.js";
import { ModLin } from "../diseño.js";
import "./TabGeneral.css";

export const TabGeneral = ({ form }: { form: HookModelo<ModLin> }) => {
    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            <quimera-formulario>
                <QInput label="Campo String" {...uiProps("campoString")} />
            </quimera-formulario>
        </div>
    );
};
