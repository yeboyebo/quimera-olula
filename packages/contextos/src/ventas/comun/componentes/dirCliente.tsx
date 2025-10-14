import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { useEffect, useState } from "react";
import { getDirecciones } from "../../cliente/infraestructura.ts";

interface DireccionesProps {
  clienteId: string | null;
  valor?: string;
  nombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const DirCliente = ({
  clienteId,
  valor,
  nombre = "direccion_id",
  onChange,
  ...props
}: DireccionesProps) => {
  const [opcionesDireccion, setOpcionesDireccion] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const fetchDirecciones = async () => {
      if (!clienteId) {
        setOpcionesDireccion([]);
        return;
      }

      const direcciones = await getDirecciones(clienteId);
      const opciones = direcciones.map((direccion) => ({
        valor: direccion.id,
        descripcion: `${direccion.tipo_via} ${direccion.nombre_via}, ${direccion.ciudad}`,
      }));
      setOpcionesDireccion(opciones);
    };

    fetchDirecciones();
  }, [clienteId]);

  return (
    <QSelect
      {...props}
      label="Dirección"
      nombre={nombre}
      valor={valor}
      opciones={opcionesDireccion}
      onChange={onChange}
    />
  );
};
