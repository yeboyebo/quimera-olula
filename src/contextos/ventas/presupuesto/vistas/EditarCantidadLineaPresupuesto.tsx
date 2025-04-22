import { useState } from "react";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { LineaPresupuesto as Linea } from "../diseño.ts";

const validacion = (cantidadRaw: string) => {
  const cantidad = parseInt(cantidadRaw);

  return isNaN(cantidad) || cantidad < 0
    ? "Debe tener una cantidad mayor que cero."
    : "";
};

export const EditarCantidadLineaPresupuesto = ({
  linea,
  onCantidadEditada,
}: {
  linea: Linea;
  onCantidadEditada: (linea: Linea, cantidad: number) => void;
}) => {
  const [estado, setEstado] = useState("");

  const submit = (valor: string, e: React.FocusEvent<HTMLElement>) => {
    e.preventDefault();
    const cantidad = valor;

    const nuevoEstado = validacion(cantidad);
    setEstado(nuevoEstado);

    if (nuevoEstado.length > 0) return;

    onCantidadEditada(linea, parseInt(cantidad));
  };

  return (
    <quimera-formulario>
      <QInput
        label="Cantidad"
        nombre="cantidad"
        valor={linea.cantidad.toString()}
        erroneo={!!estado && estado.length > 0}
        textoValidacion={estado}
        condensado
        onBlur={submit}
      />
    </quimera-formulario>
  );
};
