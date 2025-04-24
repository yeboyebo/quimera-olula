import { useEffect, useState } from "react";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { obtenerOpcionesSelector } from "../../../comun/infraestructura.ts";

interface FormaPagoProps {
  forma_pago_id: string;
  forma_pago: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
  getProps?: (campo: string) => Record<string, unknown>;
}

export const FormaPago = ({
  forma_pago_id,
  onChange,
  getProps,
}: FormaPagoProps) => {
  const [opcionesFormaPago, setOpcionesFormaPago] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpcionesFormaPago = async () => {
      const opciones = await obtenerOpcionesSelector("formapago")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpcionesFormaPago(opcionesMapeadas);
    };

    cargarOpcionesFormaPago();
  }, []);

  return (
    <QSelect
      label="Forma de Pago"
      nombre="forma_pago_id"
      valor={forma_pago_id}
      onChange={onChange}
      opciones={opcionesFormaPago}
      {...(getProps ? getProps("forma_pago_id") : {})}
    />
  );
};
