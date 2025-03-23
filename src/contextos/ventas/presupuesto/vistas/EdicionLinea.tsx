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

    // const onCampoCambiado = async (campo: string, valor: any) => {
    //     console.log("campo cambiado", campo, 'valor = ', valor);
    //     setGuardando(true);
    //     const nuevaLinea = { ...linea, [campo]: valor };
    //     await cambiarLinea(presupuestoId, nuevaLinea);
    //     setGuardando(false);
    //     onLineaActualizada && onLineaActualizada(nuevaLinea);
    // };
    const onReferenciaCambiada = async (_: string, valor: any) => {
        setGuardando(true);
        await patchArticuloLinea(presupuestoId, linea.id, valor);
        // await getLinea(presupuestoId, linea.id);
        setGuardando(false);
        onLineaActualizada && onLineaActualizada(linea);
    };
 
    return (
        <>
            <h2>Edición de línea</h2>
            <Input
                controlado={false}            
                campo={camposLinea.referencia}
                onCampoCambiado={onReferenciaCambiada}
                valorEntidad={linea.referencia}
                // validador={validadoresLinea.tipo_via}
            />
            {/* <Input
                controlado={false}            
                key='nombre_via'
                campo={camposLinea.nombre_via}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={linea.nombre_via}
                validador={validadoresLinea.nombre_via}
            />
            <Input
                controlado={false}            
                key='ciudad'
                campo={camposLinea.ciudad}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={linea.ciudad}
                validador={validadoresLinea.ciudad}
            /> */}
            <button onClick={onCancelar}>
                Listo
            </button>
        </>
    );
}