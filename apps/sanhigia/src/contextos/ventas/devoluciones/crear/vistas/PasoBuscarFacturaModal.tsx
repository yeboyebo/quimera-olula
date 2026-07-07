import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { FacturaSelector } from "@olula/ctx/ventas/comun/componentes/factura.tsx";

export const PasoBuscarFacturaModal = ({
  abierto,
  idFactura,
  descripcionFactura,
  error,
  onCerrar,
  onFacturaSeleccionada,
  onSiguiente,
}: {
  abierto: boolean;
  idFactura: string;
  descripcionFactura: string;
  error: string;
  onCerrar: () => void;
  onFacturaSeleccionada: (
    factura: { valor: string; descripcion: string } | null
  ) => void;
  onSiguiente: () => void;
}) => {
  return (
    <QModal
      abierto={abierto}
      nombre="buscar_factura_devolucion"
      titulo="Nueva devolución"
      onCerrar={onCerrar}
    >
      <div className="buscar-factura-devolucion">
        <FacturaSelector
          valor={idFactura}
          descripcion={descripcionFactura}
          nombre="devolucion/factura"
          label="Buscar factura"
          autoFocus={abierto}
          onChange={onFacturaSeleccionada}
        />

        <div className="botones">
          <QBoton onClick={onSiguiente} deshabilitado={!idFactura}>
            Siguiente
          </QBoton>
          <QBoton tipo="reset" variante="texto" onClick={onCerrar}>
            Cancelar
          </QBoton>
        </div>

        {error && <p className="mensaje-error">{error}</p>}
      </div>
    </QModal>
  );
};
