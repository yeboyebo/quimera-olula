import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { boolAString, direccionCompleta } from "@olula/lib/dominio.ts";
import { DirCliente } from "../../diseño.ts";
import { puedoMarcarDireccionFacturacion } from "../../dominio.ts";
import "./TabDirecciones.css";

const metaTablaDirecciones = [
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
  direcciones,
  seleccionada,
  emitir,
  cargando,
}: {
  clienteId: string;
  direcciones: DirCliente[];
  seleccionada: DirCliente | null;
  emitir: (evento: string, payload?: unknown) => void;
  cargando: boolean;
}) => {
  const acciones = [
    {
      texto: "Editar",
      onClick: () => seleccionada && emitir("edicion_solicitada"),
      deshabilitado: !seleccionada,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("borrado_solicitado"),
      deshabilitado: !seleccionada,
    },
    {
      texto: "Facturación",
      onClick: () => emitir("facturacion_solicitada"),
      deshabilitado:
        !seleccionada || !puedoMarcarDireccionFacturacion(seleccionada),
    },
  ];

  return (
    <>
      <div className="TabDireccionesLista maestro-botones">
        <QBoton onClick={() => emitir("alta_solicitada")}>Nueva</QBoton>
        <QuimeraAcciones acciones={acciones} vertical />
      </div>

      <QTabla
        metaTabla={metaTablaDirecciones}
        datos={direcciones}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(direccion) => emitir("direccion_seleccionada", direccion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </>
  );
};
