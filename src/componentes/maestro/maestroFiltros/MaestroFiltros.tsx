import { useContext, useEffect, useState } from "react";
import { Acciones, Entidad } from "../../../contextos/comun/diseño.ts";
import { MaestroContext } from "../Maestro.tsx";
import "./MaestroFiltros.css";

type MaestroProps<T extends Entidad> = {
  acciones: Acciones<T>;
};

export const MaestroFiltros = <T extends Entidad>({
  acciones,
}: MaestroProps<T>) => {
  const { buscar } = acciones;
  const [originalEntidades, setOriginalEntidades] = useState<T[]>([]);
  const context = useContext(MaestroContext);
  if (!context) {
    throw new Error("MaestroContext is null");
  }
  const { entidades, setEntidades } = context;

  useEffect(() => {
    if (originalEntidades.length < entidades.length) {
      setOriginalEntidades(entidades);
    }
  }, [entidades, originalEntidades]);

  const onBuscar = (formData: FormData): void => {
    const campo = formData.get("campo") as string;
    const valor = formData.get("valor") as string;
    if (buscar !== undefined) {
      // Busco en el servidor
      buscar(campo, valor).then((entidades) => setEntidades(entidades as T[]));
      return;
    }
    // Busco de forma local
    const entidadesFiltradas = entidades.filter((entidad) =>
      entidad[campo].includes(valor)
    );
    setEntidades(entidadesFiltradas);
  };

  const onLimpiar = () => {
    setEntidades(originalEntidades);
  };

  const obtenerCampos = () => {
    if (originalEntidades.length === 0) {
      return [];
    }
    return Object.keys(originalEntidades[0]);
  };

  return (
    <div className="MaestroFiltros">
      <form action={onBuscar}>
        <select name="campo">
          {obtenerCampos().map((campo) => (
            <option key={campo} value={campo}>
              {campo}
            </option>
          ))}
        </select>
        <input type="text" name="valor" placeholder="Valor" />
        <button>Buscar</button>
      </form>
      <form action={onLimpiar}>
        <button>Limpiar</button>
      </form>
    </div>
  );
};
