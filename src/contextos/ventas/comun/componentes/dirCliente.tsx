import { useEffect, useState } from "react";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { getDirecciones } from "../../cliente/infraestructura.ts";

interface DireccionesProps {
  clienteId: string | null;
  direccion_id?: string;
  onDireccionChanged: (
    opcion: { valor: string; descripcion: string } | null
  ) => void;
}

export const Direcciones = ({
  clienteId,
  direccion_id,
  onDireccionChanged,
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
      label="Dirección"
      nombre="direccion_id"
      valor={direccion_id}
      opciones={opcionesDireccion}
      onChange={onDireccionChanged}
    />
  );
};
