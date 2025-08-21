import { EmitirEvento } from "../../../../comun/diseño.ts";
import { CategoriaReglas, Grupo } from "../../../diseño.ts";
import { Categoria } from "./Categoria.tsx";
import "./ReglasOrganizadas.css";

interface ReglasOrganizadasProps {
  reglasOrganizadas: CategoriaReglas[];
  grupoSeleccionado: Grupo | null;
  categoriasAbiertas: Record<string, boolean>;
  reglasAbiertas: Record<string, boolean>;
  emitir: EmitirEvento;
}

export const ReglasOrganizadas = ({
  reglasOrganizadas,
  grupoSeleccionado,
  categoriasAbiertas,
  reglasAbiertas,
  emitir,
}: ReglasOrganizadasProps) => {
  if (!grupoSeleccionado) return null;
  // console.log("ReglasOrganizadas", reglasOrganizadas, grupoSeleccionado);
  const reglaGeneral = reglasOrganizadas.find(
    (categoria) => categoria.id === "general"
  );
  return (
    <div className="ReglasOrganizadas">
      {reglasOrganizadas.map((categoria) => (
        <Categoria
          key={categoria.id}
          categoria={categoria}
          estaAbierta={categoriasAbiertas[categoria.id]}
          grupoId={grupoSeleccionado.id}
          emitir={emitir}
          reglaGeneral={reglaGeneral}
          reglasAbiertas={reglasAbiertas}
        />
      ))}
    </div>
  );
};
