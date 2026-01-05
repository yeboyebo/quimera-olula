import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { VentaTpv } from "../../diseño.ts";
import "./TabObservaciones.css";

interface TabClienteProps {
  venta: HookModelo<VentaTpv>;
}

export const TabObservaciones = ({ venta }: TabClienteProps) => {

    const { uiProps } = venta;

    return (
        <>
            <quimera-formulario>
                
                <QTextArea
                    label="Observaciones"
                    rows={5}
                    {...uiProps("observaciones")}
                />
                
            </quimera-formulario>
        </>
    );
};
