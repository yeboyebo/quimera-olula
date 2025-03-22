import { useEffect, useState } from "react";
import { Tabla } from "../../../../componentes/wrappers/tabla.tsx";
import { Direccion } from "../diseño.ts";
import { buscarDirecciones, marcarDireccionFacturacion } from "../dominio.ts";

export const TabDireccionesLista = ({
    clienteId,
    onEditarDireccion,
    onCrearDireccion,
    direcciones,
    setDirecciones,
    seleccionada,
    setSeleccionada,
  }: {
    clienteId: string;
    onEditarDireccion: (direccion: Direccion) => void;
    onCrearDireccion: () => void;
    direcciones: Direccion[];
    setDirecciones: (direcciones: Direccion[]) => void;
    seleccionada: Direccion | null;
    setSeleccionada: (direccion: Direccion | null) => void;
  }) => {

    const cabeceras = {
        "Id": "id",
        "Facturación": "dir_facturacion",
        "Envío": "dir_envio",
        "Dirección": "nombre_via",
    }

    const [cargando, setCargando] = useState(true);

    const cargar = () => {
        setCargando(true);
        buscarDirecciones(clienteId).then((direcciones) => {
            setDirecciones(direcciones);
            refrescarSeleccionada();
        });
        setCargando(false);
    }

    const refrescarSeleccionada = () => {
        if (!seleccionada) {
            return;
        }
        const nuevaSeleccionada = direcciones.find((d) => d.id === seleccionada.id);
        if (nuevaSeleccionada) {
            setSeleccionada(nuevaSeleccionada);
        } else {
            setSeleccionada(null);
        }
    }
    
    const onMarcarFacturacionClicked = async(direccionId: string | undefined) => {
        if (!direccionId) return;
        await marcarDireccionFacturacion(clienteId, direccionId)
        cargar();
    }

    useEffect(() => {
        clienteId && cargar();
    }, [clienteId]);
      
    return (<>
            <button
                onClick={() => onMarcarFacturacionClicked(seleccionada?.id)}
                disabled={!seleccionada || seleccionada.dir_facturacion}
            > Facturación
            </button>
            <button
                onClick={() => seleccionada && onEditarDireccion(seleccionada)}
                disabled={!seleccionada}
            > Editar
            </button>
            <button
                onClick={onCrearDireccion}
            > Nueva
            </button>
        <Tabla
            cabeceras={cabeceras}
            datos={direcciones}
            cargando={cargando}
            seleccionadaId={seleccionada?.id}
            onSeleccion={setSeleccionada}
            orden={{ id: 'ASC'}}
            onOrdenar={(clave: string) =>
                null
            //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
            }
          />
    </>)
  }