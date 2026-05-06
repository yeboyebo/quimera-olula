import { QBoton, QInput } from "@olula/componentes/index.ts";
import { ContextoError } from "@olula/lib/contexto.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { metaNuevoProducto, nuevoProductoVacio } from "../dominio.ts";
import { getProducto, postProducto } from "../infraestructura.ts";

export const AltaProducto = ({
  emitir = async () => {},
}: {
  emitir?: ProcesarEvento;
}) => {
  const nuevoProducto = useModelo(metaNuevoProducto, nuevoProductoVacio);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const id = await intentar(() => postProducto(nuevoProducto.modelo));
    nuevoProducto.init(nuevoProductoVacio);
    const ProductoCreado = await getProducto(id);
    emitir("PRODUCTO_CREADO", ProductoCreado);
  };

  return (
    <>
      <h2>Nuevo Producto</h2>
      <quimera-formulario>
        <QInput label="Código" {...nuevoProducto.uiProps("id")} />
        <QInput label="Descripción" {...nuevoProducto.uiProps("descripcion")} />
      </quimera-formulario>
      <div className="botones">
        <QBoton
          onClick={guardar}
          deshabilitado={nuevoProducto.valido === false}
        >
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
