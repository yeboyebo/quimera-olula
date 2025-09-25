import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { QuimeraAcciones } from "../../../../../../componentes/moleculas/qacciones.tsx";
import {
  boolAString,
  direccionCompleta,
} from "../../../../../comun/dominio.ts";
import { DirCliente } from "../../../diseño.ts";
import { puedoMarcarDireccionFacturacion } from "../../../dominio.ts";

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
      texto: "Nueva",
      variante: "borde" as const,
      onClick: () => emitir("ALTA_SOLICITADA"),
    },
    {
      texto: "Editar",
      onClick: () => seleccionada && emitir("EDICION_SOLICITADA"),
      deshabilitado: !seleccionada,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      onClick: () => emitir("BORRADO_SOLICITADO"),
      deshabilitado: !seleccionada,
    },
    {
      texto: "Facturación",
      onClick: () => emitir("FACTURACION_SOLICITADA"),
      deshabilitado:
        !seleccionada || !puedoMarcarDireccionFacturacion(seleccionada),
    },
  ];

  return (
    <>
      <div
        className="TabDireccionesLista maestro-botones"
        style={{ alignItems: "center" }}
      >
        <QBoton onClick={() => emitir("ALTA_SOLICITADA")}>Nueva</QBoton>
        <QuimeraAcciones acciones={acciones} vertical />
      </div>
      <QTabla
        metaTabla={metaTablaDirecciones}
        datos={direcciones}
        cargando={cargando}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(direccion) => emitir("DIRECCION_SELECCIONADA", direccion)}
        orden={["id", "ASC"]}
        onOrdenar={() => null}
      />
    </>
  );
};
