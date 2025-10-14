import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { useEffect, useState } from "react";
import { getGrupos } from "../../grupos/infraestructura.ts";

interface GruposProps {
  valor?: string;
  nombre?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const Grupo = ({
  valor,
  nombre = "grupo_id",
  onChange,
  ...props
}: GruposProps) => {
  const [opcionesGrupo, setOpcionesGrupo] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const grupos = await getGrupos();
      const opciones = grupos.datos.map((grupo) => ({
        valor: grupo.id,
        descripcion: grupo.nombre,
      }));
      setOpcionesGrupo(opciones);
    };

    fetchGrupos();
  }, []);

  return (
    <QSelect
      {...props}
      label="Grupo"
      nombre={nombre}
      valor={valor}
      opciones={opcionesGrupo}
      onChange={onChange}
    />
  );
};
