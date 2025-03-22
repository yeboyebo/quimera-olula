import { useState } from "react";
import { Direccion } from "../diseño.ts";
import { actualizarDireccionEnLista } from "../dominio.ts";
import { AltaDireccion } from "./AltaDireccion.tsx";
import { EdicionDireccion } from "./EdicionDireccion.tsx";
import { TabDireccionesLista } from "./TabDireccionesLista.tsx";

export const TabDirecciones = ({
    clienteId,
  }: {
    clienteId: string;
  }) => {

    const [modo, setModo] = useState("lista");
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [seleccionada, setSeleccionada] = useState<Direccion | null>(null);
    
    const actualizarDireccion = (direccion: Direccion) => {
        setDirecciones(actualizarDireccionEnLista(direcciones, direccion));
        setSeleccionada(direccion);
    }

    const añadirDireccion = (direccion: Direccion) => {
        setDirecciones([direccion, ...direcciones]);
        setSeleccionada(direccion);
        setModo("lista");
    }
    
    return (
        <>
            <TabDireccionesLista
                clienteId={clienteId}
                onEditarDireccion={() => setModo("edicion")}
                onCrearDireccion={() => setModo("alta")}
                direcciones={direcciones}
                setDirecciones={setDirecciones}
                seleccionada={seleccionada}
                setSeleccionada={setSeleccionada}
            />
            { modo === "edicion" && seleccionada &&
                <EdicionDireccion
                    clienteId={clienteId}
                    direccion={seleccionada}
                    onDireccionActualizada={actualizarDireccion}
                    onCancelar={() => setModo("lista")}
                />
            }
            { modo === "alta" &&
                <AltaDireccion
                    clienteId={clienteId}
                    onDireccionCreada={añadirDireccion}
                    onCancelar={() => setModo("lista")}
                />
            }
        </>
    );
  }