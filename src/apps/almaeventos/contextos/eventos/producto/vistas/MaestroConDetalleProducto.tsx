import { useState } from "react";

import { QBoton } from "../../../../../../componentes/atomos/qboton.tsx";
import { MetaTabla } from "../../../../../../componentes/atomos/qtabla.tsx";
import { Listado } from "../../../../../../componentes/maestro/Listado.tsx";
import { MaestroDetalleResponsive } from "../../../../../../componentes/maestro/MaestroDetalleResponsive.tsx";
import { useLista } from "../../../../../../contextos/comun/useLista.ts";
import { Maquina, useMaquina } from "../../../../../../contextos/comun/useMaquina.ts";
import { Producto } from "../diseño.ts";
import {
  deleteProducto,
  getProductos,
} from "../infraestructura.ts";
import { DetalleProducto } from "./DetalleProducto/DetalleProducto.tsx";
// import "./MaestroConDetalleProducto.css";

const metaTablaProducto: MetaTabla<Producto> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripción" }
];
type Estado = "lista" | "alta";

export const MaestroConDetalleProducto = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const productos = useLista<Producto>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      PRODUCTO_CREADO: (payload: unknown) => {
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
        const producto = payload as Producto;
        productos.eliminar(producto);
      },
      CANCELAR_SELECCION: () => {
        productos.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const onBorrarProducto = async () => {
    if (!productos.seleccionada) {
      return;
    }
    await deleteProducto(productos.seleccionada.id);
    productos.eliminar(productos.seleccionada);
  };

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
    </div>
  );
};