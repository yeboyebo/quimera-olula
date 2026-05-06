import { HookModelo } from "@olula/lib/useModelo.js";
import { Modulo } from "../diseño.ts";

/**
 * Tab General: formulario de edición del módulo
 */
export const TabGeneral = ({ form }: { form: HookModelo<Modulo> }) => {
  return (
    <div className="TabGeneral">
      <div className="campo">
        <label>Nombre</label>
        <input {...form.campo("nombre")} required />
      </div>

      <div className="campo">
        <label>Descripción</label>
        <textarea {...form.campo("descripcion")} rows={5} />
      </div>

      <div className="campo">
        <label>Estado</label>
        <select {...form.campo("estado")}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
    </div>
  );
};
