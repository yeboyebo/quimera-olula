import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.js";
import { MovimientoBancario } from "../diseño.js";
import { cuentaMovimientoBancario } from "../dominio.js";
import "./TabGeneral.css";

interface TabGeneralProps {
    form: FormModelo;
    movimiento: MovimientoBancario;
}

export const TabGeneral = ({ form, movimiento }: TabGeneralProps) => {

    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            {movimiento.eliminadoEnBanco && (
                <QAviso variante="error">
                    Este movimiento ya no aparece en el banco (el proveedor bancario dejó de
                    devolverlo). No se ha borrado porque está conciliado o requiere revisión.
                </QAviso>
            )}
            {movimiento.pendiente && (
                <QAviso variante="advertencia">
                    El banco todavía marca este movimiento como pendiente de confirmar — el
                    importe o la fecha pueden cambiar en la próxima sincronización.
                </QAviso>
            )}

            <quimera-formulario>
                <div id="cuenta">{cuentaMovimientoBancario(movimiento)}</div>
                <QInput label="Institución" {...uiProps("institucionNombre")} />
                <QInput label="Fecha" {...uiProps("fecha")} />
                <QInput label="Fecha valor" {...uiProps("fechaValor")} />
                <QInput label="Concepto" {...uiProps("concepto")} />
                <QInput label="Contraparte" {...uiProps("contraparte")} />
                <QInput label="Referencia" {...uiProps("referencia")} />
                <QInput label="Importe" {...uiProps("importe")} />
                <QInput label="ID en el banco" {...uiProps("idExterno")} />
            </quimera-formulario>
        </div>
    );
};
