import {
  Listado,
  MaestroDetalleResponsive,
  MetaTabla,
  QBoton,
  QModal,
} from "@olula/componentes/index.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useState } from "react";
import { Producto } from "../diseño.ts";
import { getProductos } from "../infraestructura.ts";
import { AltaProducto } from "./AltaProducto.tsx";
import { DetalleProducto } from "./DetalleProducto/DetalleProducto.tsx";
// import "./MaestroConDetalleProducto.css";

const metaTablaProducto: MetaTabla<Producto> = [
  { id: "id", cabecera: "Código" },
  { id: "descripcion", cabecera: "Descripción" },
];
type Estado = "lista" | "alta" | "confimarBorrado";

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
        return "lista";
      },
      CANCELAR_SELECCION: () => {
        productos.limpiarSeleccion();
      },
    },
    confimarBorrado: {},
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  return (
    <div className="Producto">
      <MaestroDetalleResponsive<Producto>
        seleccionada={productos.seleccionada}
        Maestro={
          <>
            <h2>Productos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
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
