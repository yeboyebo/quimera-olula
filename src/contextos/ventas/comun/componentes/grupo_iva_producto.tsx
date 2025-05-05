import { useEffect, useState } from "react";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "../../../comun/infraestructura.ts";

interface FormaPagoProps {
  valor: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const GrupoIvaProducto = ({
  valor,
  onChange,
  ...props
}: FormaPagoProps) => {
  const [opciones, setOpciones] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpciones = async () => {
      const opciones = await obtenerOpcionesSelector("grupo_iva_producto")();
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
      label="Grupo IVA"
      nombre="grupo_iva_producto_id"
      valor={valor}
      onChange={onChange}
      opciones={opciones}
    />
  );
};
