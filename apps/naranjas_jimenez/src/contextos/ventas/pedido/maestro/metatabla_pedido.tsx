import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { Pedido } from "#/ventas/pedido/diseño.ts";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";

export const getMetaTablaPedidoNrj = () => metaTablaPedido;

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
  },
  {
    id: "fecha",
    cabecera: "Fecha",
    tipo: "fecha",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
  },
  {
    id: "total",
    cabecera: "Total",
    tipo: "moneda",
  },
];
