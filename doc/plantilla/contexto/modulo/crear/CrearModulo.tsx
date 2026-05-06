import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useContext } from "react";
import { getModulo, postModulo } from "../infraestructura.ts";
import "./CrearModulo.css";
import { metaNuevoModulo, nuevoModuloVacio } from "./dominio.ts";

/**
 * Modal para crear nuevo módulo
 * Llama a la API directamente en la vista
 */
export const CrearModulo = ({
  publicar,
  onCancelar,
  activo,
}: {
  publicar: EmitirEvento;
  onCancelar: () => void;
  activo: boolean;
}) => {
  const form = useModelo(metaNuevoModulo, nuevoModuloVacio());
  const { intentar } = useContext(ContextoError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Llamar API directamente en la vista
    const id = await intentar(() => postModulo(form.modelo));

    if (id) {
      const moduloCreado = await intentar(() => getModulo(id));
      publicar("modulo_creado", moduloCreado);
      form.refrescar(nuevoModuloVacio());
      onCancelar();
    }
  };

  if (!activo) return null;

  return (
    <div className="CrearModulo modal">
      <form onSubmit={handleSubmit}>
        <h2>Crear Nuevo Módulo</h2>

        <div className="campo">
          <label>Nombre *</label>
          <input
            {...form.campo("nombre")}
            placeholder="Nombre del módulo"
            required
          />
        </div>

        <div className="campo">
          <label>Descripción</label>
          <textarea
            {...form.campo("descripcion")}
            placeholder="Descripción (opcional)"
          />
        </div>

        <div className="campo">
          <label>Estado</label>
          <select {...form.campo("estado")}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="botones">
          <QBoton type="submit" deshabilitado={!form.valido}>
            Crear
          </QBoton>
          <QBoton type="button" onClick={onCancelar}>
            Cancelar
          </QBoton>
        </div>
      </form>
    </div>
  );
};
