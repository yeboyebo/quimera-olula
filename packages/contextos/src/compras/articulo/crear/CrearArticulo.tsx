import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useFocus } from "@olula/lib/useFocus.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { postArticulo } from "../infraestructura.ts";
import { metaNuevoArticulo, nuevoArticuloInicial } from "./crear.ts";

export const CrearArticulo = ({ publicar }: { publicar: EmitirEvento }) => {
  const inicial = useMemo(nuevoArticuloInicial, []);

  const { modelo: articulo, uiProps, valido } = useModelo(
    metaNuevoArticulo,
    inicial
  );

  const crear_ = useCallback(async () => {
    const id = await postArticulo(articulo);
    publicar("articulo_creado", id);
  }, [articulo, publicar]);

  const cancelar_ = useCallback(
    () => publicar("alta_de_articulo_cancelada"),
    [publicar]
  );

  const [crear, cancelar] = useForm(crear_, cancelar_);
  const focus = useFocus();

  return (
    <QModal
      abierto={true}
      nombre="crearArticulo"
      titulo="Crear artículo"
      onCerrar={cancelar}
    >
      <div className="CrearArticulo">
        <quimera-formulario>
          <QInput label="Descripción" {...uiProps("descripcion")} ref={focus} />
        </quimera-formulario>
        <div className="botones maestro-botones">
          <QBoton onClick={crear} deshabilitado={!valido}>
            Crear
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
