import { useContext } from "react";
import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../../../../contextos/comun/useModelo.ts";
// import { EmitirEvento } from "../../../comun/diseño.ts";
import { EmitirEvento } from "../../../../../../contextos/comun/diseño.ts";
// import { Agente } from "../../comun/componentes/agente.tsx";
// import { TipoIdFiscal } from "../../comun/componentes/tipoIdFiscal.tsx";
import { ContextoError } from "../../../../../../contextos/comun/contexto.ts";
import { metaNuevoProducto, nuevoProductoVacio } from "../dominio.ts";
import { getProducto, postProducto } from "../infraestructura.ts";

export const AltaProducto = ({
  emitir = () => {},
}: {
  emitir?: EmitirEvento;
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
        <QBoton onClick={guardar} deshabilitado={nuevoProducto.valido === false}>
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
