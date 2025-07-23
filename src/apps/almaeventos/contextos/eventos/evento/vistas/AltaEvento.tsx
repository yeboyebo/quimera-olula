import { useContext } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { ContextoError } from "../../../../../../contextos/comun/contexto.ts";
import { EmitirEvento } from "../../../../../../contextos/comun/diseño.ts";
import { useModelo } from "../../../../../../contextos/comun/useModelo.ts";
import { Producto } from "../../../../contextos/comun/componentes/producto.tsx";
import { metaNuevoEvento, nuevoEventoVacio } from "../dominio.ts";
import { getEvento, postEvento } from "../infraestructura.ts";

export const AltaEvento = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
}) => {
  const nuevoEvento = useModelo(metaNuevoEvento, nuevoEventoVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postEvento(nuevoEvento.modelo));
    nuevoEvento.init(nuevoEventoVacio);
    const EventoCreado = await getEvento(id);
    emitir("EVENTO_CREADO", EventoCreado);
  };
  
  // console.log('mimensaje_nuevoEvento',  nuevoEvento,  nuevoEvento.valido);
  
  return (
    <>
      <h2>Nuevo Evento</h2>
      <quimera-formulario>
        <Producto {...nuevoEvento.uiProps("referencia", "descripcion_producto")} />
        <QInput label="Nombre" {...nuevoEvento.uiProps("descripcion")} />
        <QInput label="Fecha" {...nuevoEvento.uiProps("fecha_inicio")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton onClick={guardar} deshabilitado={nuevoEvento.valido === false}>
          Guardar
        </QBoton>
        <QBoton
          tipo="reset"
          variante="texto"
          onClick={() => emitir("ALTA_CANCELADA")}
        >
          Cancelar
        </QBoton>
      </div>
    </>
  );
};
