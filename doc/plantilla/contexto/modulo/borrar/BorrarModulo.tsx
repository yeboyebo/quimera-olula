import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext } from "react";
import { deleteModulo } from "../infraestructura.ts";

interface BorrarModuloProps {
  moduloId: string;
  moduloNombre: string;
  publicar?: ProcesarEvento;
  onCancelar?: () => void;
}

/**
 * Modal de confirmación para borrar un módulo
 * Llama a la API directamente en la vista
 */
export const BorrarModulo = ({
  moduloId,
  moduloNombre,
  publicar = async () => {},
  onCancelar = () => {},
}: BorrarModuloProps) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    await intentar(() => deleteModulo(moduloId));
    publicar("modulo_borrado", { moduloId });
    onCancelar();
  };

  return (
    <div className="BorrarModulo modal confirmacion">
      <div className="contenido">
        <h3>¿Estás seguro?</h3>
        <p>
          ¿Deseas borrar el módulo <strong>"{moduloNombre}"</strong>?
        </p>
        <p className="aviso">Esta acción no se puede deshacer.</p>
        <div className="botones">
          <QBoton onClick={borrar} tipo="peligro">
            Sí, borrar
          </QBoton>
          <QBoton onClick={onCancelar}>Cancelar</QBoton>
        </div>
      </div>
    </div>
  );
};
