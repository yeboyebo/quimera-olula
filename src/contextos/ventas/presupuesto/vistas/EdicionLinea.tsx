import { useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { LineaPresupuesto as Linea } from "../diseño.ts";
import { camposLinea, patchArticuloLinea } from "../infraestructura.ts";

export const EdicionLinea = (
    {
        presupuestoId,
        linea,
        onLineaActualizada,
        onCancelar,
    }: {
        presupuestoId: string;
        linea: Linea;
        onLineaActualizada: (linea: Linea) => void;
        onCancelar: () => void;
    }
) => {

    const [_, setGuardando] = useState(false);

    const onReferenciaCambiada = async (_: string, valor: string) => {
        setGuardando(true);
        await patchArticuloLinea(presupuestoId, linea.id, valor);
        setGuardando(false);
        if (onLineaActualizada) onLineaActualizada(linea);
    };
 
    return (
        <>
            <h2>Edición de línea</h2>
            <Input
                campo={camposLinea.referencia}
                onCampoCambiado={onReferenciaCambiada}
                valorEntidad={linea.referencia}
            />
            <button onClick={onCancelar}>
                Listo
            </button>
        </>
    );
}