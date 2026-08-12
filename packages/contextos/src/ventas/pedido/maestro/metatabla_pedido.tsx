import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { Pedido } from "../diseño.ts";

export const getMetaTablaPedido = () => metaTablaPedido;

const metaTablaPedido: MetaTabla<Pedido> = [
  {
    id: "estado",
    cabecera: "",
    render: (pedido: Pedido) => (
      <ColumnaEstadoTabla
        estados={{
          aprobado: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-deshabilitado-oscuro)"
            />
          ),
          pendiente: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-exito-oscuro)"
            />
          ),
        }}
        estadoActual={pedido.servido == "TOTAL" ? "aprobado" : "pendiente"}
      />
    ),
  },
  {
    id: "codigo",
    cabecera: "Código",
    prioridad: "alta",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
    prioridad: "alta",
    render: (p) => p.cliente.nombre_cliente,
  },
  {
    id: "fecha_salida",
    cabecera: "Fecha salida",
    tipo: "fecha",
    prioridad: "baja",
  },
  {
    id: "almacen_id",
    cabecera: "Almacén",
    prioridad: "baja",
    render: (p) => p.nombre_almacen || p.almacen_id,
  },
  {
    id: "total",
    cabecera: "Total",
    tipo: "moneda",
    prioridad: "alta",
  },
];
