import { CategoriaReglas } from "../../../diseño.ts";
import { AccionesCategoria } from "./Acciones.tsx";
import { ReglaItem } from "./ReglaItem.tsx";

export const Categoria = ({
  categoria,
  estaAbierta,
  grupoId,
  emitir,
  reglasAbiertas,
}: {
  categoria: CategoriaReglas;
  estaAbierta: boolean;
  grupoId: string;
  emitir: (evento: string, payload?: unknown) => void;
  reglasAbiertas: Record<string, boolean>;
}) => (
  <div className="categoria-reglas">
    <div
      className={
        "categoria-header" +
        (estaAbierta ? " abierto" : "") +
        (categoria.reglas.length === 0 ? " sin-toggle" : "")
      }
      onClick={
        categoria.reglas.length > 0
          ? () => emitir("TOGGLE_CATEGORIA", categoria.id)
          : undefined
      }
    >
      <h3>{categoria.descripcion}</h3>
      {categoria.reglas.length === 0 && (
        <AccionesCategoria
          categoria={categoria}
          grupoId={grupoId}
          emitir={emitir}
        />
      )}
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
            abierta={!!reglasAbiertas[regla.id]}
          />
        ))}
      </div>
    )}
  </div>
);
