import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { puede } from "@olula/lib/dominio.ts";
import { useNavigate } from "react-router";

const documentos = [
  { texto: "Presupuestos", url: "/ventas/presupuesto", regla: "ventas.presupuesto.leer" },
  { texto: "Pedidos", url: "/ventas/pedido", regla: "ventas.pedido.leer" },
  { texto: "Albaranes", url: "/ventas/albaran", regla: "ventas.albaran.leer" },
  { texto: "Facturas", url: "/ventas/factura", regla: "ventas.factura.leer" },
  { texto: "Recibos", url: "/tesoreria/recibo_venta", regla: "tesoreria.recibo_venta" },
];

export const TabDocumentos = ({ clienteId }: { clienteId: string }) => {
  const navigate = useNavigate();

  return (
    <div className="detalle-cliente-tab-contenido">
      <div className="botones">
        {documentos
          .filter((documento) => puede(documento.regla))
          .map((documento) => (
            <QBoton
              key={documento.url}
              variante="borde"
              onClick={() =>
                navigate(`${documento.url}?cliente_id==__${encodeURIComponent(clienteId)}`)
              }
            >
              {documento.texto}
            </QBoton>
          ))}
      </div>
    </div>
  );
};
