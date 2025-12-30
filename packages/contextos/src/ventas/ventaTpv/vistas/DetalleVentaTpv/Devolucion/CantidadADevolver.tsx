import { LineaADevolver } from "#/ventas/ventaTpv/diseño.ts";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useEffect, useState } from "react";

const validacion = (cantidadRaw: string) => {
  const cantidad = parseInt(cantidadRaw);

  return isNaN(cantidad) || cantidad < 0
    ? "Debe tener una cantidad mayor que cero."
    : "";
};

export const CantidadADevolver = (
    {
        linea,
        onCantidadEditada,
    }: {
        linea: LineaADevolver;
        onCantidadEditada: (linea: LineaADevolver, cantidad: number) => void;
    }
) => {

    const [estado, setEstado] = useState("");
    const [valor, setValor] = useState(linea.aDevolver.toString());
    
    useEffect(() => {
        setValor(linea.aDevolver.toString());
    }, [linea.aDevolver]);

    const handleChange = (v: string) => {
        const valor = Number(v);
        if (valor < 0 || valor > linea.cantidad) {
            return;
        }
        const nuevoEstado = validacion(v);
        setEstado(nuevoEstado);
        setValor(v);
        onCantidadEditada(linea, valor);
    };

    return (
        <quimera-formulario>
        <QInput
            label="A devolver"
            nombre="a_devolver"
            valor={valor}
            erroneo={!!estado && estado.length > 0}
            textoValidacion={estado}
            condensado
            tipo="numero"
            onChange={handleChange}
            autoSeleccion
            // onBlur={submit}
        />
        </quimera-formulario>
    );
};
