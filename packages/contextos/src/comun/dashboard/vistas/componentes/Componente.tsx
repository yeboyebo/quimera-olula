import { ComponenteDashboard } from "../../diseño.ts";
import { problemaComponente, sinDatos } from "../../dominio.ts";
import { useDatosComponente } from "../../useDatosComponente.ts";
import { useRecursos } from "../../useRecursos.ts";
import { Barras, Circular, Temporal } from "./Graficos.tsx";
import { Mapa } from "./Mapa.tsx";
import { MarcoComponente } from "./MarcoComponente.tsx";
import { Tabla } from "./Tabla.tsx";
import { Objetivo, Tarjeta } from "./Tarjeta.tsx";

/**
 * Un componente del dashboard con sus datos. `espera` (ms) retrasa la carga: la vista
 * previa del editor no pide datos a cada tecla.
 */
export const Componente = ({
  componente,
  espera = 0,
}: {
  componente: ComponenteDashboard;
  espera?: number;
}) => {
  const { respuestas, cargando, error } = useDatosComponente(componente, espera);
  const recursos = useRecursos();
  const problema = problemaComponente(componente);
  const [respuesta] = respuestas;

  if (componente.tipo === "texto") {
    return (
      <MarcoComponente titulo={componente.titulo}>
        <p className="dashboard-texto">{componente.opciones.texto}</p>
      </MarcoComponente>
    );
  }

  const vacio =
    !sinDatos(componente.tipo) &&
    respuesta !== undefined &&
    respuesta.grupos.length === 0;

  const contenido = () => {
    if (!respuesta) return null;
    switch (componente.tipo) {
      case "tarjeta":
        return <Tarjeta componente={componente} respuesta={respuesta} />;
      case "objetivo":
        return <Objetivo componente={componente} respuesta={respuesta} />;
      case "temporal":
        return <Temporal componente={componente} respuesta={respuesta} />;
      case "barras":
        return <Barras componente={componente} respuesta={respuesta} />;
      case "ranking":
        return <Barras componente={componente} respuesta={respuesta} horizontal />;
      case "circular":
        return <Circular componente={componente} respuesta={respuesta} />;
      case "mapa":
        return <Mapa componente={componente} respuesta={respuesta} />;
      case "tabla":
        return (
          <Tabla
            componente={componente}
            respuesta={respuesta}
            recurso={recursos.find((r) => r.id === componente.consultas[0].recurso)}
          />
        );
      default:
        return (
          <p className="dashboard-componente-estado">Este tipo de componente llegará pronto</p>
        );
    }
  };

  return (
    <MarcoComponente
      titulo={componente.titulo}
      cargando={cargando}
      error={error}
      vacio={vacio}
      aviso={problema}
    >
      {contenido()}
    </MarcoComponente>
  );
};
