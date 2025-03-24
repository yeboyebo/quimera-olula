import { useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { DirCliente } from "../diseño.ts";
import { validadoresDireccion } from "../dominio.ts";
import { actualizarDireccion, camposDireccion } from "../infraestructura.ts";

export const EdicionDireccion = (
    {
        clienteId,
        direccion,
        onDireccionActualizada=()=>{},
        onCancelar,
    }: {
        clienteId: string;
        direccion: DirCliente;
        onDireccionActualizada?: (direccion: DirCliente) => void;
        onCancelar: () => void;
    }
) => {

    const [_, setGuardando] = useState(false);

    const onCampoCambiado = async (campo: string, valor: string) => {
        setGuardando(true);
        const nuevaDireccion = { ...direccion, [campo]: valor };
        await actualizarDireccion(clienteId, nuevaDireccion);
        setGuardando(false);
        onDireccionActualizada(nuevaDireccion);
    };
    return (
        <>
            <h2>Edición de dirección</h2>
            <Input
                campo={camposDireccion.tipo_via}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.tipo_via}
                validador={validadoresDireccion.tipo_via}
            />
            <Input
                campo={camposDireccion.nombre_via}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.nombre_via}
                validador={validadoresDireccion.nombre_via}
            />
            <Input
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