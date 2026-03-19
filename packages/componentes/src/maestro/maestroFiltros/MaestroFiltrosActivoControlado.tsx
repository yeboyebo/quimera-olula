import {
  ClausulaFiltro,
  Entidad,
  Filtro,
  TipoInput,
} from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useMemo, useState } from "react";
import { QBoton } from "../../atomos/qboton.tsx";
import { QCheckbox } from "../../atomos/qcheckbox.tsx";
import { QDateInterval } from "../../atomos/qdateinterval.tsx";
import { QInput } from "../../atomos/qinput.tsx";
import { Opcion, QMultiCheckbox } from "../../atomos/qmulticheckbox.tsx";
import { QNumberInterval } from "../../atomos/qnumberinterval.tsx";
import { MetaTabla } from "../../atomos/qtabla.tsx";
import "./MaestroFiltrosActivoControlado.css";

type MetaCampoFiltro = {
  id: string;
  label: string;
  tipo?: TipoInput;
  opciones?: Opcion[];
  filtro: (v: unknown) => ClausulaFiltro;
};

export type MetaFiltro = Record<string, MetaCampoFiltro>;

export const getMetaFiltroDefecto = <T extends Entidad>(
  metaTabla: MetaTabla<T>
): MetaFiltro => {
  const campos: Record<string, MetaCampoFiltro> = {};

  for (const columna of metaTabla) {
    if (columna.id === "id") continue;

    switch (columna.tipo) {
      case "booleano":
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "checkbox",
          filtro: (v) => [columna.id, "=", v as string],
        };
        break;
      case "fecha":
      case "fechahora":
      case "hora":
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "intervalo_fechas",
          filtro: (valor: unknown) => {
            const [desde, hasta] = valor as [Date, Date];
            return [
              columna.id,
              "<>",
              desde?.toISOString().slice(0, 10) +
                "_" +
                hasta?.toISOString().slice(0, 10),
            ] as ClausulaFiltro;
          },
        };
        break;
      case "numero":
      case "moneda":
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "intervalo_numeros",
          filtro: (valor: unknown) => {
            const [desde, hasta] = valor as [number, number];
            return [columna.id, "<>", desde + "_" + hasta] as ClausulaFiltro;
          },
        };
        break;
      default:
        campos[columna.id] = {
          id: columna.id,
          label: columna.cabecera,
          tipo: "texto",
          filtro: (v) => [columna.id, "~", v as string],
        };
        break;
    }
  }

  return campos;
};

export const filtroToValores = (filtro: Filtro, meta: MetaFiltro) => {
  const valores: Record<string, unknown> = {};

  for (const clausula of filtro) {
    const [campo, _, valor] = clausula;

    if (valor?.includes("_")) valores[campo] = valor.split("_");
    else valores[campo] = valor;

    const valor_final = valores[campo];

    if (!meta[campo]) continue;

    switch (meta[campo].tipo) {
      case "intervalo_fechas":
        valores[campo] = (valor_final as [string, string])?.map((f: string) =>
          f ? new Date(Date.parse(f)) : undefined
        );
        break;
      case "intervalo_numeros":
        valores[campo] = (valor_final as [string, string])?.map((f: string) =>
          f ? parseFloat(f) : undefined
        );
        break;
      case "multiseleccion":
        valores[campo] = Array.isArray(valores[campo])
          ? valores[campo]
          : [valores[campo]];
        break;
      case "fecha":
        valores[campo] = new Date(Date.parse(valor_final as string));
        break;
    }
  }

  return valores;
};

type MaestroFiltrosActivoControladoProps = {
  metaFiltro: MetaFiltro;
  filtroInicial: Filtro;
  filtro: Filtro;
  onFiltroChanged: (filtro: Filtro) => void;
};

export const MaestroFiltrosActivoControlado = ({
  metaFiltro,
  filtroInicial,
  filtro,
  onFiltroChanged,
}: MaestroFiltrosActivoControladoProps) => {
  const valoresIniciales = useMemo(
    () => filtroToValores(filtro, metaFiltro),
    [filtro, metaFiltro]
  );

  const valores = useModelo(metaFiltro, valoresIniciales);
  const { modelo, modeloInicial, uiProps, init } = valores;

  const [mostrar, setMostar] = useState(false);

  const renderFiltros = () => {
    return Object.entries(metaFiltro).map(([_, campo]) => {
      switch (campo.tipo) {
        case "intervalo_fechas":
          return (
            <QDateInterval
              key={campo.id}
              {...uiProps(campo.id)}
              tipo={"fecha"}
              label={campo.label}
              opcional={true}
            />
          );
        case "intervalo_numeros":
          return (
            <QNumberInterval
              key={campo.id}
              {...uiProps(campo.id)}
              tipo={"numero"}
              label={campo.label}
              opcional={true}
            />
          );
        case "multiseleccion":
          return (
            <QMultiCheckbox
              key={campo.id}
              {...uiProps(campo.id)}
              opciones={campo.opciones as Opcion[]}
              label={campo.label}
              opcional={true}
            />
          );
        case "checkbox":
          return (
            <QCheckbox
              key={campo.id}
              {...uiProps(campo.id)}
              label={campo.label}
              opcional={true}
            />
          );
        default:
          return (
            <QInput
              key={campo.id}
              {...uiProps(campo.id)}
              label={campo.label}
              opcional={true}
            />
          );
      }
    });
  };

  const onBuscar = (): void => {
    const filtros = Object.entries(modelo).map(([id, valor]) => {
      if (valor === undefined || valor === null) return valor;

      return metaFiltro[id].filtro(valor);
    });

    onFiltroChanged(filtros.filter((v) => !!v));
  };

  const onLimpiar = () => {
    init(modeloInicial);
    onFiltroChanged(filtroInicial);
  };

  if (!Object.keys(metaFiltro).length) return;

  if (!mostrar)
    return (
      <QBoton tamaño="pequeño" onClick={() => setMostar(true)}>
        Filtros ({filtro.length - filtroInicial.length})
      </QBoton>
    );

  return (
    <>
      <QBoton tamaño="pequeño" onClick={() => setMostar(false)}>
        Cerrar filtros
      </QBoton>
      <div className="MaestroFiltrosControlado">
        <quimera-formulario>{renderFiltros()}</quimera-formulario>
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
