import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Albaran } from "../diseño.ts";

export const TabObservaciones = ({ form }: { form: HookModelo<Albaran> }) => (
    <div className="TabObservaciones">
        <quimera-formulario>
            <QTextArea label="Observaciones" {...form.uiProps("observaciones")} />
        </quimera-formulario>
    </div>
);
