import { useState } from "react";

import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { QModal } from "../../../../../../componentes/moleculas/qmodal.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { Producto } from "../diseño.ts";
import {
  deleteProducto,
  getProductos,
} from "../infraestructura.ts";
import { AltaProducto } from "./AltaProducto.tsx";
import { DetalleProducto } from "./DetalleProducto/DetalleProducto.tsx";
// import "./MaestroConDetalleProducto.css";

const metaTablaProducto: MetaTabla<Producto> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripción" }
];
type Estado = "lista" | "alta" | "confimarBorrado";

export const MaestroConDetalleProducto = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const productos = useLista<Producto>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      PRODUCTO_CREADO: (payload: unknown) => {
        console.log("mimensaje_PRODUCTO_CREADO", payload);
        const producto = payload as Producto;
        productos.añadir(producto);
        return "lista";
      },
      ALTA_CANCELADA: "lista",
    },
    lista: {
      ALTA_INICIADA: "alta",
      PRODUCTO_CAMBIADO: (payload: unknown) => {
        const producto = payload as Producto;
        productos.modificar(producto);
      },
      PRODUCTO_BORRADO: (payload: unknown) => {
        return "confimarBorrado";
      },
      CANCELAR_SELECCION: () => {
        productos.limpiarSeleccion();
      },
    },
    confimarBorrado: {
      PRODUCTO_BORRADO_CONFIRMADO: (payload: unknown) => {
        const producto = payload as Producto;
        productos.eliminar(producto);
        return "lista";
      }
    }
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarProducto = async () => {
    if (!productos.seleccionada) {
      return;
    }
    await deleteProducto(productos.seleccionada.id);
    productos.eliminar(productos.seleccionada);
  };

  console.log("mimensaje_MaestroConDetalleProducto", productos);

  return (
    <div className="Producto">
      <MaestroDetalleResponsive<Producto>
        seleccionada={productos.seleccionada}
        Maestro={
          <>
            <h2>Productos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
              <QBoton
                deshabilitado={!productos.seleccionada}
                onClick={onBorrarProducto}
              >
                Borrar
              </QBoton>
            </div>
            <Listado
              metaTabla={metaTablaProducto}
              entidades={productos.lista}
              setEntidades={productos.setLista}
              seleccionada={productos.seleccionada}
              setSeleccionada={productos.seleccionar}
              cargar={getProductos}
            />
          </>
        }
        Detalle={
          <DetalleProducto
            productoInicial={productos.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("ALTA_CANCELADA")}
      >
        <AltaProducto emitir={emitir} />
      </QModal>
    </div>
  );
};