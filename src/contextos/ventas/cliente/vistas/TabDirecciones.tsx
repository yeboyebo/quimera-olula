import { useEffect, useState } from "react";
import { Tabla } from "../../../../componentes/wrappers/tabla.tsx";
import { Direccion } from "../diseño.ts";
import { buscarDirecciones, marcarDireccionFacturacion } from "../dominio.ts";

export const TabDirecciones = ({
    clienteId,
  }: {
    clienteId: string;
  }) => {

    const cabeceras = {
        "Id": "id",
        "Facturación": "dir_facturacion",
        "Envío": "dir_envio",
        "Dirección": "nombre_via",
    }

    const [cargando, setCargando] = useState(true);
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [seleccionada, setSeleccionada] = useState<Direccion | null>(null);
    const [actualizado, setActualizado] = useState(true);


    const cargar = () => {
        setCargando(true);
        console.log("BUscar direcciones", clienteId);
        buscarDirecciones(clienteId).then((direcciones) => {
            setDirecciones(direcciones);
            refrescarSeleccionada();
            setCargando(false);
        });
    }

    const refrescarSeleccionada = () => {
        if (seleccionada) {
            const nuevaSeleccionada = direcciones.find((d) => d.id === seleccionada.id);
            if (nuevaSeleccionada) {
                setSeleccionada(nuevaSeleccionada);
            } else {
                setSeleccionada(null);
            }
        }
    }

    useEffect(() => {
        console.log("useffect 1", clienteId);
        clienteId && cargar();
        setActualizado(true);
    }, [clienteId]);

    useEffect(() => {
        console.log("useffect 2", actualizado);
        !actualizado && cargar();
        setActualizado(true);
    }, [actualizado]);

    const onFacturacionClicked = async(direccionId: string | undefined) => {
        // console.log("Facturacion clicked", direccionId);
        if (!direccionId) return;
        await marcarDireccionFacturacion(clienteId, direccionId)
        setActualizado(false);
    }
      
    return (<>
            <button
                onClick={() => onFacturacionClicked(seleccionada?.id)}
                disabled={!seleccionada || seleccionada.dir_facturacion}
            >
                Facturación
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