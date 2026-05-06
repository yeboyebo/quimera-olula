import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla, QIcono } from "@olula/componentes/index.js";
import { PedidoNrj } from "../diseño.ts";

export const getMetaTablaPedidoNrj = () => metaTablaPedido;

const metaTablaPedido: MetaTabla<PedidoNrj> = [
  {
    id: "estado",
    cabecera: "",
    render: (pedido: PedidoNrj) => (
      <ColumnaEstadoTabla
        estados={{
          completo: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-exito-oscuro)"
            />
          ),
          pendiente: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-error-oscuro)"
            />
          ),
          parcial: (
            <QIcono
              nombre={"circulo_relleno"}
              tamaño="sm"
              color="var(--color-advertencia-claro)"
            />
          ),
        }}
        estadoActual={pedido.estado_envio_palets}
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
