import { useCallback, useEffect, useState } from "react";
import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../componentes/atomos/qtabla.tsx";
import {
  boolAString,
  direccionCompleta,
  getElemento,
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
  // { id: "id", cabecera: "id" },
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
  seleccionada: string | undefined;
  setSeleccionada: (idDireccion: string | undefined) => void;
}) => {
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const direcciones = await getDirecciones(clienteId);
    setDirecciones(direcciones);
    refrescarSeleccionada(direcciones, seleccionada, setSeleccionada);
    setCargando(false);
  }, [clienteId, setDirecciones, seleccionada, setSeleccionada]);

  const onBorrarDireccion = async () => {
    if (!seleccionada) {
      return;
    }
    setDirecciones(quitarEntidadDeLista<DirCliente>(direcciones, seleccionada));
    setSeleccionada(undefined);
    await deleteDireccion(clienteId, seleccionada);
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
      <div className="botones maestro-botones ">
        <QBoton onClick={onCrearDireccion}>Nueva</QBoton>
        <QBoton
          onClick={() => seleccionada && onEditarDireccion(getElemento(direcciones, seleccionada))}
          deshabilitado={!seleccionada}
        >
          Editar
        </QBoton>
        <QBoton deshabilitado={!seleccionada} onClick={onBorrarDireccion}>
          Borrar
        </QBoton>
        <QBoton
          onClick={() => onMarcarFacturacionClicked(seleccionada)}
          deshabilitado={
            !seleccionada || !puedoMarcarDireccionFacturacion(getElemento(direcciones, seleccionada))
          }
        >
          Facturación
        </QBoton>
      </div>
      <QTabla
        metaTabla={metaTablaDirecciones}
        datos={direcciones}
        cargando={cargando}
        seleccionadaId={seleccionada}
        onSeleccion={(direccion) => setSeleccionada(direccion.id)}
        orden={{ id: "ASC" }}
        onOrdenar={
          (_: string) => null
          //   setOrden({ [clave]: orden[clave] === "ASC" ? "DESC" : "ASC" })
        }
      />
    </>
  );
};
