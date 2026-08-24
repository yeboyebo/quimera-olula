import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { Pedido } from "../diseño.ts";

/** El estado agregado de recepción lo calcula el servidor en el campo recibido. */
const estadoRecepcion = (pedido: Pedido): string =>
  ({
    "Sí": "recibido",
    Parcial: "parcial",
  })[pedido.recibido ?? "No"] ?? "pendiente";

export const metaTablaPedido: MetaTabla<Pedido> = [
  {
    id: "recibido",
    cabecera: "",
    render: (pedido: Pedido) => (
      <ColumnaEstadoTabla
        estados={{
          recibido: (
            <QIcono
              nombre="circulo_relleno"
              tamaño="sm"
              color="var(--color-deshabilitado-oscuro)"
            />
          ),
          parcial: (
            <QIcono
              nombre="circulo_relleno"
              tamaño="sm"
              color="var(--color-advertencia-oscuro)"
            />
          ),
          pendiente: (
            <QIcono
              nombre="circulo_relleno"
              tamaño="sm"
              color="var(--color-exito-oscuro)"
            />
          ),
        }}
        estadoActual={estadoRecepcion(pedido)}
      />
    ),
  },
  { id: "codigo", cabecera: "Código", prioridad: "alta" },
  { id: "nombreProveedor", cabecera: "Proveedor", prioridad: "alta" },
  { id: "fecha", cabecera: "Fecha", tipo: "fecha", prioridad: "alta" },
  {
    id: "total",
    cabecera: "Total",
    tipo: "moneda",
    prioridad: "alta",
    divisa: (pedido) => pedido.divisaId,
  },
  { id: "numeroProveedor", cabecera: "Nº proveedor", prioridad: "media" },
  {
    id: "fechaEntrada",
    cabecera: "Fecha entrada",
    tipo: "fecha",
    prioridad: "baja",
  },
  {
    id: "almacenId",
    cabecera: "Almacén",
    prioridad: "baja",
    render: (pedido) => pedido.nombreAlmacen || pedido.almacenId || "",
  },
  { id: "idFiscal", cabecera: "Id Fiscal", prioridad: "baja" },
];
