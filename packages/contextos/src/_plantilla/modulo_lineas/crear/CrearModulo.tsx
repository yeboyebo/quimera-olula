import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.js";
import { useContext } from "react";
import { getModLin, postModLin } from "../infraestructura.js";
import { metaNuevoModLin, nuevoModLinVacio } from "./dominio.js";

export const CrearModulo = ({
  publicar,
  onCancelar,
  activo,
}: {
  publicar: EmitirEvento;
  onCancelar: () => void;
  activo: boolean;
}) => {
  const form = useModelo(metaNuevoModLin, nuevoModLinVacio());
  const { intentar } = useContext(ContextoError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = await intentar(() => postModLin(form.modelo));

    if (id) {
      const modLinCreado = await intentar(() => getModLin(id));
      publicar("modulo_creado", modLinCreado);
      form.refrescar(nuevoModLinVacio());
      onCancelar();
    }
  };

  if (!activo) return null;

  return (
    <div className="CrearModulo modal">
      <form onSubmit={handleSubmit}>
        <h2>Crear Nuevo Módulo</h2>

        <div className="campo">
          <label>Campo String *</label>
          <input
            {...form.campo("campoString")}
            placeholder="Campo string del módulo"
            required
          />
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
