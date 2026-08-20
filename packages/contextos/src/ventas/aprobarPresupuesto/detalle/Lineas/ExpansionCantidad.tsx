import { QBoton, QInput } from "@olula/componentes/index.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useEffect, useState } from "react";
import { LineaAprobarPresupuesto } from "../../diseño.ts";
import { pendienteDeLinea } from "../../dominio.ts";
import "./ExpansionCantidad.css";

export const ExpansionCantidad = ({
  linea,
  publicar,
}: {
  linea: LineaAprobarPresupuesto;
  publicar: ProcesarEvento;
}) => {
  const maximo = pendienteDeLinea(linea);

  const [cantidad, setCantidad] = useState<string>(String(linea.a_pedir || 0));
  const [estado, setEstado] = useState("");

  // "Todos" y el check de la fila cambian a_pedir desde fuera; sin esto el
  // input seguiría mostrando lo que se teclease la última vez.
  useEffect(() => {
    setCantidad(String(linea.a_pedir || 0));
    setEstado("");
  }, [linea.a_pedir]);

  const validacion = (cantidadRaw: string): string => {
    const valor = Number(cantidadRaw);
    if (isNaN(valor) || valor < 0)
      return "Debe tener una cantidad mayor que cero.";
    if (valor > maximo) return "No puede pedir más de la cantidad pendiente.";
    return "";
  };

  const handleChange = (v: string) => {
    setEstado(validacion(v));
    setCantidad(v);
  };

  const guardar = () => {
    const valor = Math.min(maximo, Math.max(0, Number(cantidad) || 0));
    publicar("cantidad_cambiada", { id: linea.id, cantidad: valor });
  };

  return (
    <div className="ExpansionCantidad">
      <QInput
        label="A pedir"
        nombre={`ec-${linea.id}`}
        tipo="numero"
        condensado
        deshabilitado={linea.cerrada}
        valor={cantidad}
        onChange={handleChange}
        erroneo={!!estado}
        textoValidacion={estado}
        autoSeleccion
      />
      <QBoton tamaño="pequeño" deshabilitado={linea.cerrada} onClick={guardar}>
        Aprobar
      </QBoton>
    </div>
  );
};
