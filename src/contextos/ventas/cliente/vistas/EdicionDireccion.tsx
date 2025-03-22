import { useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Direccion } from "../diseño.ts";
import { cambiarDireccion, validadoresDireccion } from "../dominio.ts";
import { camposDireccion } from "../infraestructura.ts";

export const EdicionDireccion = (
    {
        clienteId,
        direccion,
        onDireccionActualizada,
        onCancelar,
    }: {
        clienteId: string;
        direccion: Direccion;
        onDireccionActualizada: (direccion: Direccion) => void;
        onCancelar: () => void;
    }
) => {

    const [_, setGuardando] = useState(false);

    const onCampoCambiado = async (campo: string, valor: any) => {
        console.log("campo cambiado", campo, 'valor = ', valor);
        setGuardando(true);
        const nuevaDireccion = { ...direccion, [campo]: valor };
        await cambiarDireccion(clienteId, nuevaDireccion);
        setGuardando(false);
        onDireccionActualizada && onDireccionActualizada(nuevaDireccion);
    };
    return (
        <>
            <h2>Edición de dirección</h2>
            <Input
                controlado={false}            
                key='tipo_via'
                campo={camposDireccion.tipo_via}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.tipo_via}
                validador={validadoresDireccion.tipo_via}
            />
            <Input
                controlado={false}            
                key='nombre_via'
                campo={camposDireccion.nombre_via}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.nombre_via}
                validador={validadoresDireccion.nombre_via}
            />
            <Input
                controlado={false}            
                key='ciudad'
                campo={camposDireccion.ciudad}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.ciudad}
                validador={validadoresDireccion.ciudad}
            />
            <button onClick={onCancelar}>
                Listo
            </button>
        </>
    );
}