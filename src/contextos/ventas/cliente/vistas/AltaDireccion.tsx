import { useState } from "react";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { DirCliente, NuevaDireccion } from "../diseño.ts";
import { validadoresDireccion } from "../dominio.ts";
import { camposDireccion, getDireccion, postDireccion } from "../infraestructura.ts";

export const AltaDireccion = (
    {
        clienteId,
        onDireccionCreada=()=>{},
        onCancelar,
    }: {
        clienteId: string;
        onDireccionCreada?: (direccion: DirCliente) => void;
        onCancelar: () => void;
    }
) => {

    const [_, setGuardando] = useState(false);
    const [direccion, setDireccion] = useState<NuevaDireccion>({
        tipo_via: '',
        nombre_via: '',
        ciudad: ''
    });

    const onCambio = async (campo: string, valor: string) => {
        const nuevaDireccion = { ...direccion, [campo]: valor };
        setDireccion(nuevaDireccion);
    };
    const onGuardarClicked = async () => {
        setGuardando(true);
        const id = await postDireccion(clienteId, direccion);
        const nuevaDireccion = await getDireccion(clienteId, id);
        setGuardando(false);
        onDireccionCreada(nuevaDireccion);
    };
    return (
        <>
            <h2>Nueva dirección</h2>
            <Input
                controlado
                key='tipo_via'
                campo={camposDireccion.tipo_via}
                onCampoCambiado={onCambio}
                valorEntidad={direccion.tipo_via}
                validador={validadoresDireccion.tipo_via}
            />
            <Input
                controlado
                key='nombre_via'
                campo={camposDireccion.nombre_via}
                onCampoCambiado={onCambio}
                valorEntidad={direccion.nombre_via}
            />
            <Input
                controlado
                key='ciudad'
                campo={camposDireccion.ciudad}
                onCampoCambiado={onCambio}
                valorEntidad={direccion.ciudad}
            />
            <button onClick={onGuardarClicked}
                disabled={validadoresDireccion.nuevaDireccion(direccion) !== true}
            >
                Guardar
            </button>
            <button onClick={onCancelar}>
                Cancelar
            </button>
        </>
    );
}