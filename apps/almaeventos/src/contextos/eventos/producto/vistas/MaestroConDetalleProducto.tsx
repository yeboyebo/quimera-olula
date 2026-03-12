import { MetaTabla, QBoton, QModal } from "@olula/componentes/index.ts";
import { ListadoActivoControlado } from "@olula/componentes/maestro/ListadoActivoControlado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useCallback, useEffect, useState } from "react";
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
  const [criteria, setCriteria] = useState<Criteria>(criteriaDefecto);
  const [cargando, setCargando] = useState(false);
  const [totalProductos, setTotalProductos] = useState(0);
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

  const recargar = useCallback(
    async (nuevaCriteria: Criteria) => {
      setCriteria(nuevaCriteria);
      setCargando(true);
      const { datos, total } = await getProductos(
        nuevaCriteria.filtro,
        nuevaCriteria.orden,
        nuevaCriteria.paginacion
      );
      productos.setLista(datos);
      setTotalProductos(total);
      setCargando(false);
    },
    [productos]
  );

  useEffect(() => {
    void recargar(criteriaDefecto);
  }, []);

  return (
    <div className="Producto">
      <MaestroDetalle<Producto>
        seleccionada={productos.seleccionada?.id}
        Maestro={
          <>
            <h2>Productos</h2>
            <div className="maestro-botones">
              <QBoton onClick={() => emitir("ALTA_INICIADA")}>Nuevo</QBoton>
            </div>
            <ListadoActivoControlado<Producto>
              metaTabla={metaTablaProducto}
              criteria={criteria}
              criteriaInicial={criteriaDefecto}
              cargando={cargando}
              entidades={productos.lista}
              totalEntidades={totalProductos}
              seleccionada={productos.seleccionada?.id}
              onSeleccion={(id) => {
                const producto = productos.lista.find((item) => item.id === id);
                if (producto) productos.seleccionar(producto);
              }}
              onCriteriaChanged={(nuevaCriteria) =>
                void recargar(nuevaCriteria)
              }
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
