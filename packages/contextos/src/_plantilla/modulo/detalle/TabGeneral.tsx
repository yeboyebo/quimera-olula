import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { HookModelo } from "@olula/lib/useModelo.js";
import { Modulo } from "../diseño.js";
import "./TabGeneral.css";

/**
 * Tab General: formulario de edición del módulo.
 *
 * Layout: usa <quimera-formulario> (grid de 12 columnas).
 * El posicionado de cada campo se controla en TabGeneral.css
 * mediante selectores de atributo sobre el elemento renderizado:
 *
 *   quimera-input[nombre="nombre"]   { grid-column: span 9; }
 *   quimera-select[nombre="estado"]  { grid-column: span 3; }
 *
 * El atributo `nombre` llega automáticamente al spread de uiProps("campo").
 */
export const TabGeneral = ({ form }: { form: HookModelo<Modulo> }) => {
    const { uiProps } = form;

    return (
        <div className="TabGeneral">
            <quimera-formulario>
                {/*
                 * Fila 1: Nombre (9 cols) + Estado (3 cols)
                 * Posicionado en TabGeneral.css
                 */}
                <QInput label="Nombre" {...uiProps("nombre")} />
                <QSelect
                    label="Estado"
                    {...uiProps("estado")}
                    opciones={[
                        { valor: "activo", descripcion: "Activo" },
                        { valor: "inactivo", descripcion: "Inactivo" },
                    ]}
                />

                {/*
                 * Fila 2: Descripción (12 cols, ancho completo por defecto)
                 */}
                <QInput label="Descripción" {...uiProps("descripcion")} />
            </quimera-formulario>
        </div>
    );
};
