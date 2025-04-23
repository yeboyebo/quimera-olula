import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import {
  boolAString,
  direccionCompleta,
  quitarEntidadDeLista,
  refrescarSeleccionada,
} from "../../../comun/dominio.ts";
import { DirCliente } from "../diseño.ts";
import { puedoMarcarDireccionFacturacion } from "../dominio.ts";
import {
  deleteDireccion,
  getDirecciones,
  setDirFacturacion,
} from "../infraestructura.ts";

const metaTablaDirecciones = [
  { id: "id", cabecera: "id" },
  {
    id: "direccion",
    cabecera: "Dirección",
    render: (direccion: DirCliente) => direccionCompleta(direccion),
  },
  {
    id: "dir_facturacion",
    cabecera: "Facturación",
    render: (direccion: DirCliente) => boolAString(direccion.dir_facturacion),
  },
  {
    id: "dir_envio",
    cabecera: "Envío",
    render: (direccion: DirCliente) => boolAString(direccion.dir_envio),
  },
];

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
  onEditarDireccion: (direccion: DirCliente) => void;
  onCrearDireccion: () => void;
  direcciones: DirCliente[];
  setDirecciones: (direcciones: DirCliente[]) => void;
  seleccionada: DirCliente | null;
  setSeleccionada: (direccion: DirCliente | null) => void;
}) => {
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const direcciones = await getDirecciones(clienteId);
    setDirecciones(direcciones);
    refrescarSeleccionada(direcciones, seleccionada?.id, setSeleccionada);
    setCargando(false);
  }, [clienteId, setDirecciones, seleccionada?.id, setSeleccionada]);

  const onBorrarDireccion = async () => {
    if (!seleccionada) {
      return;
    }
    setDirecciones(quitarEntidadDeLista<DirCliente>(direcciones, seleccionada));
    setSeleccionada(null);
    await deleteDireccion(clienteId, seleccionada.id);
  };

  const onMarcarFacturacionClicked = async (
    direccionId: string | undefined
  ) => {
    if (!direccionId) return;
    await setDirFacturacion(clienteId, direccionId);
    cargar();
  };

  useEffect(() => {
    if (clienteId) cargar();
  }, [clienteId, cargar]);

  return (
    <>
      <div className="acciones maestro-botones">
        <QBoton onClick={onCrearDireccion}>Nueva</QBoton>
        <QBoton
          onClick={() => seleccionada && onEditarDireccion(seleccionada)}
          deshabilitado={!seleccionada}
        >
          Editar
        </QBoton>
        <QBoton deshabilitado={!seleccionada} onClick={onBorrarDireccion}>
          Borrar
        </QBoton>
        <div className="maestro-botones"></div>
        <QBoton
          onClick={() => onMarcarFacturacionClicked(seleccionada?.id)}
          deshabilitado={
            !seleccionada || !puedoMarcarDireccionFacturacion(seleccionada)
          }
        >
          Facturación
        </QBoton>
      </div>
      <QTabla
        metaTabla={metaTablaDirecciones}
        datos={direcciones}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={setSeleccionada}
        orden={{ id: "ASC" }}
        onOrdenar={
          (_: string) => null
          //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
        }
      />
    </>
  );
};
