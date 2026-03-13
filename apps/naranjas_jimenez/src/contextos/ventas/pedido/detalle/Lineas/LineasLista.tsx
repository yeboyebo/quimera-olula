import { LineasListaProps } from "#/ventas/pedido/detalle/Lineas/LineasLista.tsx";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { QBoton, QModal } from "@olula/componentes/index.js";
import { useState } from "react";
import { LineaPedidoNrj } from "../../diseño.ts";
import { formateaCategoria, formateaEstado } from "../../dominio.ts";

export const LineasListaNrj = ({
  lineas,
  seleccionada,
  publicar,
}: LineasListaProps<LineaPedidoNrj>) => {
  const setSeleccionada = (linea: LineaPedidoNrj) => {
    publicar("linea_seleccionada", linea);
  };

  return (
    <>
      <QTabla
        metaTabla={getMetaTablaLineas()}
        datos={lineas}
        cargando={false}
        seleccionadaId={seleccionada}
        onSeleccion={setSeleccionada}
        orden={["id", "ASC"]}
        onOrdenar={(_: string) => null}
      />
    </>
  );
};

const getMetaTablaLineas = () => {
  return [
    {
      id: "id",
      cabecera: "Línea",
    },
    {
      id: "estado_palets",
      cabecera: "Estado",
      render: (linea: LineaPedidoNrj) =>
        formateaEstado(String(linea.estado_palets ?? "")),
    },
    /*     {
      id: "idVariedad",
      cabecera: "Variedad",
    }, */
    {
      id: "descVariedad",
      cabecera: "Variedad",
    },
    /*     {
      id: "idMarca",
      cabecera: "Marca",
    }, */
    {
      id: "descMarca",
      cabecera: "Marca",
    },
    /*     {
      id: "idCalibre",
      cabecera: "Calibre",
    }, */
    {
      id: "descCalibre",
      cabecera: "Calibre",
    },
    {
      id: "categoria",
      cabecera: "Categoría",
      render: (linea: LineaPedidoNrj) => formateaCategoria(linea.categoria),
    },
    /*     {
      id: "idTipoPalet",
      cabecera: "Palet",
    }, */
    {
      id: "descPalet",
      cabecera: "Palet",
    },
    /*     {
      id: "idEnvase",
      cabecera: "Envase",
    }, */
    {
      id: "descEnvase",
      cabecera: "Envase",
    },
    {
      id: "cantidad",
      cabecera: "Cnt. Envases",
      tipo: "numero" as const,
    },
    {
      id: "cantidad_envases_asignados",
      cabecera: "Asignada",
      tipo: "numero" as const,
      render: (linea: LineaPedidoNrj) => AsignacionesLinea({ linea }),
    },
  ];
};

const AsignacionesLinea = ({ linea }: { linea: LineaPedidoNrj }) => {
  const [mostrando, setMostrando] = useState(false);

  return linea.cantidad_envases_asignados ? (
    <div>
      <QBoton
        texto={`${linea.cantidad_envases_asignados}`}
        tamaño="pequeño"
        onClick={() => setMostrando(true)}
      />
      <QModal
        abierto={mostrando}
        nombre="mostrar"
        onCerrar={() => setMostrando(false)}
      >
        <div className="CrearLinea">
          <h2>Asignaciones</h2>

          <QTabla
            metaTabla={getMetaTablaPalets()}
            datos={linea.palets}
            cargando={false}
            orden={["id", "ASC"]}
            onOrdenar={(_: string) => null}
          />
        </div>
      </QModal>
    </div>
  ) : (
    0
  );
};

const getMetaTablaPalets = () => {
  return [
    {
      id: "cantidadEnvases",
      cabecera: "Envases",
      tipo: "numero" as const,
    },
  ];
};
