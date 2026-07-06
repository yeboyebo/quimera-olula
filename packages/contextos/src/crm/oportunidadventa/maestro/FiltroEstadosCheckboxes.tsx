import { ClausulaFiltro } from "@olula/lib/diseño.ts";
import { EstadoOportunidad } from "../diseño.ts";
import "./FiltroEstadosCheckboxes.css";

interface Props {
  estados: EstadoOportunidad[];
  filtroActual: ClausulaFiltro[];
  onChange: (nuevoFiltro: ClausulaFiltro | null) => void;
}

export const FiltroEstadosCheckboxes = ({
  estados,
  filtroActual,
  onChange,
}: Props) => {
  const todosLosEstados = estados.map((estado) => String(estado.id));
  const estadosActivosPorDefecto = estados
    .filter((estado) => estado.probabilidad > 0 && estado.probabilidad < 100)
    .map((estado) => String(estado.id));

  const parsearValorEstado = (valor: string | undefined): string[] => {
    if (!valor) return [];
    if (valor.includes(",")) return valor.split(",");
    return [valor];
  };

  // Extraer estados seleccionados del filtro actual
  const obtenerEstadosSeleccionados = (): string[] => {
    const clausulaEstado = filtroActual.find((f) => f[0] === "estado_id");
    if (!clausulaEstado) {
      return estadosActivosPorDefecto.length > 0
        ? estadosActivosPorDefecto
        : todosLosEstados;
    }

    const [, operador, valor] = clausulaEstado;
    const valores = Array.isArray(valor)
      ? valor
      : parsearValorEstado(typeof valor === "string" ? valor : undefined);

    if (operador === "in") {
      return valores;
    }

    if (operador === "!in") {
      const excluidos = new Set(valores);
      return todosLosEstados.filter((estadoId) => !excluidos.has(estadoId));
    }

    return estadosActivosPorDefecto.length > 0
      ? estadosActivosPorDefecto
      : todosLosEstados;
  };

  const estadosSeleccionados = new Set(obtenerEstadosSeleccionados());

  const manejarCambio = (estadoId: string, checked: boolean) => {
    const nuevosEstados = new Set(estadosSeleccionados);

    if (checked) {
      nuevosEstados.add(estadoId);
    } else {
      nuevosEstados.delete(estadoId);
    }

    // Generar nuevo filtro
    if (nuevosEstados.size === 0) {
      onChange(null); // Sin filtro
    } else {
      const estadosArray = Array.from(nuevosEstados);
      onChange([
        "estado_id",
        "in",
        estadosArray.join(","),
      ] as unknown as ClausulaFiltro);
    }
  };

  return (
    <div className="FiltroEstadosCheckboxes">
      {estados.map((estado) => (
        <label key={estado.id} className="checkbox-item">
          <input
            type="checkbox"
            checked={estadosSeleccionados.has(String(estado.id))}
            onChange={(e) => manejarCambio(String(estado.id), e.target.checked)}
          />
          <span>{estado.descripcion}</span>
        </label>
      ))}
    </div>
  );
};
