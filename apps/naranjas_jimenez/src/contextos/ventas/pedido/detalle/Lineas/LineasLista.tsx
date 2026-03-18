import { LineasListaProps } from "#/ventas/pedido/detalle/Lineas/LineasLista.tsx";
import { QBoton, QModal } from "@olula/componentes/index.js";
import { QTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { useCallback, useState } from "react";
import { LineaPedidoNrj } from "../../diseño.ts";
import { formateaCategoria, formateaEstado } from "../../dominio.ts";
import "./LineasLista.css";

type Layout = "TABLA" | "TARJETA";

export const LineasListaNrj = ({
  lineas,
  seleccionada,
  publicar,
}: LineasListaProps<LineaPedidoNrj>) => {
  const [layout, setLayout] = useState<Layout>("TARJETA");

  const cambiarLayout = useCallback(
    () => setLayout((l) => (l === "TARJETA" ? "TABLA" : "TARJETA")),
    []
  );

  const setSeleccionada = (linea: LineaPedidoNrj) => {
    publicar("linea_seleccionada", linea);
  };

  return (
    <>
      <div className="lineas-cabecera">
        <QBoton
          texto={layout === "TARJETA" ? "Cambiar a TABLA" : "Cambiar a TARJETA"}
          onClick={cambiarLayout}
        />
      </div>

      {layout === "TABLA" ? (
        <QTabla
          metaTabla={getMetaTablaLineas()}
          datos={lineas as LineaPedidoNrj[]}
          cargando={false}
          seleccionadaId={seleccionada}
          onSeleccion={setSeleccionada}
          orden={["id", "ASC"]}
          onOrdenar={(_: string) => null}
        />
      ) : (
        <div className="lineas-tarjetas">
          {(lineas as LineaPedidoNrj[]).map((linea) => (
            <TarjetaLineaNrj
              key={linea.id}
              linea={linea}
              seleccionada={seleccionada === linea.id}
              onClick={() => setSeleccionada(linea)}
            />
          ))}
        </div>
      )}
    </>
  );
};

const TarjetaLineaNrj = ({
  linea,
  seleccionada,
  onClick,
}: {
  linea: LineaPedidoNrj;
  seleccionada: boolean;
  onClick: () => void;
}) => (
  <div
    className={`tarjeta-linea${seleccionada ? " tarjeta-linea--seleccionada" : ""}`}
    onClick={onClick}
  >
    <div className="tarjeta-linea-estado">
      {formateaEstado(String(linea.estado_palets ?? ""))}
    </div>
    <div className="tarjeta-linea-cuerpo">
      <div className="tarjeta-linea-principal">
        <span className="tarjeta-linea-variedad">{linea.descVariedad}</span>
        <span className="tarjeta-linea-marca">{linea.descMarca}</span>
        <span className="tarjeta-linea-calibre">{linea.descCalibre}</span>
        <span className="tarjeta-linea-categoria">{formateaCategoria(linea.categoria)}</span>
      </div>
      <div className="tarjeta-linea-secundario">
        <span>{linea.descPalet}</span>
        <span>{linea.descEnvase}</span>
      </div>
    </div>
    <div className="tarjeta-linea-cantidades">
      <AsignacionesLinea linea={linea} />
      <span className="tarjeta-linea-total">{linea.cantidadEnvases}</span>
    </div>
  </div>
);

const AsignacionesLinea = ({ linea }: { linea: LineaPedidoNrj }) => {
  const [mostrando, setMostrando] = useState(false);

  return linea.cantidadEnvasesAsignados ? (
    <div>
      <QBoton
        texto={`${linea.cantidadEnvasesAsignados}`}
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
    <span>0</span>
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
    {
      id: "descVariedad",
      cabecera: "Variedad",
    },
    {
      id: "descMarca",
      cabecera: "Marca",
    },
    {
      id: "descCalibre",
      cabecera: "Calibre",
    },
    {
      id: "categoria",
      cabecera: "Categoría",
      render: (linea: LineaPedidoNrj) => formateaCategoria(linea.categoria),
    },
    {
      id: "descPalet",
      cabecera: "Palet",
    },
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

const getMetaTablaPalets = () => {
  return [
    {
      id: "cantidadEnvases",
      cabecera: "Envases",
      tipo: "numero" as const,
    },
  ];
};
