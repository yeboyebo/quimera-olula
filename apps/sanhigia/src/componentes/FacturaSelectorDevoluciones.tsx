import { Factura, OpcionFactura } from "@olula/ctx/ventas/comun/componentes/factura.tsx";

interface FacturaSelectorDevolucionesProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  autoFocus?: boolean;
  deshabilitado?: boolean;
  onChange: (opcion: OpcionFactura | null) => void;
}

export const FacturaSelectorDevoluciones = ({
  descripcion = "",
  valor,
  nombre = "factura_id",
  label = "Seleccionar factura",
  autoFocus = false,
  deshabilitado = false,
  onChange,
}: FacturaSelectorDevolucionesProps) => (
  <Factura
    label={label}
    nombre={nombre}
    valor={valor}
    descripcion={descripcion}
    autoSeleccion
    autoFocus={autoFocus}
    deshabilitado={deshabilitado}
    longitudMinima={3}
    onChange={onChange}
  />
);
