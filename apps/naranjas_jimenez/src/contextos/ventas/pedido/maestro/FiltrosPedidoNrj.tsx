import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QDateInterval } from "@olula/componentes/atomos/qdateinterval.tsx";
import { ClausulaFiltro, Filtro } from "@olula/lib/diseño.ts";
import { useEffect, useState } from "react";
import { Cliente } from "../../comun/componentes/Cliente.tsx";

type FiltrosPedidoNrjProps = {
  filtro: Filtro;
  onFiltroChanged: (filtro: Filtro) => void;
};

export const FiltrosPedidoNrj = ({ filtro, onFiltroChanged }: FiltrosPedidoNrjProps) => {
  const [mostrar, setMostrar] = useState(false);
  const [fecha, setFecha] = useState<[string, string]>(["", ""]);
  const [clienteId, setClienteId] = useState<string>("");
  const [mostrarTerminados, setMostrarTerminados] = useState(false);

  useEffect(() => {
    const clausulaFecha = filtro.find((f) => f[0] === "fecha");
    const clausulaCliente = filtro.find((f) => f[0] === "cliente_id");
    const clausulaMostrar = filtro.find(
      (f) => f[0] === "estado_envio_palets" && f[2] === "fake"
    );

    setFecha(
      clausulaFecha ? (clausulaFecha[2] as string).split("_") as [string, string] : ["", ""]
    );
    setClienteId(clausulaCliente ? (clausulaCliente[2] as string) : "");
    setMostrarTerminados(!!clausulaMostrar);
  }, [filtro]);

  const onBuscar = () => {
    const clausulas: ClausulaFiltro[] = [];

    const [desde, hasta] = fecha;
    if (desde || hasta) {
      clausulas.push(["fecha", "<>", `${desde}_${hasta}`]);
    }

    if (clienteId) {
      clausulas.push(["cliente_id", "=", clienteId]);
    }

    if (mostrarTerminados) {
      clausulas.push(["estado_envio_palets", "!", "fake"]);
    }

    onFiltroChanged(clausulas);
  };

  const onLimpiar = () => {
    onFiltroChanged([]);
  };

  if (!mostrar) {
    return (
      <QBoton tamaño="pequeño" onClick={() => setMostrar(true)}>
        Filtros ({filtro.length})
      </QBoton>
    );
  }

  return (
    <>
      <QBoton tamaño="pequeño" onClick={() => setMostrar(false)}>
        Cerrar filtros
      </QBoton>
      <div className="MaestroFiltrosControlado">
        <quimera-formulario>
          <QDateInterval
            nombre="fecha"
            label="Fecha"
            tipo="fecha"
            valor={fecha as unknown as string}
            opcional={true}
            onChange={(v) => setFecha(v as unknown as [string, string])}
          />
          <Cliente
            label="Cliente"
            nombre="cliente_id"
            valor={clienteId}
            onChange={(opcion) => setClienteId(opcion?.valor ?? "")}
          />
          <QCheckbox
            nombre="mostrar_terminados"
            label="Mostrar terminados"
            valor={mostrarTerminados}
            opcional={true}
            onChange={(v) => setMostrarTerminados(v === "true")}
          />
        </quimera-formulario>
        <footer>
          <QBoton tamaño="pequeño" onClick={onBuscar}>
            Buscar
          </QBoton>
          <QBoton variante="texto" tamaño="pequeño" onClick={onLimpiar}>
            Limpiar
          </QBoton>
        </footer>
      </div>
    </>
  );
};
