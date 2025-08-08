import { EmitirEvento } from "../../../comun/diseño.ts";
import { CategoriaReglas, Grupo, ReglaAnidada } from "../../diseño";
import { AccionesRegla } from "./AccionesRegla";
import "./ReglasOrganizadas.css";

interface ReglasOrganizadasProps {
  reglasOrganizadas: CategoriaReglas[];
  grupoSeleccionado: Grupo | null;
  categoriasAbiertas: Record<string, boolean>;
  emitir: EmitirEvento;
}

const SubReglaItem = ({
  regla,
  padre,
  grupoId,
  emitir,
}: {
  regla: ReglaAnidada;
  padre?: ReglaAnidada;
  grupoId: string;
  emitir: (evento: string, payload?: unknown) => void;
}) => (
  <div className="regla-item subregla">
    <div>{regla.descripcion.split(" - ").slice(2).join(" - ")}</div>
    <AccionesRegla
      regla={regla}
      reglaPadre={padre}
      grupoId={grupoId}
      emitir={emitir}
    />
  </div>
);

const ReglaItem = ({
  regla,
  grupoId,
  emitir,
}: {
  regla: ReglaAnidada;
  grupoId: string;
  emitir: (evento: string, payload?: unknown) => void;
}) => (
  <div className="categoria-item">
    <div className="regla-item">
      <div className="regla-descripcion">
        {regla.descripcion.split(" - ")[1]?.trim().replace(/_/g, " ") ||
          regla.descripcion}
      </div>

      <AccionesRegla regla={regla} grupoId={grupoId} emitir={emitir} />
    </div>
    {regla.hijos?.map((hijo) => (
      <SubReglaItem
        key={hijo.id}
        regla={hijo}
        padre={regla}
        grupoId={grupoId}
        emitir={emitir}
      />
    ))}
  </div>
);

const Categoria = ({
  categoria,
  estaAbierta,
  grupoId,
  emitir,
}: {
  categoria: CategoriaReglas;
  estaAbierta: boolean;
  grupoId: string;
  emitir: (evento: string, payload?: unknown) => void;
}) => (
  <div className="categoria-reglas">
    <div
      className={"categoria-header " + (estaAbierta ? " abierto" : "")}
      onClick={() => emitir("TOGGLE_CATEGORIA", categoria.id)}
    >
      <h3>{categoria.descripcion}</h3>
      {/* {!categoria.reglas?.length && (
        <AccionesRegla regla={regla} grupoId={grupoId} emitir={emitir} />
      )} */}
    </div>

    {estaAbierta && (
      <div className="Categoria">
        {categoria.reglas.length === 0 && (
          <div className="sin-reglas">No hay reglas en esta categoría</div>
        )}
        {categoria.reglas.map((regla) => (
          <ReglaItem
            key={regla.id}
            regla={regla}
            grupoId={grupoId}
            emitir={emitir}
          />
        ))}
      </div>
    )}
  </div>
);

export const ReglasOrganizadas = ({
  reglasOrganizadas,
  grupoSeleccionado,
  categoriasAbiertas,
  emitir,
}: ReglasOrganizadasProps) => {
  if (!grupoSeleccionado) return null;
  //   console.log("ReglasOrganizadas", reglasOrganizadas, grupoSeleccionado);
  return (
    <div className="ReglasOrganizadas">
      {reglasOrganizadas.map((categoria) => (
        <Categoria
          key={categoria.id}
          categoria={categoria}
          estaAbierta={categoriasAbiertas[categoria.id]}
          grupoId={grupoSeleccionado.id}
          emitir={emitir}
        />
      ))}
    </div>
  );
};
