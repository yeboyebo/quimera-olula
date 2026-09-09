import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "@olula/lib/infraestructura.ts";
import { useEffect, useState } from "react";

interface FormaPagoProps {
  valor: string;
  nombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const FormaPago = ({
  valor,
  nombre = "forma_pago_id",
  onChange,
  ...props
}: FormaPagoProps) => {
  const [opciones, setOpciones] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpciones = async () => {
      const opciones = await obtenerOpcionesSelector("formapago")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpciones(opcionesMapeadas);
    };

    cargarOpciones();
  }, []);

  return (
    <QSelect
      {...props}
      label="Forma de Pago"
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opciones}
    />
  );
};
