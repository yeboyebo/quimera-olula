import { useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Direccion } from "../diseño.ts";
import { cambiarDireccion } from "../dominio.ts";
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
        await cambiarDireccion(clienteId, direccion.id, {
            [campo]: valor
        });
        setGuardando(false);
        const nuevaDireccion = { ...direccion, [campo]: valor };
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
            />
            <Input
                controlado={false}            
                key='nombre_via'
                campo={camposDireccion.nombre_via}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.nombre_via}
            />
            <Input
                controlado={false}            
                key='ciudad'
                campo={camposDireccion.ciudad}
                onCampoCambiado={onCampoCambiado}
                valorEntidad={direccion.ciudad}
            />
            <button onClick={onCancelar}>
                Listo
            </button>
        </>
    );
}