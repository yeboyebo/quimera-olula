import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { Producto } from "../../componentes/producto.tsx";
import { metaNuevoEvento, nuevoEventoVacio } from "../dominio.ts";
import { getEvento, postEvento } from "../infraestructura.ts";

export const AltaEvento = ({
  emitir = () => {},
  fechaInicial = null,
}: {
  emitir?: EmitirEvento;
  fechaInicial?: Date | null;
}) => {
  const fechaAString = (fecha: Date): string => {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  };
  nuevoEventoVacio.fecha_inicio = fechaInicial
    ? fechaAString(fechaInicial)
    : "";
  const nuevoEvento = useModelo(metaNuevoEvento, nuevoEventoVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const evento_id = await intentar(() => postEvento(nuevoEvento.modelo));
    nuevoEvento.init(nuevoEventoVacio);
    const EventoCreado = await getEvento(evento_id);
    emitir("EVENTO_CREADO", EventoCreado);
  };

  // console.log('mimensaje_nuevoEvento',  nuevoEvento,  nuevoEvento.valido);

  return (
    <>
      <h2>Nuevo Evento</h2>
      <quimera-formulario>
        <Producto
          {...nuevoEvento.uiProps("referencia", "descripcion_producto")}
        />
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
