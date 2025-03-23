import { useEffect, useState } from "react";
import { Tabla } from "../../../../componentes/wrappers/tabla2.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { Direccion } from "../diseño.ts";
import { borrarDireccion, buscarDirecciones, marcarDireccionFacturacion } from "../dominio.ts";

const boolAString = (valor: boolean) => valor ? "Sí" : "No";    
const direccionCompleta = (valor: Direccion) => `${valor.tipo_via ? (valor.tipo_via + ' ') : ''} ${valor.nombre_via}, ${valor.ciudad}`;

const metaTablaDirecciones = [
    { id: "direccion", cabecera: "Dirección", render: (direccion: Direccion) => direccionCompleta(direccion) },
    { id: "dir_facturacion", cabecera: "D. Facturación", render: (direccion: Direccion) => boolAString(direccion.dir_facturacion) },
    { id: "dir_envio", cabecera: "D. Envío", render: (direccion: Direccion) => boolAString(direccion.dir_envio) },
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
        direcciones = await buscarDirecciones(clienteId);
        setDirecciones(direcciones);
        refrescarSeleccionada();
        setCargando(false);
    }

    const onBorrarDireccion = async() => {
        if (!seleccionada) {
            return;
        }
        setDirecciones(quitarElemento(direcciones, seleccionada));
        setSeleccionada(null);
        await borrarDireccion(clienteId, seleccionada.id);
    }

    const quitarElemento = <T extends Entidad>(lista: T[], elemento: T): T[] => {
        return lista.filter((e) => e.id !== elemento.id);
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
                disabled={!seleccionada || seleccionada.dir_facturacion}
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