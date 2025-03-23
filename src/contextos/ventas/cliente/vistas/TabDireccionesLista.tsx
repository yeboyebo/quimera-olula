import { useEffect, useState } from "react";
import { Tabla } from "../../../../componentes/wrappers/tabla2.tsx";
import { boolAString, direccionCompleta, quitarEntidadDeLista } from "../../../comun/dominio.ts";
import { Direccion } from "../../presupuesto/diseño.ts";
import { DirCliente } from "../diseño.ts";
import { puedoMarcarDireccionFacturacion } from "../dominio.ts";
import { deleteDireccion, getDirecciones, setDirFacturacion } from "../infraestructura.ts";

const metaTablaDirecciones = [
    { id: "direccion", cabecera: "Dirección", render: (direccion: DirCliente) => direccionCompleta(direccion) },
    { id: "dir_facturacion", cabecera: "Facturación", render: (direccion: DirCliente) => boolAString(direccion.dir_facturacion) },
    { id: "dir_envio", cabecera: "Envío", render: (direccion: DirCliente) => boolAString(direccion.dir_envio) },
  ]

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

    const [cargando, setCargando] = useState(true);

    const cargar = async() => {
        setCargando(true);
        direcciones = await getDirecciones(clienteId);
        setDirecciones(direcciones);
        refrescarSeleccionada();
        setCargando(false);
    }

    const onBorrarDireccion = async() => {
        if (!seleccionada) {
            return;
        }
        setDirecciones(quitarEntidadDeLista<Direccion>(direcciones, seleccionada));
        setSeleccionada(null);
        await deleteDireccion(clienteId, seleccionada.id);
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
        await setDirFacturacion(clienteId, direccionId)
        cargar();
    }

    useEffect(() => {
        clienteId && cargar();
    }, [clienteId]);
      
    return (<>
            <button
                onClick={onCrearDireccion}
            > Nueva
            </button>
            <button
                onClick={() => seleccionada && onEditarDireccion(seleccionada)}
                disabled={!seleccionada}
            > Editar
            </button>
            <button
                disabled={!seleccionada}
                onClick={onBorrarDireccion}
            > Borrar
            </button>
            <button
                onClick={() => onMarcarFacturacionClicked(seleccionada?.id)}
                disabled={!seleccionada || !puedoMarcarDireccionFacturacion(seleccionada)}
            > Facturación
            </button>
        <Tabla
            metaTabla={metaTablaDirecciones}
            datos={direcciones}
            cargando={cargando}
            seleccionadaId={seleccionada?.id}
            onSeleccion={setSeleccionada}
            orden={{ id: 'ASC'}}
            onOrdenar={(_: string) =>
                null
            //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
            }
          />
    </>)
  }