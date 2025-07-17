import { useContext, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../../../componentes/detalle/Detalle.tsx";
import { QModalConfirmacion } from "../../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../../../contextos/comun/contexto.ts";
import { Entidad } from "../../../../../../../contextos/comun/diseño.ts";
import { useModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Producto } from "../../diseño.ts";
import { metaProducto, productoVacio } from "../../dominio.ts";
import { deleteProducto, getProducto, patchProducto } from "../../infraestructura.ts";

type Estado = "defecto";

export const DetalleProducto = ({
  productoInicial = null,
  emitir = () => {},
}: {
  productoInicial?: Producto | null;
  emitir?: (producto: string, payload?: unknown) => void;
}) => {
  const params = useParams();
  const productoId = productoInicial?.id ?? params.id;
  const titulo = (producto: Entidad) => producto.id as string;
  const { intentar } = useContext(ContextoError);

  const producto = useModelo(metaProducto, productoVacio);
  const { modelo, init, modificado, valido } = producto;
  const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );  

  // const maquina: Maquina<Estado> = {
  //   defecto: {
  //     GUARDAR_INICIADO: async () => {
  //       console.log("hola mundo");
  //     },
  //   },
  // };
  // const emitirProducto = useMaquina(maquina, "defecto", () => {});

  const onGuardarClicked = async () => {
    await intentar(() => patchProducto(modelo.id, modelo));
    const producto_guardado = await getProducto(modelo.id);
    init(producto_guardado);
    emitir("PRODUCTO_CAMBIADO", producto_guardado);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteProducto(modelo.id));
    emitir("PRODUCTO_BORRADO", modelo);
    setEstado("edicion");
  };  

  console.log("mimensaje_DetalleProducto_estado", estado);
  
  
  return (
    <Detalle
      id={productoId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getProducto}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!productoId && (
        <div className="DetalleProductoDescripcion">
          <div className="maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div>
          <quimera-formulario>
            <QInput label="Descripción" {...producto.uiProps("descripcion")} />
          </quimera-formulario>
        </div>
      )}
      {producto.modificado && (
        <div className="maestro-botones ">
          <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
            Guardar
          </QBoton>
          <QBoton
            tipo="reset"
            variante="texto"
            onClick={() => init()}
            deshabilitado={!modificado}
          >
            Cancelar
          </QBoton>
        </div>
      )}
      <QModalConfirmacion
        nombre="borrarProducto"
        abierto={estado === "confirmarBorrado"}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar este producto?"
        onCerrar={() => setEstado("edicion")}
        onAceptar={onBorrarConfirmado}
      />      
    </Detalle>
  );
};